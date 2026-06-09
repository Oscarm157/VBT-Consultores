"use client";

import { motion, useReducedMotion } from "motion/react";
import { Plus, Pencil, Flag, UserCheck, MessageSquare, Paperclip, Circle } from "lucide-react";
import { fmtDateTime } from "@/lib/crm-format";

type Event = {
  id: string;
  kind: string;
  detail: string;
  createdAt: Date | string | null;
  authorName: string | null;
};

const META: Record<string, { icon: typeof Plus; cls: string }> = {
  created: { icon: Plus, cls: "bg-emerald-600/12 text-emerald-700" },
  edit: { icon: Pencil, cls: "bg-blue-500/12 text-blue-700" },
  status: { icon: Flag, cls: "bg-amber-500/15 text-amber-700" },
  assign: { icon: UserCheck, cls: "bg-indigo-500/12 text-indigo-700" },
  note: { icon: MessageSquare, cls: "bg-[var(--crm-wine-tint)] text-[var(--crm-wine)]" },
  file: { icon: Paperclip, cls: "bg-teal-500/12 text-teal-700" },
};

export function Activity({ events }: { events: Event[] }) {
  const reduce = useReducedMotion();

  if (events.length === 0) {
    return <p className="text-[13px] text-[var(--crm-ink-mute)]">No activity yet.</p>;
  }

  return (
    <ul className="relative">
      {/* vertical rail */}
      <span className="absolute bottom-2 left-3 top-2 w-px bg-[var(--crm-line)]" aria-hidden />
      {events.map((e, i) => {
        const m = META[e.kind] ?? { icon: Circle, cls: "bg-[var(--crm-surface-2)] text-[var(--crm-ink-mute)]" };
        const Icon = m.icon;
        return (
          <motion.li
            key={e.id}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.035, 0.3), ease: "easeOut" }}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            <span
              className={`relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full ring-4 ring-[var(--crm-surface)] ${m.cls}`}
            >
              <Icon className="size-3" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-[var(--crm-ink-soft)]">{e.detail}</p>
              <p className="text-[11.5px] text-[var(--crm-ink-mute)]">
                {e.authorName ?? "Sistema"} · {fmtDateTime(e.createdAt)}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
