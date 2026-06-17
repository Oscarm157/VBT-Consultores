"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { editorialEase } from "@/lib/motion";

const MARK_PATH = "M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z";

/**
 * Variante animada del logo: el imagotipo (chevron) se dibuja trazo a trazo al
 * montar y se re-dibuja al hover. Misma lockup que Wordmark. Para hero y nav;
 * el Wordmark estático sigue en Footer/404.
 */
export function WordmarkAnimated({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const reduce = useReducedMotion();
  const [playKey, setPlayKey] = useState(0);

  const scale = {
    sm: { mark: 24, brand: "text-xl", sub: "text-[7px] tracking-[0.28em]" },
    md: { mark: 28, brand: "text-2xl", sub: "text-[8px] tracking-[0.3em]" },
    lg: { mark: 40, brand: "text-4xl", sub: "text-[10px] tracking-[0.32em]" },
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-2.5 text-chalk ${className}`}
      onMouseEnter={() => !reduce && setPlayKey((k) => k + 1)}
    >
      <svg
        width={scale.mark}
        height={scale.mark}
        viewBox="0 0 256 256"
        aria-hidden
        className="shrink-0 overflow-visible"
      >
        <motion.path
          key={playKey}
          d={MARK_PATH}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          initial={reduce ? { pathLength: 1, fillOpacity: 1 } : { pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{
            pathLength: { duration: 0.9, ease: editorialEase },
            fillOpacity: { delay: 0.45, duration: 0.45, ease: editorialEase },
          }}
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif italic font-normal ${scale.brand}`}>VBT</span>
        <span className={`mt-0.5 font-medium uppercase text-bone/70 ${scale.sub}`}>
          Consultores
        </span>
      </span>
    </span>
  );
}
