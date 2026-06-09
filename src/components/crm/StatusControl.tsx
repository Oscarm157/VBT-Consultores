"use client";

import { useOptimistic, useTransition } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import type { LeadStatus } from "@/lib/schema";
import { updateLeadStatus } from "@/app/admin/actions";
import { STATUS_META, STATUS_ORDER } from "./status";

export function StatusControl({
  leadId,
  status,
  editable = true,
  onDark = false,
}: {
  leadId: string;
  status: LeadStatus;
  editable?: boolean;
  onDark?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(status);
  const meta = STATUS_META[optimistic] ?? STATUS_META.new;
  const wrap = onDark
    ? "border-transparent bg-white text-[var(--crm-ink)] shadow-[0_1px_2px_rgba(20,18,14,0.12)]"
    : meta.badge;

  if (!editable) {
    return (
      <span
        className={`inline-flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium sm:w-[170px] ${wrap}`}
      >
        <span className={`size-1.5 shrink-0 rounded-full ${meta.dot}`} />
        {meta.label}
      </span>
    );
  }

  return (
    <label
      className={`relative inline-flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors sm:w-[170px] ${wrap}`}
    >
      {pending ? (
        <Loader2 className={`size-3.5 shrink-0 animate-spin ${meta.dot.replace("bg-", "text-")}`} strokeWidth={2} />
      ) : (
        <span className={`size-1.5 shrink-0 rounded-full ${meta.dot}`} />
      )}
      <select
        value={optimistic}
        onChange={(e) => {
          const next = e.target.value as LeadStatus;
          startTransition(() => {
            setOptimistic(next);
            updateLeadStatus(leadId, next);
          });
        }}
        className="w-full cursor-pointer appearance-none bg-transparent pr-5 outline-none"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s} className="bg-[var(--crm-surface)] text-[var(--crm-ink)]">
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 size-3.5 opacity-60"
        strokeWidth={2}
      />
    </label>
  );
}
