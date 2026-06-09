import { getDictionary, type Locale } from "@/content/dictionaries";
import { getServices } from "@/content/services-detail";
import { siteConfig } from "@/lib/site-config";

const T = {
  es: { firm: "Firma", based: "Sede", office: "Oficina", email: "Correo", hours: "Horario", services: "Servicios", includes: "Incluye", about: "Cómo trabaja VBT" },
  en: { firm: "Firm", based: "Based in", office: "Office", email: "Email", hours: "Hours", services: "Services", includes: "Includes", about: "How VBT works" },
} as const;

/**
 * Compila el contenido real de VBT (servicios, contacto) en un bloque de
 * conocimiento para el system prompt del chat. Lee de las mismas fuentes que
 * renderiza el sitio, así el bot queda en sincronía y no inventa.
 */
export function buildKnowledge(locale: Locale): string {
  const t = T[locale];
  const d = getDictionary(locale);
  const o = siteConfig.offices[0];

  const firm = [
    `## ${t.firm}`,
    `${siteConfig.legalName}. ${siteConfig.tagline[locale]}`,
    `${t.office}: ${o.address}. ${t.hours}: ${siteConfig.hours[locale]}.`,
    `${t.email}: ${siteConfig.email}. ${locale === "es" ? "Teléfono" : "Phone"}: ${o.phone}.`,
  ].join("\n");

  const services = [
    `## ${t.services}`,
    getServices(locale)
      .map((s) => {
        const lines = [`### ${s.name}`, s.intro];
        if (s.items.length) {
          lines.push(`${t.includes}: ${s.items.map((it) => it.name).join("; ")}.`);
        }
        return lines.join("\n");
      })
      .join("\n\n"),
  ].join("\n\n");

  const about = [`## ${t.about}`, d.about.hero.lead, ...d.about.approach.paragraphs].join("\n");

  return [firm, services, about].join("\n\n");
}
