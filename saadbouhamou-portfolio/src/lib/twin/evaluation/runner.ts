// ─── AI Twin evaluation runner ──────────────────────────────────────────────
// Runs every case against Groq using the REAL compiled system prompt and
// retrieval pipeline — no UI, no dev server required.
//
//   npx tsx src/lib/twin/evaluation/runner.ts
//
// Requires GROQ_API_KEY (or GROQ_API_KEY_PRODUCTION) in .env.local.
// Exit code: 0 when no case scores < 6, 1 otherwise (CI-ready).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { twinKnowledge } from '../knowledge';
import { retrieveContext } from '../retrieval';
import { buildSystemPrompt } from '../prompt';
import { evalCases } from './cases';
import type { EvalCase } from '../types';

// Minimal .env.local loader (no dependency on next/env in standalone runs).
function loadEnvLocal() {
  try {
    const raw = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    // no .env.local — keys must come from the environment
  }
}

interface CaseResult {
  id: string;
  category: string;
  score: number; // /10
  reply: string;
  failures: string[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Groq free/on-demand tiers enforce tight tokens-per-minute caps. Retry 429s
 * with a fixed backoff so a long suite survives without failing spuriously.
 * Transient network errors (DNS/connect timeouts) get the same treatment.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts = 6
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, init);
      if (res.status !== 429) return res;
      if (i === attempts - 1) return res;
      console.log(`  …429 rate-limited, waiting 25s (attempt ${i + 1}/${attempts})`);
    } catch (error) {
      lastError = error;
      if (i === attempts - 1) throw error;
      console.log(`  …network error, waiting 25s (attempt ${i + 1}/${attempts})`);
    }
    await sleep(25_000);
  }
  throw lastError;
}

function checkLanguage(reply: string, lang?: EvalCase['expectLanguage']): string | null {
  if (!lang) return null;
  const hasArabicScript = /[\u0600-\u06FF]/.test(reply);
  switch (lang) {
    case 'darija-arabic':
      return hasArabicScript ? null : 'expected Arabic-script reply, got Latin text';
    case 'darija-latin':
      return hasArabicScript ? 'expected Latin/Arabizi Darija, got Arabic script' : null;
    case 'fr':
      return !hasArabicScript && /[\u00C0-\u017F]|que\b|je\s|j'ai/i.test(reply)
        ? null
        : 'expected a French reply';
    case 'en':
      return !hasArabicScript ? null : 'expected an English reply, got Arabic script';
  }
}

/** Normalize Unicode typography (NBSP, non-breaking hyphen) so ASCII matchers work. */
function normalizeReply(reply: string): string {
  return reply.replace(/[\u00A0\u202F\u2009]/g, ' ').replace(/[\u2010\u2011]/g, '-');
}

async function runCase(
  apiKey: string,
  systemPrompt: string,
  model: string,
  testCase: EvalCase
): Promise<CaseResult> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...(testCase.history ?? []).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: testCase.input },
  ];

  const res = await fetchWithRetry(`https://api.groq.com/openai/v1/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: twinKnowledge.limits.maxOutputTokens,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    return {
      id: testCase.id,
      category: testCase.category,
      score: 0,
      reply: '',
      failures: [`API error ${res.status}: ${(await res.text()).slice(0, 200)}`],
    };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply = normalizeReply(data.choices?.[0]?.message?.content ?? '');
  const failures: string[] = [];

  // Factuality / safety matchers (2 pts each)
  for (const m of testCase.mustMatch ?? []) {
    const ok = typeof m === 'string' ? reply.toLowerCase().includes(m.toLowerCase()) : m.test(reply);
    if (!ok) failures.push(`missing expected: ${m}`);
  }
  for (const m of testCase.mustNotMatch ?? []) {
    const bad =
      typeof m === 'string' ? reply.toLowerCase().includes(m.toLowerCase()) : m.test(reply);
    if (bad) failures.push(`forbidden content present: ${m}`);
  }

  // Language (2 pts)
  const langFailure = checkLanguage(reply, testCase.expectLanguage);
  if (langFailure) failures.push(`language: ${langFailure}`);

  // Brevity (1 pt)
  if (testCase.maxChars && reply.length > testCase.maxChars) {
    failures.push(`too verbose: ${reply.length} > ${testCase.maxChars} chars`);
  }

  // Persona markers (1 pt)
  if (/as an AI|language model|knowledge base says/i.test(reply)) {
    failures.push('persona break: AI-disclaimer phrasing');
  }

  // Score: start at 10, −2 per hard failure, floor 0. A reply that breaks a
  // matcher is a real failure; missing soft stylistic points cap at 8.
  const hardPenalty = failures.filter((f) => !f.startsWith('language:')).length * 2;
  const langPenalty = langFailure ? 2 : 0;
  const score = Math.max(0, 10 - hardPenalty - langPenalty);

  return { id: testCase.id, category: testCase.category, score, reply, failures };
}

async function main() {
  loadEnvLocal();
  const apiKey = process.env.GROQ_API_KEY_PRODUCTION || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('Missing GROQ_API_KEY — cannot run evaluation.');
    process.exit(1);
  }

  const model = 'openai/gpt-oss-20b';
  console.log(`AI Twin evaluation — ${evalCases.length} cases, model ${model}\n`);

  const results: CaseResult[] = [];
  for (const testCase of evalCases) {
    // Retrieval runs exactly like the production route.
    const { factIds } = retrieveContext(twinKnowledge, testCase.input);
    const systemPrompt = buildSystemPrompt(twinKnowledge, factIds);

    let result: CaseResult;
    try {
      result = await runCase(apiKey, systemPrompt, model, testCase);
    } catch (error) {
      // One unreachable case must not kill the rest of the suite.
      result = {
        id: testCase.id,
        category: testCase.category,
        score: 0,
        reply: '',
        failures: [`network error after retries: ${(error as Error).message}`],
      };
    }
    results.push(result);

    const icon = result.score >= 8 ? '✓' : result.score >= 6 ? '~' : '✗';
    console.log(
      `${icon} [${result.score}/10] ${result.id} (${testCase.category})` +
        (result.failures.length ? ` — ${result.failures.join('; ')}` : '')
    );
    // Brief wait to stay friendly to rate limits.
    await new Promise((r) => setTimeout(r, 15_000));
  }

  const failed = results.filter((r) => r.score < 6);
  const avg = results.reduce((s, r) => s + r.score, 0) / results.length;
  console.log(`\nAverage score: ${avg.toFixed(1)}/10 — failures (<6): ${failed.length}`);

  if (failed.length) {
    console.log('\n=== FAILED REPLIES ===');
    for (const f of failed) {
      console.log(`\n[${f.id}] score ${f.score}`);
      console.log(f.reply.slice(0, 400));
    }
  }

  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error('Runner crashed:', e);
  process.exit(1);
});
