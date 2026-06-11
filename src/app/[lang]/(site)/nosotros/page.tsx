import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/dictionaries";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SignalLine } from "@/components/site/SignalLine";
import { PillButton } from "@/components/site/PillButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const a = getDictionary(lang).about;
  return { title: a.hero.eyebrow, description: a.hero.lead };
}

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const a = d.about;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-5 pt-40 pb-20 sm:px-8 sm:pt-48 lg:pb-28">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
              {a.hero.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-4xl font-serif text-[clamp(2.5rem,7vw,5.2rem)] font-normal leading-[0.99] tracking-[-0.03em] text-chalk">
              {a.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <SignalLine className="mt-8 w-24" />
            <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-bone/90 sm:text-[20px]">
              {a.hero.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Enfoque */}
      <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
              {a.approach.eyebrow}
            </span>
            <h2 className="mt-6 font-serif text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.05] tracking-[-0.02em] text-chalk">
              {a.approach.title}
            </h2>
          </Reveal>
          <div className="flex flex-col gap-7">
            {a.approach.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-[17px] leading-relaxed text-bone/90 sm:text-[18px]">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow={a.audienceEyebrow}
            title={d.home.audience.title}
            lead={d.home.audience.lead}
            rule={false}
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {d.home.audience.items.map((item, i) => (
              <Reveal key={item} delay={i * 0.06} className="bg-ink">
                <div className="flex h-full flex-col justify-between gap-12 p-7">
                  <span className="font-mono text-[12px] tabular-nums text-bone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-[20px] leading-snug tracking-[-0.01em] text-chalk">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principios */}
      <section className="border-t border-line bg-surface-1/40">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
          <SectionHeading eyebrow={a.valuesEyebrow} title={d.home.values.title} />
          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {d.home.values.items.map((v, i) => (
              <Reveal key={v.name} delay={(i % 3) * 0.06}>
                <div className="border-t border-line pt-6">
                  <span className="font-mono text-[12px] tabular-nums text-bone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-[22px] font-normal tracking-[-0.01em] text-chalk">
                    {v.name}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-bone/80">
                    {v.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-5 py-28 sm:px-8 lg:py-36">
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
