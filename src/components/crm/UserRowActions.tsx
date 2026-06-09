"use client";

import { useState, useTransition } from "react";
import { KeyRound, UserX, UserCheck, Copy, Check, ChevronDown, Loader2 } from "lucide-react";
import { resetUserPassword, setUserActive, updateUserRole } from "@/app/admin/users-actions";
import type { UserRole } from "@/lib/schema";
import { EditUserModal } from "@/components/crm/EditUserModal";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  agent: "Agent",
  viewer: "Viewer",
};

const ROLE_CHIP: Record<UserRole, string> = {
  admin: "border-transparent bg-[var(--crm-wine-tint)] text-[var(--crm-wine)]",
  agent: "border-[var(--crm-line-strong)] bg-[var(--crm-surface-2)] text-[var(--crm-ink-soft)]",
  viewer: "border-amber-300/70 bg-amber-50 text-amber-700",
};

/** Role chip + inline selector. Locked for the acting admin on their own row. */
export function UserRoleSelect({
  userId,
  role,
  locked,
}: {
  userId: string;
  role: UserRole;
  locked?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<UserRole>(role);

  if (locked) {
    return (
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${ROLE_CHIP[value]}`}>
        {ROLE_LABELS[value]}
      </span>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as UserRole;
          setValue(next);
          startTransition(() => updateUserRole(userId, next));
        }}
        className={`cursor-pointer appearance-none rounded-full border py-0.5 pl-2.5 pr-6 text-[11px] font-medium outline-none transition-[box-shadow,border-color] focus:shadow-[0_0_0_3px_var(--crm-wine-ring)] disabled:opacity-60 ${ROLE_CHIP[value]}`}
      >
        {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1.5">
        {pending ? <Loader2 className="size-3 animate-spin text-[var(--crm-ink-mute)]" /> : <ChevronDown className="size-3 text-[var(--crm-ink-mute)]" />}
      </span>
    </div>
  );
}

export function UserRowActions({
  user,
  active,
  isSelf,
}: {
  user: { id: string; name: string; email: string; role: UserRole };
  active: boolean;
  isSelf: boolean;
}) {
  const userId = user.id;
  const [pending, startTransition] = useTransition();
  const [temp, setTemp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1.5">
      <EditUserModal user={user} />

      {temp ? (
        <span className="inline-flex items-center gap-2 rounded-md border border-[var(--crm-line)] bg-[var(--crm-surface-2)] px-2 py-1">
          <code className="text-[12.5px] font-medium text-[var(--crm-ink)]">{temp}</code>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(temp);
              setCopied(true);
            }}
            className="text-[var(--crm-wine)] transition-colors hover:opacity-80"
            title="Copy"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        </span>
      ) : (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await resetUserPassword(userId);
              setTemp(res.tempPassword);
            })
          }
          title="Reset password"
          className="rounded-md p-1.5 text-[var(--crm-ink-mute)] transition-colors hover:bg-[var(--crm-wine-tint)] hover:text-[var(--crm-wine)] disabled:opacity-50"
        >
          {pending && !temp ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" strokeWidth={1.7} />}
        </button>
      )}

      {!isSelf && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => setUserActive(userId, !active))}
          title={active ? "Deactivate" : "Reactivate"}
          className={`rounded-md p-1.5 transition-colors disabled:opacity-50 ${
            active
              ? "text-[var(--crm-ink-mute)] hover:bg-[var(--crm-wine-tint)] hover:text-[var(--crm-wine)]"
              : "text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          {active ? <UserX className="size-4" strokeWidth={1.7} /> : <UserCheck className="size-4" strokeWidth={1.7} />}
        </button>
      )}
    </div>
  );
}
