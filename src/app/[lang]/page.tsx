import Link from "next/link";
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
  const d = getDictionary(lang);
  const title =
    lang === "es"
      ? "VBT Consultores · Consultoría fiscal, financiera y empresarial en Tijuana"
      : "VBT Consultores · Tax, financial and business advisory in Tijuana";
  return {
    title: { absolute: title },
    description: d.home.hero.lead,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const h = d.home;

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div
          className="grid-field grid-fade pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-32 pb-20 sm:px-8">
          <div className="frame-lines max-w-4xl px-6 sm:px-10">
            <Reveal>
              <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone">
                <span
                  aria-hidden
                  className="signal-glow inline-block h-1.5 w-1.5 rounded-full bg-cream"
                />
                {h.hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-7 font-serif text-[clamp(2.7rem,8.5vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em] text-chalk">
                {h.hero.title}
                <br />
                <span className="italic text-bone">{h.hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-9 max-w-xl text-[17px] leading-relaxed text-bone/90 sm:text-[19px]">
                {h.hero.lead}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <PillButton href={`/${lang}/contacto`} variant="primary" arrow>
                  {h.hero.ctaPrimary}
                </PillButton>
                <PillButton href={`/${lang}/servicios`} variant="ghost">
                  {h.hero.ctaSecondary}
                </PillButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Diferenciador ===== */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-32">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
              {h.differentiator.eyebrow}
            </span>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4.5vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.02em] text-chalk">
              {h.differentiator.title}
            </h2>
            <SignalLine className="mt-7 w-16" />
          </Reveal>
          <Reveal delay={0.1} className="flex items-end">
            <p className="text-[18px] leading-relaxed text-bone/90 sm:text-[20px]">
              {h.differentiator.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Pilares ===== */}
      <section className="border-t border-line bg-surface-1/40">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow={h.pillars.eyebrow}
            title={h.pillars.title}
            lead={h.pillars.lead}
          />
          <ul className="mt-16 border-t border-line">
            {d.services.items.map((s, i) => (
              <li key={s.slug}>
                <Reveal>
                  <Link
                    href={`/${lang}/servicios/${s.slug}`}
                    className="group grid items-baseline gap-x-8 gap-y-4 border-b border-line py-10 transition-colors hover:bg-chalk/[0.015] md:grid-cols-[auto_1fr_1.1fr_auto] md:py-12"
                  >
                    <span className="font-mono text-[13px] tabular-nums text-bone">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-normal leading-tight tracking-[-0.02em] text-chalk transition-colors group-hover:text-bone">
                      {s.name}
                    </h3>
                    <div>
                      <p className="text-[15px] leading-relaxed text-bone/80">
                        {s.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                        {s.items.map((it) => (
                          <span
                            key={it}
                            className="flex items-center gap-1.5 text-[12.5px] text-smoke"
                          >
                            <span
                              aria-hidden
                              className="h-1 w-1 rounded-full bg-bone/40"
                            />
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="hidden items-center gap-2 self-center text-[14px] text-bone transition-colors group-hover:text-chalk md:flex">
                      {h.pillars.cta}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      >
                        &rarr;
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Para quién ===== */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow={h.audience.eyebrow}
            title={h.audience.title}
            lead={h.audience.lead}
            rule={false}
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {h.audience.items.map((item, i) => (
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

      {/* ===== Valores ===== */}
      <section className="border-t border-line bg-surface-1/40">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
          <SectionHeading eyebrow={h.values.eyebrow} title={h.values.title} />
          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {h.values.items.map((v, i) => (
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

      {/* ===== CTA ===== */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-28 sm:px-8 lg:py-36">
          <Reveal className="flex flex-col items-start gap-8">
            <h2 className="max-w-3xl font-serif text-[clamp(2.3rem,6vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.025em] text-chalk">
              {h.cta.title}
            </h2>
            <p className="max-w-md text-[17px] leading-relaxed text-bone/90">
              {h.cta.lead}
            </p>
            <PillButton href={`/${lang}/contacto`} variant="primary" arrow>
              {h.cta.button}
            </PillButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
