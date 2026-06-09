"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";

type Service = {
  slug: string;
  name: string;
  summary: string;
  items: readonly string[];
};

function Panel({
  index,
  service,
  href,
  ctaLabel,
  onActive,
}: {
  index: number;
  service: Service;
  href: string;
  ctaLabel: string;
  onActive: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex min-h-[72vh] flex-col justify-center py-10 lg:min-h-[80vh]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        className="console-panel rounded-2xl border border-line bg-surface-1/60 p-7 sm:p-10"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] tabular-nums text-signal">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="signal-blue-glow h-1.5 w-1.5 rounded-full bg-signal" />
        </div>

        <h3 className="mt-6 font-display text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[1.0] tracking-[-0.03em] text-chalk">
          {service.name}
        </h3>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-bone sm:text-[17px]">
          {service.summary}
        </p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {service.items.map((it, j) => (
            <div key={it} className="flex items-center gap-2.5 bg-surface-1 px-4 py-3">
              <span className="font-mono text-[10px] tabular-nums text-smoke">
                {String(j + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] text-bone">{it}</span>
            </div>
          ))}
        </div>

        <Link
          href={href}
          className="group mt-8 inline-flex items-center gap-2 text-[14px] text-signal transition-colors hover:text-chalk"
        >
          {ctaLabel}
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

export function FrentesInstrument({
  lang,
  services,
  eyebrow,
  title,
  lead,
  cta,
}: {
  lang: string;
  services: readonly Service[];
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
}) {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start start", "end end"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1220px] px-5 pt-24 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
          {eyebrow}
        </span>
        <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-balance text-chalk">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-bone">{lead}</p>
      </div>

      <div ref={railRef} className="mx-auto max-w-[1220px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
          {/* Riel sticky con progreso + frente activo */}
          <div className="hidden lg:block">
            <div className="sticky top-28 flex gap-5 py-10">
              <div className="relative w-px shrink-0 bg-line">
                <motion.div
                  className="absolute left-0 top-0 w-px bg-signal"
                  style={{ height: fill }}
                />
              </div>
              <ul className="flex flex-col gap-7">
                {services.map((s, i) => {
                  const on = active === i;
                  return (
                    <li key={s.slug}>
                      <div
                        className="flex items-baseline gap-3 transition-colors duration-200"
                        data-active={on}
                      >
                        <span
                          className={`font-mono text-[11px] tabular-nums ${on ? "text-signal" : "text-ash"}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-[19px] font-medium tracking-[-0.02em] transition-colors duration-200 ${
                            on ? "text-chalk" : "text-smoke"
                          }`}
                        >
                          {s.name}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Paneles */}
          <div>
            {services.map((s, i) => (
              <Panel
                key={s.slug}
                index={i}
                service={s}
                href={`/${lang}/servicios/${s.slug}`}
                ctaLabel={cta}
                onActive={setActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
