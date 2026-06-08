"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { editorialEase } from "@/lib/motion";

type Item = { q: string; a: string };

export function Accordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <ul className="border-t border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.q} className="border-b border-line">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-7 text-left"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-[12px] tabular-nums text-bone">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-[clamp(1.2rem,2.2vw,1.6rem)] font-normal leading-snug tracking-[-0.01em] text-chalk">
                  {it.q}
                </span>
              </span>
              <span
                aria-hidden
                className={`mt-1.5 shrink-0 text-bone transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3.5v11M3.5 9h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: editorialEase }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 pl-9 text-[16px] leading-relaxed text-bone/85">
                    {it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
