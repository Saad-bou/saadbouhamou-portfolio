// ─── Conversation context management ────────────────────────────────────────
// Input validation + bounded history for /api/chat. Stateless across
// sessions: only the current conversation is used, never persisted.

import type { UIMessage } from 'ai';
import type { TwinLimits } from './types';

export type ValidateResult =
  | { ok: true; messages: UIMessage[] }
  | { ok: false; status: number; error: string };

/** Extract plain text from a UIMessage for validation/retrieval purposes. */
export function extractMessageText(msg: UIMessage): string {
  const anyMsg = msg as unknown as { parts?: Array<{ type?: string; text?: string }> };
  return (anyMsg.parts ?? [])
    .filter((p) => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join(' ');
}

/**
 * Validate the incoming request body: shape, per-message size, history size.
 * Returns a graceful error the UI can render instead of crashing the stream.
 */
export function validateChatRequest(
  body: unknown,
  limits: TwinLimits
): ValidateResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'Invalid request body.' };
  }
  const { messages } = body as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, status: 400, error: 'No messages provided.' };
  }
  if (messages.length > 100) {
    return { ok: false, status: 400, error: 'Conversation is too long. Start a new one.' };
  }
  for (const msg of messages) {
    const m = msg as UIMessage;
    if (!m || typeof m !== 'object' || typeof m.id !== 'string' || m.role === undefined) {
      return { ok: false, status: 400, error: 'Malformed message in conversation.' };
    }
    if (m.role === 'user' && extractMessageText(m).length > limits.maxInputChars) {
      return {
        ok: false,
        status: 413,
        error: `Message is too long. Please keep it under ${limits.maxInputChars} characters.`,
      };
    }
  }
  return { ok: true, messages: messages as UIMessage[] };
}

/**
 * Keep the last N messages so a long session cannot blow up the context
 * window or latency. Core identity lives in the system prompt, so dropping
 * old turns never removes who Saad is.
 */
export function trimHistory(messages: UIMessage[], limits: TwinLimits): UIMessage[] {
  if (messages.length <= limits.historyMessages) return messages;
  return messages.slice(-limits.historyMessages);
}

/** Text of the latest user message — the retrieval key. */
export function latestUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') return extractMessageText(messages[i]);
  }
  return '';
}
