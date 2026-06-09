import Link from "next/link";
import { Inbox } from "lucide-react";
import { getLeads, getUsersBasic, getActiveUsers } from "@/lib/crm-data";
import { getCurrentUser } from "@/lib/crm-session";
import { canViewAllLeads, isReadOnly } from "@/lib/crm-permissions";
import type { LeadStatus } from "@/lib/schema";
import { fmtDate } from "@/lib/crm-format";
import { StatusBadge, SourceBadge, OwnerChip, STATUS_META, STATUS_ORDER } from "@/components/crm/status";
import { NewLeadModal } from "@/components/crm/NewLeadModal";
import { LeadFilters } from "@/components/crm/LeadFilters";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads", robots: { index: false } };

const PAGE_SIZE = 25;

type SortKey = "recent" | "name" | "status";

export default async function LeadsList({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    owner?: string;
    source?: string;
    sort?: string;
    unassigned?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const me = await getCurrentUser();
  if (!me) return null;

  const canSeeAll = canViewAllLeads(me.role);
  const readOnly = isReadOnly(me.role);
  const canCreate = !readOnly;

  const status = STATUS_ORDER.includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : undefined;
  const sort = (["recent", "name", "status"].includes(sp.sort ?? "") ? sp.sort : "recent") as SortKey;
  const unassigned = canSeeAll && sp.unassigned === "1";
  const page = Math.max(1, Number(sp.page) || 1);

  const opts = {
    search: sp.search?.trim() || undefined,
    status,
    owner: sp.owner || undefined,
    source: sp.source || undefined,
    sort,
    unassigned,
    page,
    pageSize: PAGE_SIZE,
  };

  const [{ rows: leads, total }, usersList, activeUsers] = await Promise.all([
    getLeads({ id: me.id, role: me.role }, opts),
    getUsersBasic(),
    getActiveUsers(),
  ]);
  const userMap = new Map(usersList.map((u) => [u.id, u]));

  // Status tab counts come from a separate scoped query per tab so the numbers
  // stay correct under the active search/owner/source filters.
  const countOpts = { ...opts, status: undefined, page: 1, pageSize: 1 };
  const [allCount, ...statusCounts] = await Promise.all([
    getLeads({ id: me.id, role: me.role }, countOpts).then((r) => r.total),
    ...STATUS_ORDER.map((s) =>
      getLeads({ id: me.id, role: me.role }, { ...countOpts, status: s }).then((r) => r.total)
    ),
  ]);
  const counts: Record<string, number> = { all: allCount };
  STATUS_ORDER.forEach((s, i) => (counts[s] = statusCounts[i]));

  const active = (status ?? "all") as "all" | LeadStatus;
  const tabs: { key: "all" | LeadStatus; label: string }[] = [
    { key: "all", label: "Todas" },
    ...STATUS_ORDER.map((s) => ({ key: s, label: STATUS_META[s].label })),
  ];

  // Build a status-tab href that preserves every other active param.
  const tabHref = (key: "all" | LeadStatus) => {
    const p = new URLSearchParams();
    if (opts.search) p.set("search", opts.search);
    if (opts.owner) p.set("owner", opts.owner);
    if (opts.source) p.set("source", opts.source);
    if (sort !== "recent") p.set("sort", sort);
    if (unassigned) p.set("unassigned", "1");
    if (key !== "all") p.set("status", key);
    const s = p.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    if (opts.search) p.set("search", opts.search);
    if (status) p.set("status", status);
    if (opts.owner) p.set("owner", opts.owner);
    if (opts.source) p.set("source", opts.source);
    if (sort !== "recent") p.set("sort", sort);
    if (unassigned) p.set("unassigned", "1");
    if (n > 1) p.set("page", String(n));
    const s = p.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-[30px] tracking-tight text-[var(--crm-ink)]">Leads</h1>
          <span className="text-[13px] text-[var(--crm-ink-soft)]">
            {total} {total === 1 ? "lead" : "leads"}
            {readOnly && <span className="ml-2 text-[var(--crm-ink-mute)]">solo lectura</span>}
          </span>
        </div>
        {canCreate && <NewLeadModal />}
      </div>

      <LeadFilters owners={activeUsers} showOwner={canSeeAll} showUnassigned={canSeeAll} />

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <Link
              key={t.key}
              href={tabHref(t.key)}
              scroll={false}
              data-active={on}
              className="crm-tab"
            >
              {t.label}
              <span className={`tabular-nums ${on ? "text-white/75" : "text-[var(--crm-ink-mute)]"}`}>{counts[t.key]}</span>
            </Link>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <div className="crm-empty mt-12 py-20">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--crm-wine-tint)]">
            <Inbox className="size-6 text-[var(--crm-wine)]" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[15px] font-medium text-[var(--crm-ink)]">
            {opts.search || opts.owner || opts.source || status || unassigned ? "Sin coincidencias" : "Aún no hay leads"}
          </p>
          <p className="mt-1 max-w-xs text-[13px] text-[var(--crm-ink-soft)]">
            {opts.search || opts.owner || opts.source || status || unassigned
              ? "Quita la búsqueda o los filtros para ampliar los resultados."
              : "Aquí aparecen los leads del chat y los formularios del sitio, además de los que agregues."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <ul className="mt-4 space-y-2.5 sm:hidden">
            {leads.map((lead) => {
              const ql = lead.qualification ?? {};
              const owner = lead.assignedTo ? userMap.get(lead.assignedTo) : null;
              const chips = [ql.service ?? ql.industry, ql.budget].filter(Boolean) as string[];
              return (
                <li key={lead.id}>
                  <Link
                    href={`/admin/${lead.id}`}
                    className="crm-card block p-4 transition-colors active:bg-[var(--crm-surface-2)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[15px] font-semibold text-[var(--crm-ink)]">{lead.name ?? "No name"}</span>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="mt-1 flex flex-col gap-0.5 text-[12.5px] text-[var(--crm-ink-soft)]">
                      {lead.email && <span className="break-all">{lead.email}</span>}
                      {lead.phone && <span>{lead.phone}</span>}
                    </div>
                    {chips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chips.map((c, j) => (
                          <span key={j} className="rounded-md bg-[var(--crm-surface-2)] px-2 py-0.5 text-[11.5px] text-[var(--crm-ink-soft)]">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <SourceBadge source={lead.source} />
                      {owner ? (
                        <OwnerChip name={owner.name} id={owner.id} />
                      ) : (
                        <span className="text-[12px] text-[var(--crm-ink-mute)]">Sin asignar</span>
                      )}
                      <span className="ml-auto text-[12px] text-[var(--crm-ink-mute)]">{fmtDate(lead.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop: table */}
          <div className="crm-card mt-4 hidden overflow-x-auto sm:block">
            <table className="crm-table min-w-[860px]">
              <thead className="crm-thead">
                <tr className="border-b border-[var(--crm-line)]">
                  <th className="crm-th">Nombre</th>
                  <th className="crm-th">Contacto</th>
                  <th className="crm-th">Fuente</th>
                  <th className="crm-th">Responsable</th>
                  <th className="crm-th">Interés</th>
                  <th className="crm-th">Presupuesto</th>
                  <th className="crm-th">Estado</th>
                  <th className="crm-th">Recibido</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const ql = lead.qualification ?? {};
                  const owner = lead.assignedTo ? userMap.get(lead.assignedTo) : null;
                  return (
                    <tr
                      key={lead.id}
                      className="crm-row relative cursor-pointer border-t border-[var(--crm-line)]"
                    >
                      <td className="crm-td">
                        <Link
                          href={`/admin/${lead.id}`}
                          className="group inline-flex items-center gap-1.5 before:absolute before:inset-0 before:content-['']"
                        >
                          <span className="text-[14px] font-semibold text-[var(--crm-ink)] group-hover:text-[var(--crm-wine)]">
                            {lead.name ?? "No name"}
                          </span>
                          <span className="rounded border border-[var(--crm-line-strong)] px-1 py-0.5 text-[9px] font-medium uppercase text-[var(--crm-ink-mute)]">
                            {lead.locale === "es" ? "ES" : "EN"}
                          </span>
                        </Link>
                      </td>
                      <td className="crm-td text-[12.5px] text-[var(--crm-ink-soft)]">
                        <div className="flex flex-col leading-tight">
                          {lead.email && <span className="truncate">{lead.email}</span>}
                          {lead.phone && <span>{lead.phone}</span>}
                        </div>
                      </td>
                      <td className="crm-td">
                        <SourceBadge source={lead.source} />
                      </td>
                      <td className="crm-td whitespace-nowrap">
                        {owner ? (
                          <OwnerChip name={owner.name} id={owner.id} />
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--crm-ink-mute)]">
                            <span className="size-1.5 rounded-full bg-[var(--crm-line-strong)]" />
                            Sin asignar
                          </span>
                        )}
                      </td>
                      <td className="crm-td text-[12.5px] text-[var(--crm-ink-soft)]">{ql.service ?? ql.industry ?? "–"}</td>
                      <td className="crm-td text-[12.5px] text-[var(--crm-ink-soft)]">{ql.budget ?? "–"}</td>
                      <td className="crm-td">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="crm-td whitespace-nowrap text-[12px] text-[var(--crm-ink-mute)]">{fmtDate(lead.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[12.5px] tabular-nums text-[var(--crm-ink-soft)]">
              {firstShown}–{lastShown} de {total}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {page > 1 ? (
                  <Link href={pageHref(page - 1)} scroll={false} className="crm-btn crm-btn-secondary crm-btn-sm">
                    Prev
                  </Link>
                ) : (
                  <span className="crm-btn crm-btn-secondary crm-btn-sm opacity-45">Prev</span>
                )}
                <span className="px-1.5 text-[12.5px] tabular-nums text-[var(--crm-ink-soft)]">
                  {page} / {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={pageHref(page + 1)} scroll={false} className="crm-btn crm-btn-secondary crm-btn-sm">
                    Next
                  </Link>
                ) : (
                  <span className="crm-btn crm-btn-secondary crm-btn-sm opacity-45">Next</span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
