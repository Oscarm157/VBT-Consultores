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
  const b = getDictionary(lang).blogPage;
  return { title: b.eyebrow, description: b.lead };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const b = getDictionary(lang).blogPage;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-40 pb-28 sm:px-8 sm:pt-48 lg:pb-36">
      <SectionHeading level="h1" eyebrow={b.eyebrow} title={b.title} lead={b.lead} />

      <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        {b.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.07} className="bg-ink">
            <article className="flex h-full flex-col gap-5 p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone">
                  {item.category}
                </span>
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ash">
                  {b.sampleBadge}
                </span>
              </div>
              <h2 className="font-serif text-[22px] font-normal leading-snug tracking-[-0.01em] text-chalk">
                {item.title}
              </h2>
              <p className="text-[14.5px] leading-relaxed text-bone/80">{item.excerpt}</p>
              <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
                {b.comingSoon}
              </span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
