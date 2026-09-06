// ─── Topic-based knowledge retrieval ────────────────────────────────────────
// Deterministic keyword scoring — no embeddings, no vector DB. The knowledge
// base is small (~25 facts), so topic retrieval keeps the prompt lean without
// a retrieval service. Interface is deliberately RAG-shaped: swap the body of
// retrieveContext() for embeddings later without touching the route or UI.

import type { KnowledgeFact, RetrievedContext, Topic, TwinKnowledge } from './types';

/** Generic words per topic that boost retrieval even without a specific keyword hit. */
const TOPIC_SYNONYMS: Record<Topic, string[]> = {
  identity: ['who are you', 'introduce', 'about you'],
  personal: ['you', 'your', 'dyalk', 'dyal'],
  education: ['education', 'study', 'studies', 'school', 'degree', 'diploma', 'licence', 'ismagi', 'bac', 'قراية', 'etude'],
  experience: ['experience', 'work', 'worked', 'job', 'career history', 'internship', 'stage', 'خدمة', 'experience professionnelle'],
  projects: ['project', 'projects', 'build', 'built', 'portfolio', 'site', 'website', 'app', 'projet', 'projets', 'مشروع'],
  skills: ['skill', 'skills', 'stack', 'technologies', 'tech', 'tools', 'framework', 'كومبيتونس'],
  services: ['service', 'offer', 'freelance', 'hire', 'collaborate', 'work with you'],
  career: ['hire', 'hiring', 'recruit', 'job', 'opportunity', 'cv', 'resume', 'recrutement'],
  availability: ['available', 'availability', 'when', 'start', 'free'],
  contact: ['contact', 'email', 'reach', 'linkedin', 'github', 'whatsapp', 'phone'],
  personality: ['yourself', 'personality', 'philosophy', 'approach', 'style'],
  languages: ['language', 'speak', 'parle', 'langue'],
};

function normalize(text: string): string {
  return text.toLowerCase();
}

/**
 * Score every fact against the user's message; facts whose topic or keywords
 * match are pulled into context. Core facts are handled by the prompt
 * compiler and are not filtered here.
 */
export function retrieveContext(
  knowledge: TwinKnowledge,
  userMessage: string
): RetrievedContext {
  const message = normalize(userMessage);
  const scores = new Map<Topic, number>();

  for (const [topic, synonyms] of Object.entries(TOPIC_SYNONYMS) as Array<[Topic, string[]]>) {
    let score = 0;
    for (const syn of synonyms) {
      if (message.includes(syn)) score += 1;
    }
    if (score > 0) scores.set(topic, score);
  }

  const factIds: string[] = [];
  for (const fact of knowledge.facts) {
    if (fact.core) continue;
    let score = scores.get(fact.topic) ?? 0;
    for (const kw of fact.keywords) {
      if (message.includes(kw)) score += 2;
    }
    if (score > 0) factIds.push(fact.id);
  }

  // Always include contact facts — a visitor asking anything hiring-adjacent
  // should never hit a dead end.
  for (const fact of knowledge.facts) {
    if (fact.topic === 'contact' && !factIds.includes(fact.id)) factIds.push(fact.id);
  }

  const matchedTopics = [...scores.entries()]
    .map(([topic, score]) => ({ topic, score }))
    .sort((a, b) => b.score - a.score);

  return { factIds, matchedTopics };
}

export function getFactsById(knowledge: TwinKnowledge, ids: string[]): KnowledgeFact[] {
  const byId = new Map(knowledge.facts.map((f) => [f.id, f]));
  return ids.map((id) => byId.get(id)).filter((f): f is KnowledgeFact => Boolean(f));
}
