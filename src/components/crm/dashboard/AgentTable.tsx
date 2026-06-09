"use client";

import { motion } from "motion/react";
import type { DashboardMetrics } from "@/lib/crm-metrics";
import { fmtMoney } from "./format";

const TH = "px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em]";
const TD = "px-4 py-3 align-middle text-[13px]";

export function AgentTable({ byAgent }: { byAgent: DashboardMetrics["byAgent"] }) {
  // Más leads primero; los sin actividad quedan al final.
  const rows = [...byAgent].sort((a, b) => b.leads - a.leads || b.value - a.value);

  return (
    <div className="crm-card overflow-hidden p-0">
      <div className="p-5 pb-3">
        <h2 className="font-serif text-[18px] tracking-tight" style={{ color: "var(--crm-ink)" }}>
          Por agente
        </h2>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--crm-ink-mute)" }}>
          Leads asignados y cierres en el periodo
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 pb-6 text-[13px]" style={{ color: "var(--crm-ink-mute)" }}>
          No data in this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr style={{ background: "var(--crm-surface-2)", color: "var(--crm-ink-mute)" }}>
                <th className={TH}>Agente</th>
                <th className={`${TH} text-right`}>Leads</th>
                <th className={`${TH} text-right`}>Ganados</th>
                <th className={`${TH} text-right`}>Conversión</th>
                <th className={`${TH} text-right`}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => (
                <motion.tr
                  key={a.id ?? "unassigned"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="transition-colors hover:bg-[var(--crm-wine-tint)]"
                  style={{ borderTop: "1px solid var(--crm-line)" }}
                >
                  <td className={`${TD} font-medium`} style={{ color: "var(--crm-ink)" }}>
                    {a.name}
                  </td>
                  <td className={`${TD} text-right tabular-nums`} style={{ color: "var(--crm-ink-soft)" }}>
                    {a.leads}
                  </td>
                  <td className={`${TD} text-right tabular-nums`} style={{ color: "var(--crm-ink-soft)" }}>
                    {a.won}
                  </td>
                  <td className={`${TD} text-right tabular-nums`} style={{ color: "var(--crm-ink-soft)" }}>
                    {a.conversionRate === 0 && a.won === 0 ? "–" : `${Math.round(a.conversionRate * 100)}%`}
                  </td>
                  <td
                    className={`${TD} text-right font-medium tabular-nums`}
                    style={{ color: a.value > 0 ? "var(--crm-wine)" : "var(--crm-ink-mute)" }}
                  >
                    {a.value > 0 ? fmtMoney(a.value) : "–"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
