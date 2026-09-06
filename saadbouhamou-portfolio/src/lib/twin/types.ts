// ─── AI Twin knowledge layer types ──────────────────────────────────────────
// Strict TypeScript contracts for the twin's knowledge base, retrieval
// results, and prompt compilation. The UI never imports these — only
// /api/chat does.

export type Topic =
  | 'identity'
  | 'personal'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'services'
  | 'career'
  | 'availability'
  | 'contact'
  | 'personality'
  | 'languages';

/**
 * One atomic, verifiable fact. The prompt compiler renders each enabled
 * fact exactly once — no prose/JSON duplication.
 */
export interface KnowledgeFact {
  id: string;
  topic: Topic;
  /** Deterministic retrieval keys (lowercase, matched against the user's message). */
  keywords: string[];
  /** The fact, already written in first person ("I ..."). */
  statement: string;
  /** Extra detail the model may use when the topic is retrieved. */
  details?: string[];
  /** Always injected into the system prompt regardless of retrieval. */
  core?: boolean;
}

export interface LanguageRule {
  id: string;
  /** Lower priority number = evaluated first. */
  priority: number;
  rule: string;
}

export interface PersonaExample {
  id: string;
  user: string;
  twin: string;
  /** Language tag for documentation; behavior lives in the example itself. */
  lang: 'en' | 'fr' | 'darija-latin' | 'darija-arabic';
}

export interface TwinLimits {
  maxOutputTokens: number;
  /** Maximum characters accepted per user message. */
  maxInputChars: number;
  /** Maximum user+assistant messages kept in the model context. */
  historyMessages: number;
}

export interface TwinKnowledge {
  identity: {
    name: string;
    role: string;
    engineDisclosure: string;
  };
  facts: KnowledgeFact[];
  languageRules: LanguageRule[];
  personaExamples: PersonaExample[];
  fallbacks: {
    outOfScope: string[];
    unknown: string;
  };
  limits: TwinLimits;
}

/** Result of topic retrieval over the knowledge base. */
export interface RetrievedContext {
  /** Fact ids selected by retrieval (core facts are always included implicitly). */
  factIds: string[];
  /** Matched topics in score order, for debugging/eval output. */
  matchedTopics: Array<{ topic: Topic; score: number }>;
}

export type EvalCategory =
  | 'IDENTITY'
  | 'EXPERIENCE'
  | 'EDUCATION'
  | 'PROJECTS'
  | 'TECHNICAL'
  | 'AI'
  | 'CAREER'
  | 'HIRING'
  | 'LANGUAGE'
  | 'CONTEXT'
  | 'SAFETY'
  | 'PROMPT_INJECTION'
  | 'UNKNOWN_INFORMATION';

export interface EvalCase {
  id: string;
  category: EvalCategory;
  input: string;
  /** Previous turns to test context handling (alternating user/assistant). */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** All must appear (case-insensitive substring or regex). */
  mustMatch?: Array<string | RegExp>;
  /** None may appear (case-insensitive) — leaks, wrong script, hallucination markers. */
  mustNotMatch?: Array<string | RegExp>;
  /** Dominant expected reply script/language, checked heuristically. */
  expectLanguage?: 'en' | 'fr' | 'darija-latin' | 'darija-arabic';
  /** Soft upper bound on reply length in characters. */
  maxChars?: number;
}
