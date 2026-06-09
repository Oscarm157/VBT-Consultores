"use client";

import { motion, useReducedMotion } from "motion/react";
import type { DashboardMetrics } from "@/lib/crm-metrics";
import { STATUS_LABELS } from "@/lib/crm-status";
import { fmtMoney } from "./format";

const EMPTY = { count: 0, value: 0 } as const;

// Etapas abiertas del embudo en orden. won/lost se muestran aparte (resultados).
const STAGE_ORDER = ["new", "contacted", "following_up", "proposal"] as const;

export function Funnel({ funnel }: { funnel: DashboardMetrics["funnel"] }) {
  const reduce = useReducedMotion();
  const map = new Map(funnel.map((f) => [f.status, f]));

  const stages = STAGE_ORDER.map((s) => map.get(s)).filter(Boolean) as DashboardMetrics["funnel"];
  const won = map.get("won") ?? { status: "won" as const, ...EMPTY };
  const lost = map.get("lost") ?? { status: "lost" as const, ...EMPTY };

  const maxCount = Math.max(1, ...stages.map((s) => s.count), won.count, lost.count);
  const totalIn = stages.reduce((a, s) => a + s.count, 0) + won.count + lost.count;

  return (
    <div className="crm-card p-5">
      <Header />

      {totalIn === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-4 space-y-2.5">
          {stages.map((s, i) => (
            <Bar
              key={s.status}
              label={STATUS_LABELS[s.status]}
              count={s.count}
              value={s.value}
              width={(s.count / maxCount) * 100}
              delay={i * 0.06}
              reduce={!!reduce}
              tone="open"
            />
          ))}

          <div className="my-1 h-px" style={{ background: "var(--crm-line)" }} />

          <Bar
            label={STATUS_LABELS.won}
            count={won.count}
            value={won.value}
            width={(won.count / maxCount) * 100}
            delay={STAGE_ORDER.length * 0.06}
            reduce={!!reduce}
            tone="won"
          />
          <Bar
            label={STATUS_LABELS.lost}
            count={lost.count}
            value={lost.value}
            width={(lost.count / maxCount) * 100}
            delay={(STAGE_ORDER.length + 1) * 0.06}
            reduce={!!reduce}
            tone="lost"
          />
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div>
      <h2 className="font-serif text-[18px] tracking-tight" style={{ color: "var(--crm-ink)" }}>
        Embudo por etapa
      </h2>
      <p className="mt-0.5 text-[12px]" style={{ color: "var(--crm-ink-mute)" }}>
        Leads creados en el periodo, por su etapa actual
      </p>
    </div>
  );
}

function Bar({
  label,
  count,
  value,
  width,
  delay,
  reduce,
  tone,
}: {
  label: string;
  count: number;
  value: number;
  width: number;
  delay: number;
  reduce: boolean;
  tone: "open" | "won" | "lost";
}) {
  const fill =
    tone === "won"
      ? "var(--crm-wine)"
      : tone === "lost"
      ? "var(--crm-line-strong)"
      : "var(--crm-wine-soft)";
  const labelColor = tone === "lost" ? "var(--crm-ink-mute)" : "var(--crm-ink)";

  return (
    <div className="group" title={`${label}: ${count}${value > 0 ? ` · ${fmtMoney(value)}` : ""}`}>
      <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
        <span className="font-medium" style={{ color: labelColor }}>
          {label}
        </span>
        <span className="flex items-baseline gap-2 tabular-nums">
          <span className="font-medium" style={{ color: "var(--crm-ink)" }}>
            {count}
          </span>
          {value > 0 && (
            <span style={{ color: "var(--crm-ink-mute)" }}>{fmtMoney(value)}</span>
          )}
        </span>
      </div>
      <div
        className="mt-1 h-2 overflow-hidden rounded-full"
        style={{ background: "var(--crm-surface-2)", border: "1px solid var(--crm-line)" }}
      >
        <motion.div
          className="h-full rounded-full transition-[filter] group-hover:brightness-110"
          style={{ background: fill, width: `${count === 0 ? 0 : Math.max(4, width)}%` }}
          initial={{ scaleX: reduce ? 1 : 0, transformOrigin: "left center" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <p className="mt-6 text-[13px]" style={{ color: "var(--crm-ink-mute)" }}>
      No data in this period.
    </p>
  );
}
