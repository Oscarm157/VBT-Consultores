import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/dictionaries";
import { getServices } from "@/content/services-detail";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PillButton } from "@/components/site/PillButton";

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const sp = d.servicesPage;
  const services = getServices(lang);

  return (
    <>
      <section className="mx-auto max-w-[1280px] px-5 pt-40 pb-8 sm:px-8 sm:pt-48">
        <SectionHeading eyebrow={sp.eyebrow} title={sp.title} lead={sp.lead} />
      </section>

      <section className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <ul className="border-t border-line">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Reveal>
                <Link
                  href={`/${lang}/servicios/${s.slug}`}
                  className="group block border-b border-line py-12 transition-colors hover:bg-chalk/[0.015] lg:py-16"
                >
                  <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[auto_1fr]">
                    <span className="font-mono text-[13px] tabular-nums text-bone">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.2fr]">
                      <div>
                        <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] font-normal leading-[1.04] tracking-[-0.02em] text-chalk transition-colors group-hover:text-bone">
                          {s.name}
                        </h2>
                        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-bone/85">
                          {s.intro}
                        </p>
                        <span className="mt-7 inline-flex items-center gap-2 text-[14px] text-bone transition-colors group-hover:text-chalk">
                          {d.home.pillars.cta}
                          <span
                            aria-hidden
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          >
                            &rarr;
                          </span>
                        </span>
                      </div>
                      <ul className="grid gap-x-8 gap-y-4 self-start sm:grid-cols-2">
                        {s.items.map((it, j) => (
                          <li key={it.name} className="border-t border-line pt-4">
                            <span className="font-mono text-[11px] tabular-nums text-smoke">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <span className="mt-1.5 block text-[14.5px] leading-snug text-bone">
                              {it.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-5 py-28 sm:px-8 lg:py-36">
        <Reveal className="flex flex-col items-start gap-7">
          <h2 className="max-w-2xl font-serif text-[clamp(2rem,5vw,3.6rem)] font-normal leading-[1.04] tracking-[-0.02em] text-chalk">
            {d.home.cta.title}
          </h2>
          <p className="max-w-md text-[17px] leading-relaxed text-bone/90">
            {sp.ctaLead}
          </p>
          <PillButton href={`/${lang}/contacto`} variant="primary" arrow>
            {sp.cta}
          </PillButton>
        </Reveal>
      </section>
    </>
  );
}
