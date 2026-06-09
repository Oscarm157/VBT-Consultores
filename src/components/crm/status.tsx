import type { LeadStatus, LeadSource } from "@/lib/schema";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/crm-status";

export { STATUS_ORDER };

const STATUS_STYLE: Record<LeadStatus, { badge: string; dot: string }> = {
  new: { badge: "bg-[var(--crm-wine-tint)] text-[var(--crm-wine)] border-[var(--crm-wine-ring)]", dot: "bg-[var(--crm-wine)]" },
  contacted: { badge: "bg-blue-500/10 text-blue-700 border-blue-600/20", dot: "bg-blue-500" },
  following_up: { badge: "bg-amber-500/12 text-amber-700 border-amber-600/25", dot: "bg-amber-500" },
  proposal: { badge: "bg-indigo-500/10 text-indigo-700 border-indigo-600/20", dot: "bg-indigo-500" },
  won: { badge: "bg-emerald-600/10 text-emerald-700 border-emerald-700/20", dot: "bg-emerald-600" },
  lost: { badge: "bg-[var(--crm-surface-2)] text-[var(--crm-ink-mute)] border-[var(--crm-line-strong)]", dot: "bg-[var(--crm-ink-mute)]" },
};

export const STATUS_META: Record<LeadStatus, { label: string; badge: string; dot: string }> =
  Object.fromEntries(
    STATUS_ORDER.map((s) => [s, { label: STATUS_LABELS[s], ...STATUS_STYLE[s] }])
  ) as Record<LeadStatus, { label: string; badge: string; dot: string }>;

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium shadow-[0_1px_2px_rgba(20,18,14,0.04)] ${meta.badge}`}
    >
      <span className={`size-1.5 rounded-full shadow-[0_0_0_2px_var(--crm-surface)] ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

const SOURCE_META: Record<LeadSource, { label: string; cls: string; dot: string }> = {
  bot: { label: "Chatbot", cls: "bg-violet-500/8 text-violet-700 border-violet-600/18", dot: "bg-violet-500" },
  form: { label: "Formulario", cls: "bg-teal-500/8 text-teal-700 border-teal-600/18", dot: "bg-teal-500" },
  manual: { label: "Manual", cls: "bg-[var(--crm-surface-2)] text-[var(--crm-ink-mute)] border-[var(--crm-line-strong)]", dot: "bg-[var(--crm-ink-mute)]" },
};

export function SourceBadge({ source, onDark = false }: { source: LeadSource; onDark?: boolean }) {
  const m = SOURCE_META[source] ?? SOURCE_META.manual;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        onDark ? "border-white/30 bg-white/15 text-white" : m.cls
      }`}
    >
      <span className={`size-1 rounded-full ${onDark ? "bg-white" : m.dot}`} />
      {m.label}
    </span>
  );
}

const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-indigo-500",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function OwnerChip({ name, id }: { name: string; id: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex size-5 items-center justify-center rounded-full text-[9px] font-semibold text-white shadow-[0_0_0_1.5px_var(--crm-surface),0_1px_2px_rgba(20,18,14,0.12)] ${colorFor(id)}`}
      >
        {initials(name)}
      </span>
      <span className="text-[12.5px] text-[var(--crm-ink-soft)]">{name}</span>
    </span>
  );
}
