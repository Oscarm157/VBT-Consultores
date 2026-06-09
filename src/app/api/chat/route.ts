import Anthropic from "@anthropic-ai/sdk";
import type { Tool } from "@anthropic-ai/sdk/resources";
import { buildPersona } from "@/lib/chat/persona";
import { buildKnowledge } from "@/lib/chat/knowledge";

export const runtime = "nodejs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOLS: Tool[] = [
  {
    name: "update_lead_info",
    description:
      "Llama esta herramienta SOLO cuando el visitante proporcione voluntariamente su nombre, correo o teléfono durante la conversación. Captura lo que comparta de forma natural; no pidas los tres a la vez.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Nombre completo del prospecto" },
        email: { type: "string", description: "Correo electrónico" },
        phone: { type: "string", description: "Número de teléfono" },
      },
      required: [],
    },
  },
  {
    name: "update_qualification",
    description:
      "Llama esta herramienta cuando el visitante conteste una pregunta de calificación, aunque sea de pasada: el frente que necesita (fiscal, financiero o empresarial), su giro o tipo de empresa, o su urgencia. Captura solo lo que realmente dijo; deja vacío el resto.",
    input_schema: {
      type: "object",
      properties: {
        service: { type: "string", description: "Frente que necesita: Fiscal, Financiera o Empresarial" },
        industry: { type: "string", description: "Giro o tipo de empresa del visitante" },
        urgency: { type: "string", description: "Urgencia o plazo de la necesidad" },
      },
      required: [],
    },
  },
  {
    name: "suggest_replies",
    description:
      "Llama esta herramienta junto con tu respuesta de texto cuando hagas una pregunta de calificación con respuestas cortas predecibles: frente, tipo de empresa, urgencia. NO la llames para preguntas abiertas sobre la situación específica del visitante.",
    input_schema: {
      type: "object",
      properties: {
        options: {
          type: "array",
          items: { type: "string" },
          description: "2 a 4 opciones de respuesta, cada una de menos de 30 caracteres.",
        },
      },
      required: ["options"],
    },
  },
];

function clean(obj: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v)) as Record<string, string>;
}

function buildSystemPrompt(
  locale: "en" | "es",
  currentLead: Record<string, string | undefined>,
  qualification: Record<string, string | undefined>,
): string {
  const base = `${buildPersona(locale)}\n\n${buildKnowledge(locale)}`;
  const lead = clean(currentLead);
  const qual = clean(qualification);
  if (!Object.keys(lead).length && !Object.keys(qual).length) return base;

  const known = JSON.stringify({ ...lead, ...qual });
  const addendum =
    locale === "es"
      ? `\n\n## Lo que ya sabes de este visitante\n${known}\nNo vuelvas a preguntar nada de lo anterior. Pregunta solo lo que falta y avanza hacia su nombre y datos de contacto.`
      : `\n\n## What you already know about this visitor\n${known}\nDo not ask again for anything above. Ask only for what is still missing and move toward their name and contact.`;

  return base + addendum;
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 4000;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, locale, currentLead, qualification, nudge } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const trimmed = messages.slice(-MAX_MESSAGES);
  if (trimmed.some((m) => typeof m?.content !== "string" || m.content.length > MAX_CONTENT_CHARS)) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (nudge) {
    const note =
      locale === "en"
        ? "(Internal note: the visitor has not replied for a little while. Send ONE short, warm follow-up that re-engages them and moves toward the next step: address their interest, ask the next qualifying question, or ask for their name and contact. Do not repeat what you already said, do not greet again, keep it to one or two sentences.)"
        : "(Nota interna: el visitante no ha respondido en un rato. Envía UN mensaje de seguimiento breve y cordial que lo reenganche y avance hacia el siguiente paso: retoma su interés, haz la siguiente pregunta de calificación, o pídele su nombre y datos de contacto. No repitas lo que ya dijiste, no vuelvas a saludar, máximo una o dos oraciones.)";
    trimmed.push({ role: "user", content: note });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const emit = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const systemPrompt = buildSystemPrompt(locale ?? "es", currentLead ?? {}, qualification ?? {});

        const stream = anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
          messages: trimmed,
          tools: TOOLS,
        });

        let fullText = "";
        const emitText = (text: string) => {
          emit({ type: "text", text });
          fullText += text;
        };

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            emitText(event.delta.text);
          }
        }

        const finalMsg = await stream.finalMessage();
        const toolUseBlocks = finalMsg.content.filter((b) => b.type === "tool_use");

        for (const block of toolUseBlocks) {
          if (block.type === "tool_use") {
            emit({ type: "tool_call", tool: block.name, input: block.input });
          }
        }

        if (!fullText && toolUseBlocks.length > 0) {
          const followUpMessages = [
            ...trimmed,
            { role: "assistant" as const, content: finalMsg.content },
            {
              role: "user" as const,
              content: toolUseBlocks.map((b) => ({
                type: "tool_result" as const,
                tool_use_id: b.type === "tool_use" ? b.id : "",
                content: "Captured successfully.",
              })),
            },
          ];

          const followUp = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 512,
            system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
            messages: followUpMessages,
            tools: TOOLS,
          });

          for await (const event of followUp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              emitText(event.delta.text);
            }
          }
        }

        const lead = currentLead ?? {};
        const leadComplete = Boolean(lead.name && (lead.email || lead.phone));
        if (!nudge && !leadComplete && fullText && !fullText.includes("?")) {
          const advanceNote =
            (locale ?? "es") === "en"
              ? "(Internal note: your previous reply did not end with a question. Reply with ONLY the next question, a single sentence: the next qualifying question, or the ask for the visitor's name and contact. No acknowledgment, no greeting, no preamble, and do not restate anything you already said.)"
              : "(Nota interna: tu respuesta anterior no terminó con una pregunta. Responde SOLO con la siguiente pregunta, una sola oración: la siguiente pregunta de calificación, o pedir el nombre y contacto del visitante. Nada de acuse, saludo ni preámbulo, y no repitas lo que ya dijiste.)";

          const cont = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 256,
            system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
            messages: [
              ...trimmed,
              { role: "assistant" as const, content: fullText },
              { role: "user" as const, content: advanceNote },
            ],
            tools: TOOLS,
          });

          let contStarted = false;
          for await (const event of cont) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              if (!contStarted) {
                emitText("\n\n");
                contStarted = true;
              }
              emitText(event.delta.text);
            }
          }
          const contFinal = await cont.finalMessage();
          for (const block of contFinal.content) {
            if (block.type === "tool_use") {
              emit({ type: "tool_call", tool: block.name, input: block.input });
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("chat stream error", err);
        emit({ type: "error", message: "Algo salió mal. Intenta de nuevo." });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
