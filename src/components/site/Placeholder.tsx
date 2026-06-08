import { SectionHeading } from "./SectionHeading";

/** Stub temporal de página: se reemplaza en su milestone. */
export function Placeholder({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-32 pt-40 sm:px-8 sm:pt-48">
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
        En construcción
      </p>
    </section>
  );
}
