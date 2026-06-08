import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function RecursosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Descargas y recursos" : "Downloads and resources"}
      title={es ? "Material de apoyo para tu operación." : "Support material for your operation."}
    />
  );
}
