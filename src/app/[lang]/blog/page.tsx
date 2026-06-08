import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Blog y noticias" : "Blog and news"}
      title={es ? "Criterio fiscal y financiero, en claro." : "Tax and financial perspective, in plain terms."}
    />
  );
}
