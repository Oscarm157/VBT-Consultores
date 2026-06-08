"use client";

import { motion, useReducedMotion } from "motion/react";
import { editorialEase } from "@/lib/motion";

/** Divisor/acento: una línea off-white que se dibuja al entrar en vista + un punto que la recorre. */
export function SignalLine({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative h-[2px] w-full ${className}`}>
      <svg viewBox="0 0 100 2" preserveAspectRatio="none" className="h-[2px] w-full" aria-hidden>
        <motion.line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          stroke="#f5f5f0"
          strokeOpacity="0.6"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: editorialEase }}
        />
      </svg>
      {!reduce && (
        <motion.span
          aria-hidden
          className="signal-glow absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream"
          initial={{ left: "0%" }}
          whileInView={{ left: ["0%", "100%"] }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.6, ease: editorialEase }}
        />
      )}
    </div>
  );
}
