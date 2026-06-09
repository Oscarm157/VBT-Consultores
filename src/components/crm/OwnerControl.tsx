"use client";

import { useOptimistic, useTransition } from "react";
import { ChevronDown, UserCircle2, Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/schema";
import { canEditAnyLead } from "@/lib/crm-permissions";
import { assignLead } from "@/app/admin/actions";

type U = { id: string; name: string };

export function OwnerControl({
  leadId,
  assignedTo,
  users,
  viewerRole,
  ownerName,
}: {
  leadId: string;
  assignedTo: string | null;
  users: U[];
  viewerRole: UserRole;
  ownerName: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(assignedTo ?? "");

  // Only admins can reassign. Everyone else sees the owner as plain text.
  if (!canEditAnyLead(viewerRole)) {
    return (
      <span className="inline-flex w-full items-center gap-2 rounded-lg border border-[var(--crm-line)] bg-[var(--crm-surface-2)] px-3 py-2 text-[13px] text-[var(--crm-ink)] sm:w-[170px]">
        <UserCircle2 className="size-3.5 shrink-0 text-[var(--crm-ink-mute)]" strokeWidth={1.75} />
        <span className="truncate">{ownerName ?? "Sin asignar"}</span>
      </span>
    );
  }

  return (
    <label className="relative inline-flex w-full items-center gap-2 rounded-lg border border-[var(--crm-line-strong)] bg-[var(--crm-surface)] px-3 py-2 text-[13px] text-[var(--crm-ink)] transition-colors focus-within:border-[var(--crm-wine-soft)] hover:border-[var(--crm-ink-mute)] sm:w-[170px]">
      {pending ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin text-[var(--crm-ink-mute)]" strokeWidth={2} />
      ) : (
        <UserCircle2 className="size-3.5 shrink-0 text-[var(--crm-ink-mute)]" strokeWidth={1.75} />
      )}
      <select
        value={optimistic}
        onChange={(e) => {
          const v = e.target.value;
          startTransition(() => {
            setOptimistic(v);
            assignLead(leadId, v || null);
          });
        }}
        className="w-full cursor-pointer appearance-none bg-transparent pr-5 outline-none"
      >
        <option value="">Sin asignar</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 opacity-60" strokeWidth={2} />
    </label>
  );
}
