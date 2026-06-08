import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Preguntas frecuentes" : "FAQ"}
      title={es ? "Lo que suelen preguntar." : "What clients usually ask."}
    />
  );
}
