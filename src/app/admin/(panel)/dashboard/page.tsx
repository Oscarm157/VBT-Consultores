import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/crm-session";
import { canViewDashboard, isReadOnly } from "@/lib/crm-permissions";
import { getDashboardMetrics } from "@/lib/crm-metrics";
import { getActiveUsers } from "@/lib/crm-data";
import { DashboardFilters } from "@/components/crm/dashboard/DashboardFilters";
import { KpiCards } from "@/components/crm/dashboard/KpiCards";
import { Funnel } from "@/components/crm/dashboard/Funnel";
import { TrendChart } from "@/components/crm/dashboard/TrendChart";
import { SourceBreakdown } from "@/components/crm/dashboard/SourceBreakdown";
import { ServiceBreakdown } from "@/components/crm/dashboard/ServiceBreakdown";
import { AgentTable } from "@/components/crm/dashboard/AgentTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard", robots: { index: false } };

type Range = "month" | "30d" | "90d" | "year" | "all";
const RANGES: Range[] = ["month", "30d", "90d", "year", "all"];

const RANGE_COPY: Record<Range, string> = {
  month: "este mes",
  "30d": "the last 30 días",
  "90d": "the last 90 días",
  year: "lo que va del año",
  all: "todo el periodo",
};

// Calcula la ventana [from, to] a partir del rango seleccionado.
function rangeWindow(range: Range): { from?: Date; to?: Date } {
  const now = new Date();
  if (range === "all") return {};
  if (range === "month") {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  }
  if (range === "year") {
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }
  const days = range === "90d" ? 90 : 30;
  const from = new Date(now);
  from.setDate(from.getDate() - days);
  return { from, to: now };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; owner?: string; source?: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  if (!canViewDashboard(me.role)) redirect("/admin");

  const sp = await searchParams;
  const range: Range = RANGES.includes(sp.range as Range) ? (sp.range as Range) : "30d";
  const { from, to } = rangeWindow(range);

  const [metrics, agents] = await Promise.all([
    getDashboardMetrics(
      { id: me.id, role: me.role },
      { from, to, owner: sp.owner, source: sp.source }
    ),
    getActiveUsers(),
  ]);

  const readOnly = isReadOnly(me.role);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-[30px] tracking-tight" style={{ color: "var(--crm-ink)" }}>
              Dashboard
            </h1>
            {readOnly && <span className="crm-badge">Solo lectura</span>}
          </div>
          <p className="mt-1 text-[13px]" style={{ color: "var(--crm-ink-mute)" }}>
            Actividad de leads · {RANGE_COPY[range]}.
          </p>
        </div>

        <DashboardFilters agents={agents} showAgent />
      </header>

      <KpiCards totals={metrics.totals} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Funnel funnel={metrics.funnel} />
        <TrendChart trend={metrics.trend} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SourceBreakdown bySource={metrics.bySource} />
        <ServiceBreakdown byService={metrics.byService} />
      </div>

      <AgentTable byAgent={metrics.byAgent} />
    </div>
  );
}
