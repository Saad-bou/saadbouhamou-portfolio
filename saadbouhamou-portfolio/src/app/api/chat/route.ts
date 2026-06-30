import { createGroq } from '@ai-sdk/groq';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getGroqApiKey() {
  return process.env.NODE_ENV === 'production'
    ? process.env.GROQ_API_KEY_PRODUCTION || process.env.GROQ_API_KEY
    : process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_PRODUCTION;
}

export async function POST(req: Request) {
  try {
    const apiKey = getGroqApiKey();

    if (!apiKey) {
      console.error('[Chat API Error] Missing Groq API key. Set GROQ_API_KEY_PRODUCTION in production or GROQ_API_KEY locally.');
      return new Response(
        JSON.stringify({ error: 'Missing Groq API key' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json() as { messages: UIMessage[] };

    // Convert UIMessages (parts-based) to ModelMessages (content-based) for streamText
    const modelMessages = await convertToModelMessages(messages);
    const groq = createGroq({ apiKey });

    const result = streamText({
      model: groq('qwen/qwen3.6-27b'),
      providerOptions: {
        groq: {
          reasoningFormat: 'hidden',
          reasoningEffort: 'none',
        },
      },
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse({ sendReasoning: false });
  } catch (error) {
    console.error('[Chat API Error]', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

