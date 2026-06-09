"use client";

import { Fragment, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { List, LayoutGrid } from "lucide-react";
import type { LeadStatus, LeadSource, LeadQualification } from "@/lib/schema";
import type { UserRole } from "@/lib/schema";
import { canEditLead } from "@/lib/crm-permissions";
import { updateLeadStatus } from "@/app/admin/actions";
import { STATUS_ORDER } from "./status";
import { BoardColumn } from "./BoardColumn";

export type BoardLead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string | null;
  qualification: LeadQualification | null;
  createdAt: Date | string | null;
};

type Viewer = { id: string; role: UserRole };

export function BoardView({
  leads,
  viewer,
  userMap,
}: {
  leads: BoardLead[];
  viewer: Viewer;
  userMap: Record<string, string>;
}) {
  const [items, setItems] = useState<BoardLead[]>(leads);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  // Last-known good status per lead so a failed action can roll back precisely.
  const prevStatus = useRef<Record<string, LeadStatus>>({});

  // Drag-to-scroll horizontal: arrastrar el fondo del board paneando la tabla.
  // No se activa sobre tarjetas (draggable) ni controles, para no chocar con el DnD.
  const scrollRef = useRef<HTMLDivElement>(null);
  const pan = useRef({ active: false, startX: 0, startScroll: 0 });

  function onPanStart(e: React.MouseEvent) {
    const el = scrollRef.current;
    if (!el) return;
    if ((e.target as HTMLElement).closest('[draggable="true"], a, button, select, input')) return;
    pan.current = { active: true, startX: e.pageX, startScroll: el.scrollLeft };
    el.style.cursor = "grabbing";
  }
  function onPanMove(e: React.MouseEvent) {
    if (!pan.current.active || !scrollRef.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft = pan.current.startScroll - (e.pageX - pan.current.startX);
  }
  function onPanEnd() {
    pan.current.active = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "";
  }

  const grouped = useMemo(() => {
    const g: Record<LeadStatus, BoardLead[]> = {
      new: [], contacted: [], following_up: [], proposal: [], won: [], lost: [],
    };
    for (const l of items) g[l.status].push(l);
    return g;
  }, [items]);

  const ownerName = (lead: BoardLead) =>
    lead.assignedTo ? userMap[lead.assignedTo] ?? null : null;

  const canDragCard = (lead: BoardLead) =>
    canEditLead(viewer, { assignedTo: lead.assignedTo });

  const draggedLead = draggingId ? items.find((l) => l.id === draggingId) ?? null : null;

  function move(leadId: string, status: LeadStatus) {
    // Clear drag state on drop: when the card is re-parented to another column,
    // its native dragend can be lost, leaving the card dimmed until the next render.
    setDraggingId(null);
    const lead = items.find((l) => l.id === leadId);
    if (!lead || lead.status === status) return;
    if (!canDragCard(lead)) return;

    prevStatus.current[leadId] = lead.status;
    setItems((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );

    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, status);
      } catch {
        // Roll back to the column it came from; the server rejected the move.
        const back = prevStatus.current[leadId];
        setItems((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: back } : l))
        );
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-[30px] tracking-tight text-[var(--crm-ink)]">Board</h1>
          <span className="text-[13px] tabular-nums text-[var(--crm-ink-soft)]">{items.length} total</span>
        </div>
        <div className="inline-flex items-center rounded-full border border-[var(--crm-line)] bg-[var(--crm-surface)] p-0.5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-[var(--crm-ink-soft)] transition-colors hover:text-[var(--crm-ink)]"
          >
            <List className="size-3.5" strokeWidth={1.75} />
            List
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--crm-wine)] px-3 py-1.5 text-[13px] font-medium text-white">
            <LayoutGrid className="size-3.5" strokeWidth={1.75} />
            Board
          </span>
        </div>
      </div>

      <p className="mt-2 text-[12.5px] text-[var(--crm-ink-soft)]">
        {viewer.role === "viewer"
          ? "Read-only view of the board."
          : "Drag a lead to another column to change its status."}
      </p>

      <div
        ref={scrollRef}
        onMouseDown={onPanStart}
        onMouseMove={onPanMove}
        onMouseUp={onPanEnd}
        onMouseLeave={onPanEnd}
        className="mt-5 -mx-5 cursor-grab overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0"
      >
        <div className="flex snap-x items-start gap-3">
          {STATUS_ORDER.map((status) => {
            const accepts =
              !!draggedLead &&
              draggedLead.status !== status &&
              canDragCard(draggedLead);
            return (
              <Fragment key={status}>
                {/* won/lost van como "cerrados", separados del pipeline activo */}
                {status === "won" && (
                  <div className="mx-1 w-px shrink-0 self-stretch bg-[var(--crm-line)]" aria-hidden />
                )}
                <BoardColumn
                  status={status}
                  closed={status === "won" || status === "lost"}
                  leads={grouped[status]}
                  ownerName={ownerName}
                  canDragCard={canDragCard}
                  accepts={accepts}
                  draggingId={draggingId}
                  onDragStartCard={setDraggingId}
                  onDragEndCard={() => setDraggingId(null)}
                  onDropInColumn={move}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
