import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/dictionaries";
import { HeroReveal } from "@/components/site/HeroReveal";
import { FrentesInstrument } from "@/components/site/FrentesInstrument";
import { Reveal } from "@/components/site/Reveal";
import { PillButton } from "@/components/site/PillButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    title: { absolute: "VBT Consultores · v2" },
    description: d.home.hero.lead,
  };
}

export default async function HomeV2({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const h = d.home;
  const title1 = h.hero.title.replace(h.hero.titleAccent, "").trim();

  return (
    <>
      <HeroReveal
        lang={lang}
        title1={title1}
        title2={h.hero.titleAccent}
        paraLeft={h.pillars.lead}
        paraRight={h.audience.lead}
        cta={{ label: h.hero.ctaPrimary, href: `/${lang}/contacto` }}
        navLinks={[
          { label: d.nav.services, href: `/${lang}/servicios` },
          { label: d.nav.about, href: `/${lang}/nosotros` },
          { label: d.nav.resources, href: `/${lang}/recursos` },
          { label: d.nav.faq, href: `/${lang}/faq` },
        ]}
        navCta={{ label: d.nav.contact, href: `/${lang}/contacto` }}
      />

      {/* ===== Diferenciador ===== */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1220px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:py-32">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
              {h.differentiator.eyebrow}
            </span>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance text-chalk">
              {h.differentiator.title}
            </h2>
            <div className="mt-8 h-px w-20 bg-signal" />
          </Reveal>
          <Reveal delay={0.1} className="flex items-end">
            <p className="text-[18px] leading-relaxed text-bone sm:text-[20px]">
              {h.differentiator.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Frentes (scroll instrumento) ===== */}
      <FrentesInstrument
        lang={lang}
        services={d.services.items}
        eyebrow={h.pillars.eyebrow}
        title={h.pillars.title}
        lead={h.pillars.lead}
        cta={h.pillars.cta}
      />

      {/* ===== Para quién ===== */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1220px] px-5 py-24 sm:px-8 lg:py-32">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
              {h.audience.eyebrow}
            </span>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-balance text-chalk">
              {h.audience.title}
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-bone">
              {h.audience.lead}
            </p>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {h.audience.items.map((item, i) => (
              <Reveal key={item} delay={i * 0.06} className="group bg-surface-1">
                <div className="flex h-full flex-col justify-between gap-12 p-7 transition-colors duration-200 group-hover:bg-surface-2">
                  <span className="font-mono text-[12px] tabular-nums text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-chalk">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Valores ===== */}
      <section className="border-b border-line bg-surface-1/40">
        <div className="mx-auto max-w-[1220px] px-5 py-24 sm:px-8 lg:py-32">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
              {h.values.eyebrow}
            </span>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-balance text-chalk">
              {h.values.title}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {h.values.items.map((v, i) => (
              <Reveal key={v.name} delay={(i % 3) * 0.06}>
                <div className="border-t border-line pt-6">
                  <span className="font-mono text-[12px] tabular-nums text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                    {v.name}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-bone/85">{v.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="instrument-grid instrument-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-[1220px] px-5 py-28 sm:px-8 lg:py-36">
          <Reveal className="flex flex-col items-start gap-8">
            <h2 className="max-w-3xl font-display text-[clamp(2.3rem,6vw,4.6rem)] font-semibold leading-[1.0] tracking-[-0.04em] text-balance text-chalk">
              {h.cta.title}
            </h2>
            <p className="max-w-md text-[17px] leading-relaxed text-bone">{h.cta.lead}</p>
            <div className="flex flex-wrap items-center gap-4">
              <PillButton href={`/${lang}/contacto`} variant="primary" arrow>
                {h.cta.button}
              </PillButton>
              <PillButton href={`/${lang}/servicios`} variant="signal">
                {h.pillars.cta}
              </PillButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
