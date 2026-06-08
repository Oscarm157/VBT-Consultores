import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/dictionaries";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const r = getDictionary(lang).resourcesPage;
  return { title: r.eyebrow, description: r.lead };
}

export default async function RecursosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const r = getDictionary(lang).resourcesPage;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-40 pb-28 sm:px-8 sm:pt-48 lg:pb-36">
      <SectionHeading level="h1" eyebrow={r.eyebrow} title={r.title} lead={r.lead} />

      <ul className="mt-16 border-t border-line">
        {r.items.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={i * 0.06}>
              <div className="grid items-center gap-x-8 gap-y-4 border-b border-line py-8 md:grid-cols-[auto_1fr_auto]">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone">
                  {item.type}
                </span>
                <div>
                  <h2 className="font-serif text-[clamp(1.3rem,2.4vw,1.7rem)] font-normal tracking-[-0.01em] text-chalk">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-bone/80">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ash">
                    {r.sampleBadge}
                  </span>
                  <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line px-4 py-2 text-[13px] text-ash">
                    {r.comingSoon}
                  </span>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
