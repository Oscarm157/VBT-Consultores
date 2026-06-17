import { Reveal } from "./Reveal";
import { SignalLine } from "./SignalLine";

type Step = { n: string; name: string; note: string };

/** Sección "Cómo trabajamos": pasos del encargo, derivados de los servicios reales. */
export function Proceso({
  dict,
}: {
  dict: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: readonly Step[];
  };
}) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1220px] px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
            {dict.eyebrow}
          </span>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-balance text-chalk">
            {dict.title}
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-bone">{dict.lead}</p>
        </Reveal>

        <div className="mt-14">
          <SignalLine className="mb-10" />
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {dict.steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <span className="font-mono text-[12px] tabular-nums text-signal">{s.n}</span>
                <h3 className="mt-3 font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                  {s.name}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-bone/85">{s.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
