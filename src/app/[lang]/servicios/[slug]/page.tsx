import { notFound } from "next/navigation";
import { dictionaries, isLocale, locales } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

const SLUGS = ["fiscal", "financiera", "empresarial"] as const;

export function generateStaticParams() {
  return locales.flatMap((lang) => SLUGS.map((slug) => ({ lang, slug })));
}

export default async function ServicioDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const service = dictionaries[lang].services.items.find((s) => s.slug === slug);
  if (!service) notFound();
  const es = lang === "es";
  return (
    <Placeholder
      eyebrow={es ? "Servicio" : "Service"}
      title={service.name}
      lead={service.summary}
    />
  );
}
