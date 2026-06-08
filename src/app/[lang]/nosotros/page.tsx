import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Nosotros" : "About"}
      title={es ? "No somos un despacho contable." : "We are not an accounting practice."}
      lead={
        es
          ? "Una firma de consultoría para empresarios que buscan crecer con control financiero, seguridad fiscal y visión estratégica."
          : "An advisory firm for owners who want to grow with financial control, tax certainty and strategic vision."
      }
    />
  );
}
