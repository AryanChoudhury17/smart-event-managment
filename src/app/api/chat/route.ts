/**
 * @fileoverview AI Chat API route with streaming support
 * @module app/api/chat/route
 */

import { type NextRequest, NextResponse } from "next/server";
import { openai, SYSTEM_PROMPTS, sanitizeAIOutput } from "@/lib/ai/openai";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { ChatMessageSchema, sanitizeInput } from "@/lib/validators";
import { addSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/chat
 *
 * Streams AI responses using OpenAI GPT-4o.
 * Implements rate limiting, input validation, and output sanitization.
 *
 * @param request - Next.js request object
 * @returns Streaming text response
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = rateLimit(clientIP, { limit: 30, windowMs: 60 * 1000 });

    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { error: "Rate limit exceeded. Please wait before sending another message." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
          },
        },
      );

      return addSecurityHeaders(response);
    }

    // Parse and validate input
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const response = NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const result = ChatMessageSchema.safeParse(body);
    if (!result.success) {
      const response = NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 },
      );
      return addSecurityHeaders(response);
    }

    const { content, sessionType, language } = result.data;

    // Check if OpenAI API key is available (demo mode fallback)
    const isDemoMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-...";

    if (isDemoMode) {
      const response = getDemoResponse(content, sessionType);
      // Demo responses don't need security headers as they're just streams
      return response;
    }

    // Build system prompt
    const systemPrompt = SYSTEM_PROMPTS[sessionType];
    const languageInstruction =
      language !== "en"
        ? `\n\nIMPORTANT: The user prefers responses in ${language}. Respond in that language.`
        : "";

    try {
      const stream = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt + languageInstruction,
          },
          {
            role: "user",
            content: sanitizeInput(content),
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      });

      // Create streaming response
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content ?? "";
              if (delta) {
                const sanitized = sanitizeAIOutput(delta);
                const data = JSON.stringify({ content: sanitized });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }

              if (chunk.choices[0]?.finish_reason === "stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            }
            controller.close();
          } catch (error) {
            const message = error instanceof Error ? error.message : "Stream error";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
            controller.close();
          }
        },
      });

      const response = new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      });

      return addSecurityHeaders(response as NextResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI service error";
      console.error("[Chat API Error]:", message);

      const response = NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 503 });
      return addSecurityHeaders(response);
    }
  } catch (error) {
    console.error("[Chat POST Error]:", error);

    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

/**
 * Returns a demo streaming response when API key is not configured
 */
function getDemoResponse(content: string, sessionType: string): Response {
  const demoResponses: Record<string, string> = {
    NAVIGATION: `🗺️ **Navigation** Demo: Suggested route based on "${content}"`,
    CROWD: `👥 **Crowd Analytics** Demo: Current capacity at 90%`,
    GENERAL: `⚽ **StadiumGPT** Demo: Ready to assist with: Navigation, Crowds, Support`,
  };

  const responseText = demoResponses[sessionType] ?? demoResponses["GENERAL"] ?? "Demo response";
  const words = responseText.split(" ");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const word = i === 0 ? words[i] : ` ${words[i]}`;
        const data = JSON.stringify({ content: word });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        await new Promise((r) => setTimeout(r, 30));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
