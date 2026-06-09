import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/schema";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Notifica un lead nuevo por email (solo si hay RESEND_API_KEY configurada). */
async function notify(lead: {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  locale: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const lines = [
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    lead.phone && `Teléfono: ${lead.phone}`,
    lead.company && `Empresa: ${lead.company}`,
    lead.service && `Servicio: ${lead.service}`,
    `Idioma: ${lead.locale}`,
    "",
    lead.message,
  ].filter(Boolean);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VBT Consultores <onboarding@resend.dev>",
        to: ["Rvila@vbtconsultores.com"],
        reply_to: lead.email,
        subject: `Nuevo lead · ${lead.name}`,
        text: lines.join("\n"),
      }),
    });
  } catch {
    // El email es best-effort: si falla, el lead ya quedó guardado en la DB.
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  if (!name || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const company = str(body.company);
  const service = str(body.service);
  const qualification =
    company || service
      ? { ...(company ? { company } : {}), ...(service ? { service } : {}) }
      : null;

  try {
    await db.insert(leads).values({
      name,
      email,
      phone: str(body.phone) || null,
      message: str(body.message) || null,
      qualification,
      locale: str(body.locale) === "en" ? "en" : "es",
      source: str(body.source) === "bot" ? "bot" : "form",
      sourceUrl: str(body.sourceUrl) || null,
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  await notify({
    name,
    email,
    phone: str(body.phone),
    company,
    service,
    message: str(body.message),
    locale: str(body.locale) === "en" ? "en" : "es",
  });
  return NextResponse.json({ ok: true });
}
