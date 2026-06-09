"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { LeadStatus } from "@/lib/schema";
import { STATUS_META } from "./status";
import { BoardCard } from "./BoardCard";
import type { BoardLead } from "./BoardView";

export function BoardColumn({
  status,
  leads,
  ownerName,
  canDragCard,
  accepts,
  draggingId,
  closed = false,
  onDragStartCard,
  onDragEndCard,
  onDropInColumn,
}: {
  status: LeadStatus;
  leads: BoardLead[];
  ownerName: (lead: BoardLead) => string | null;
  canDragCard: (lead: BoardLead) => boolean;
  // True while a drag is active and the dragged lead may legally land here.
  accepts: boolean;
  draggingId: string | null;
  // Terminal stage (won/lost): se muestra más angosta, como "cerrado".
  closed?: boolean;
  onDragStartCard: (id: string) => void;
  onDragEndCard: () => void;
  onDropInColumn: (leadId: string, status: LeadStatus) => void;
}) {
  const meta = STATUS_META[status];
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        if (!accepts) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!over) setOver(true);
      }}
      onDragLeave={(e) => {
        // Only clear when the pointer actually exits the column wrapper.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!accepts) return;
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDropInColumn(id, status);
      }}
      className={`flex shrink-0 snap-start flex-col ${closed ? "w-[248px]" : "w-[300px]"}`}
    >
      <div className="mb-2 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${meta.dot}`} />
          <span className="text-[12.5px] font-semibold tracking-tight text-[var(--crm-ink)]">{meta.label}</span>
        </div>
        <span className="rounded-md bg-[var(--crm-surface-2)] px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-[var(--crm-ink-soft)]">
          {leads.length}
        </span>
      </div>

      <div
        data-accepts={accepts}
        data-over={over && accepts}
        className="crm-dropzone flex max-h-[calc(100dvh-230px)] min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        <AnimatePresence initial={false}>
          {leads.map((lead) => (
            <BoardCard
              key={lead.id}
              lead={lead}
              ownerName={ownerName(lead)}
              draggable={canDragCard(lead)}
              dragging={draggingId === lead.id}
              onDragStart={() => onDragStartCard(lead.id)}
              onDragEnd={onDragEndCard}
            />
          ))}
        </AnimatePresence>

        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-6 text-center text-[11.5px] text-[var(--crm-ink-mute)]">
            No leads
          </div>
        )}
      </div>
    </div>
  );
}
