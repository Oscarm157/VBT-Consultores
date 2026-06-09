"use client";

import { motion, useReducedMotion } from "motion/react";

export type BreakdownRow = { label: string; count: number };

// Barras horizontales reutilizables para fuente y servicio.
export function Breakdown({
  title,
  subtitle,
  rows,
  emptyCopy,
}: {
  title: string;
  subtitle: string;
  rows: BreakdownRow[];
  emptyCopy: string;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(1, ...rows.map((r) => r.count));
  const total = rows.reduce((a, r) => a + r.count, 0);

  return (
    <div className="crm-card p-5">
      <h2 className="font-serif text-[18px] tracking-tight" style={{ color: "var(--crm-ink)" }}>
        {title}
      </h2>
      <p className="mt-0.5 text-[12px]" style={{ color: "var(--crm-ink-mute)" }}>
        {subtitle}
      </p>

      {total === 0 ? (
        <p className="mt-6 text-[13px]" style={{ color: "var(--crm-ink-mute)" }}>
          {emptyCopy}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r, i) => (
            <li key={r.label} className="group" title={`${r.label}: ${r.count} (${Math.round((r.count / total) * 100)}%)`}>
              <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
                <span className="truncate font-medium transition-colors group-hover:text-[var(--crm-wine)]" style={{ color: "var(--crm-ink)" }}>
                  {r.label}
                </span>
                <span className="tabular-nums" style={{ color: "var(--crm-ink-soft)" }}>
                  {r.count}
                  <span className="ml-1.5" style={{ color: "var(--crm-ink-mute)" }}>
                    {Math.round((r.count / total) * 100)}%
                  </span>
                </span>
              </div>
              <div
                className="mt-1 h-2 overflow-hidden rounded-full"
                style={{ background: "var(--crm-surface-2)", border: "1px solid var(--crm-line)" }}
              >
                <motion.div
                  className="h-full rounded-full transition-[filter] group-hover:brightness-110"
                  style={{ background: "var(--crm-wine-soft)", width: `${Math.max(4, (r.count / max) * 100)}%` }}
                  initial={{ scaleX: reduce ? 1 : 0, transformOrigin: "left center" }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
