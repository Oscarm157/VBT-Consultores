"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteLead } from "@/app/admin/actions";

export function DeleteLeadButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this lead? This permanently removes its notes, files and activity.")) {
          startTransition(() => deleteLead(id));
        }
      }}
      title="Delete lead"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-2.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" strokeWidth={2} /> : <Trash2 className="size-3.5" strokeWidth={1.8} />}
      Delete
    </button>
  );
}
