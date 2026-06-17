import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/content/dictionaries";
import { getService, getServices } from "@/content/services-detail";
import { Reveal } from "@/components/site/Reveal";
import { SignalLine } from "@/components/site/SignalLine";
import { ClosingForm } from "@/components/site/ClosingForm";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getServices(lang).map((s) => ({ lang, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const s = getService(lang, slug);
  if (!s) return {};
  return { title: s.name, description: s.summary };
}

export default async function ServicioDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const s = getService(lang, slug);
  if (!s) notFound();
  const d = getDictionary(lang);
  const sp = d.servicesPage;
  const others = getServices(lang).filter((x) => x.slug !== slug);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-5 pt-40 pb-20 sm:px-8 sm:pt-48 lg:pb-28">
          <Reveal>
            <Link
              href={`/${lang}/servicios`}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-chalk"
            >
              &larr; {sp.backToAll}
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-8 max-w-3xl font-serif text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[0.98] tracking-[-0.03em] text-chalk">
              {s.name}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <SignalLine className="mt-8 w-24" />
            <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-bone/90 sm:text-[20px]">
              {s.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Lo que incluye */}
      <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
            {sp.includes}
          </span>
        </Reveal>
        <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-2">
          {s.items.map((it, i) => (
            <Reveal key={it.name} delay={(i % 2) * 0.08}>
              <div className="border-t border-line pt-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] tabular-nums text-bone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] font-normal tracking-[-0.01em] text-chalk">
                    {it.name}
                  </h3>
                </div>
                <p className="mt-4 pl-8 text-[15.5px] leading-relaxed text-bone/85">
                  {it.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Otros servicios */}
      <section className="border-y border-line bg-surface-1/40">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
            {sp.others}
          </span>
          <ul className="mt-8 border-t border-line">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/${lang}/servicios/${o.slug}`}
                  className="group flex items-center justify-between gap-6 border-b border-line py-7 transition-colors hover:bg-chalk/[0.015]"
                >
                  <span className="font-serif text-[clamp(1.4rem,3vw,2.1rem)] font-normal tracking-[-0.02em] text-chalk transition-colors group-hover:text-bone">
                    {o.name}
                  </span>
                  <span
                    aria-hidden
                    className="text-bone transition-transform duration-300 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cierre con form */}
      <ClosingForm
        closing={d.home.closing}
        labels={d.contactPage}
        contact={d.contact}
        form={d.contactPage.form}
        services={d.services.items}
        locale={lang}
      />
    </>
  );
}
