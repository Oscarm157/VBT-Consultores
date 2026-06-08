import { isLocale } from "@/content/dictionaries";
import { Placeholder } from "@/components/site/Placeholder";

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const es = isLocale(lang) ? lang === "es" : true;
  return (
    <Placeholder
      eyebrow={es ? "Contacto" : "Contact"}
      title={es ? "Hablemos de tu empresa." : "Let's talk about your company."}
      lead={
        es
          ? "Agenda una consulta. Respondemos en un día hábil."
          : "Book a consultation. We reply within one business day."
      }
    />
  );
}
