import { groq } from '@ai-sdk/groq';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: UIMessage[] };

    // Convert UIMessages (parts-based) to ModelMessages (content-based) for streamText
    const modelMessages = await convertToModelMessages(messages);

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

