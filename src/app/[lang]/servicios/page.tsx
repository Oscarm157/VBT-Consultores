import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Servicios" : "Services"}
      title={es ? "Tres frentes, un mismo criterio." : "Three fronts, one standard."}
      lead={
        es
          ? "Consultoría fiscal, financiera y empresarial bajo una sola firma."
          : "Tax, financial and business advisory under a single firm."
      }
    />
  );
}
