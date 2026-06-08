import { NextResponse } from "next/server";

/**
 * Stub de captura de leads (M6). Valida lo mínimo y responde ok.
 * M7 lo reemplaza: inserta en Neon (Drizzle) y notifica por Resend a
 * Rvila@vbtconsultores.com. No persiste todavía.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // TODO (M7): persistir en DB + enviar email de notificación.
  return NextResponse.json({ ok: true });
}
