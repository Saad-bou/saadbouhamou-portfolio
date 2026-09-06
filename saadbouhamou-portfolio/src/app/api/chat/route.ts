import { createGroq } from "@ai-sdk/groq";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { twinKnowledge } from "@/lib/twin/knowledge";
import { buildSystemPrompt } from "@/lib/twin/prompt";
import { retrieveContext } from "@/lib/twin/retrieval";
import {
  validateChatRequest,
  trimHistory,
  latestUserText,
} from "@/lib/twin/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const GROQ_MODEL = "openai/gpt-oss-20b";

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GROQ_API_KEY_PRODUCTION || process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Safe logging only — never log message content or keys.
      console.error("[Chat API] Missing Groq API key in environment.");
      return Response.json(
        {
          error:
            "The AI Twin is temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const validation = validateChatRequest(body, twinKnowledge.limits);
    if (!validation.ok) {
      return Response.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    // Bound the conversation, then retrieve only relevant knowledge.
    const trimmed = trimHistory(validation.messages, twinKnowledge.limits);
    const retrieved = retrieveContext(twinKnowledge, latestUserText(trimmed));
    const systemPrompt = buildSystemPrompt(twinKnowledge, retrieved.factIds);

    const modelMessages = await convertToModelMessages(trimmed as UIMessage[]);
    const groq = createGroq({ apiKey });

    const result = streamText({
      model: groq(GROQ_MODEL),
      system: systemPrompt,
      messages: modelMessages,
      maxOutputTokens: twinKnowledge.limits.maxOutputTokens,
      onError: ({ error }) => {
        console.error("[Chat API] Groq stream error:", error);
      },
    });

    return result.toUIMessageStreamResponse({ sendReasoning: false });
  } catch (error) {
    console.error("[Chat API] Request failed:", (error as Error).message);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
