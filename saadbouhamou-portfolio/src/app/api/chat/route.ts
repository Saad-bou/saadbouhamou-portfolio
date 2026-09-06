import { createGroq } from "@ai-sdk/groq";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 🚀 لقطة مضمونة: كيقرا PRODUCTION إيلا كان، و fallback لـ الـ KEY العادي د الـ Local
    const apiKey = process.env.GROQ_API_KEY_PRODUCTION || process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("[Chat API Error] Missing Groq API key in environment variables.");
      return new Response(JSON.stringify({ error: "Missing Groq API key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as { messages: UIMessage[] };
    console.log("Chat API received messages:", messages);
    const modelMessages = await convertToModelMessages(messages);
    const groq = createGroq({ apiKey });

    const result = streamText({
      model: groq('openai/gpt-oss-20b'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      maxOutputTokens: 500,
      onError: ({ error }) => {
        console.error("Groq Stream Error (mid-stream):", error);
      },
    });

    // رجعنا لـ الكود الأصلي المستقر اللي كيموت عليه الـ Local
    return result.toUIMessageStreamResponse({ sendReasoning: false });
  } catch (error) {
    console.error("Groq Stream Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}