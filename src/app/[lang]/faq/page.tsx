import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/dictionaries";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Accordion } from "@/components/site/Accordion";
import { PillButton } from "@/components/site/PillButton";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const f = d.faqPage;

  return (
    <>
      <section className="mx-auto max-w-[1280px] px-5 pt-40 pb-12 sm:px-8 sm:pt-48">
        <SectionHeading eyebrow={f.eyebrow} title={f.title} lead={f.lead} />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-8 sm:px-8">
        <Reveal>
          <Accordion items={f.items} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
        <Reveal className="flex flex-col items-start gap-7">
          <h2 className="max-w-2xl font-serif text-[clamp(2rem,5vw,3.6rem)] font-normal leading-[1.04] tracking-[-0.02em] text-chalk">
            {d.home.cta.title}
          </h2>
          <p className="max-w-md text-[17px] leading-relaxed text-bone/90">
            {d.home.cta.lead}
          </p>
          <PillButton href={`/${lang}/contacto`} variant="primary" arrow>
            {d.home.cta.button}
          </PillButton>
        </Reveal>
      </section>
    </>
  );
}
