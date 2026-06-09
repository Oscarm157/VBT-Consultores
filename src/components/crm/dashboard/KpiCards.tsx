"use client";

import { motion } from "motion/react";
import { Users, TrendingUp, Wallet, Trophy, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/crm/dashboard/CountUp";
import type { DashboardMetrics } from "@/lib/crm-metrics";
import { MoneyCount } from "./MoneyCount";

const numCls = "font-serif text-[34px] leading-none tracking-tight tabular-nums";
const emptyCls = "font-serif text-[34px] leading-none tracking-tight";

type Kpi = {
  key: string;
  label: string;
  icon: LucideIcon;
  value: number;
  display: "int" | "money" | "pct";
  empty: boolean;
  context: string;
};

export function KpiCards({ totals }: { totals: DashboardMetrics["totals"] }) {
  const closed = totals.won + totals.lost;

  const cards: Kpi[] = [
    {
      key: "leads",
      label: "Leads del periodo",
      icon: Users,
      value: totals.leads,
      display: "int",
      empty: totals.leads === 0,
      context: totals.leads === 0 ? "Sin datos en el periodo" : "Creados en el rango",
    },
    {
      key: "conversion",
      label: "Conversión",
      icon: TrendingUp,
      value: Math.round(totals.conversionRate * 100),
      display: "pct",
      empty: closed === 0,
      context: closed === 0 ? "Sin cierres aún" : `${totals.won} ganados de ${closed} cerrados`,
    },
    {
      key: "pipeline",
      label: "Valor en pipeline",
      icon: Wallet,
      value: totals.pipelineValue,
      display: "money",
      empty: totals.pipelineValue === 0,
      context: totals.pipelineValue === 0 ? "Sin oportunidades abiertas" : "Etapas abiertas, snapshot actual",
    },
    {
      key: "won",
      label: "Valor ganado",
      icon: Trophy,
      value: totals.wonValue,
      display: "money",
      empty: totals.wonValue === 0,
      context: totals.wonValue === 0 ? "Sin cierres ganados" : `${totals.won} ${totals.won === 1 ? "trato ganado" : "tratos ganados"}`,
    },
    {
      key: "days",
      label: "Días promedio al cierre",
      icon: Clock,
      value: totals.avgDaysToClose === null ? 0 : Math.round(totals.avgDaysToClose),
      display: "int",
      empty: totals.avgDaysToClose === null,
      context: totals.avgDaysToClose === null ? "Sin cierres en el periodo" : "De creación a cierre",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="crm-card flex flex-col gap-3 p-4"
        >
          <span
            className="flex size-7 items-center justify-center rounded-lg"
            style={{ background: "var(--crm-wine-tint)" }}
          >
            <c.icon className="size-3.5" style={{ color: "var(--crm-wine)" }} strokeWidth={1.8} />
          </span>

          <div style={{ color: "var(--crm-wine)" }}>
            {c.empty ? (
              <span className={emptyCls} style={{ color: "var(--crm-ink-mute)" }}>
                –
              </span>
            ) : c.display === "money" ? (
              <MoneyCount value={c.value} className={numCls} />
            ) : (
              <CountUp
                value={c.value}
                suffix={c.display === "pct" ? "%" : ""}
                duration={1}
                delay={0.1}
                className={numCls}
              />
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-[12.5px] font-medium" style={{ color: "var(--crm-ink)" }}>
              {c.label}
            </p>
            <p className="text-[11px] leading-snug" style={{ color: "var(--crm-ink-mute)" }}>
              {c.context}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
