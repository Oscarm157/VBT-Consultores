import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Tijuana, B.C." : "Tijuana, B.C."}
      title={es ? "Estrategia, cumplimiento y crecimiento." : "Strategy, compliance and growth."}
      lead={
        es
          ? "Firma de consultoría fiscal, financiera y empresarial para empresarios que buscan crecer con control."
          : "Tax, financial and business advisory for owners who want to grow with control."
      }
    />
  );
}
