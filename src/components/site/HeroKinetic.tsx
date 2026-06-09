"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PillButton } from "./PillButton";

type Channel = { label: string; state: string; tone: string };

const BEAMS = [13, 27, 39, 52, 64, 77, 88];

/** Canal de datos: una línea fina con un segmento de señal que la recorre. */
function DataBeam({ top, i, reduce }: { top: number; i: number; reduce: boolean }) {
  return (
    <div className="absolute inset-x-0" style={{ top: `${top}%` }}>
      <div className="h-px w-full bg-white/[0.05]" />
      {!reduce && (
        <motion.div
          className="absolute top-0 h-px w-[22%]"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--color-signal), transparent)",
            opacity: 0.55,
          }}
          initial={{ x: "-25%" }}
          animate={{ x: "125%" }}
          transition={{
            duration: 5.5 + (i % 4),
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.7,
          }}
        />
      )}
    </div>
  );
}

export function HeroKinetic({
  eyebrow,
  title,
  lead,
  ctaPrimary,
  ctaSecondary,
  primaryHref,
  secondaryHref,
  channels,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  primaryHref: string;
  secondaryHref: string;
  channels: readonly Channel[];
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const beamsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-line"
    >
      {/* Capa de instrumento: grid + canales de datos */}
      <motion.div style={{ y: beamsY }} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="instrument-grid instrument-fade absolute inset-0" />
        <div className="absolute inset-0">
          {BEAMS.map((top, i) => (
            <DataBeam key={top} top={top} i={i} reduce={reduce} />
          ))}
        </div>
        {/* Halo atmosférico neutro detrás del titular */}
        <div
          className="absolute left-1/2 top-[38%] h-[44vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[90px]"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-[1220px] px-5 pt-28 pb-16 sm:px-8"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-smoke"
        >
          <span className="signal-blue-glow inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1], delay: 0.08 }}
          className="mt-7 max-w-[16ch] font-display text-[clamp(2.8rem,8.5vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-balance text-chalk"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.16 }}
          className="mt-8 max-w-xl text-[17px] leading-relaxed text-bone sm:text-[19px]"
        >
          {lead}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.24 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <PillButton href={primaryHref} variant="primary" arrow>
            {ctaPrimary}
          </PillButton>
          <PillButton href={secondaryHref} variant="signal">
            {ctaSecondary}
          </PillButton>
        </motion.div>

        {/* Readout de instrumento: los 3 frentes como canales en vivo */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.34 }}
          className="mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3"
        >
          {channels.map((c) => (
            <div key={c.label} className="bg-surface-1/70 px-4 py-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">
                  {c.label}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    c.tone === "signal"
                      ? "bg-signal signal-blue-glow"
                      : c.tone === "up"
                        ? "bg-up"
                        : "bg-bone/40"
                  }`}
                />
              </div>
              <p className="mt-1.5 text-[13.5px] text-bone">{c.state}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
