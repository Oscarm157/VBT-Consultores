"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { editorialEase } from "@/lib/motion";

const MARK_PATH = "M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z";
// Línea del trazo blueprint: azul señal que dibuja el contorno y se atenúa al rellenar.
const BLUEPRINT = "var(--color-signal)";

const HEIGHTS = { sm: 24, md: 30, lg: 44 } as const;

/**
 * Logo blueprint: el imagotipo y las letras "VBT Consultores" se dibujan trazo a
 * trazo (líneas azul señal) y luego se rellenan en blanco, escalonado. Se re-dibuja
 * al hover. Todo en un SVG. El Wordmark estático sigue en Footer/404.
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
  const h = HEIGHTS[size];

  // Trazo apenas insinuado (azul tenue) y relleno que entra pronto: sutil.
  const PEAK = 0.45; // opacidad máxima del trazo blueprint
  const markTransition = (delay: number) => ({
    pathLength: { delay, duration: 0.45, ease: editorialEase },
    fillOpacity: { delay: delay + 0.25, duration: 0.4, ease: editorialEase },
    strokeOpacity: { delay: delay + 0.4, duration: 0.4, ease: editorialEase },
  });
  const textTransition = (delay: number) => ({
    strokeDashoffset: { delay, duration: 0.6, ease: editorialEase },
    fillOpacity: { delay: delay + 0.28, duration: 0.4, ease: editorialEase },
    strokeOpacity: { delay: delay + 0.42, duration: 0.4, ease: editorialEase },
  });

  return (
    <span
      className={`inline-flex text-chalk ${className}`}
      onMouseEnter={() => !reduce && setPlayKey((k) => k + 1)}
    >
      <svg
        key={playKey}
        viewBox="0 0 152 32"
        height={h}
        width={(152 / 32) * h}
        aria-label="VBT Consultores"
        role="img"
        className="overflow-visible"
      >
        {/* imagotipo */}
        <motion.path
          d={MARK_PATH}
          transform="translate(1 2) scale(0.1094)"
          fill="currentColor"
          stroke={BLUEPRINT}
          strokeWidth={0.9}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 } : { pathLength: 0, fillOpacity: 0, strokeOpacity: PEAK }}
          animate={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
          transition={markTransition(0)}
        />

        {/* VBT (serif itálica) */}
        <motion.text
          x={40}
          y={21}
          fill="currentColor"
          stroke={BLUEPRINT}
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", fontSize: 22, letterSpacing: "0.2px" }}
          strokeDasharray={240}
          initial={reduce ? { strokeDashoffset: 0, fillOpacity: 1, strokeOpacity: 0 } : { strokeDashoffset: 240, fillOpacity: 0, strokeOpacity: PEAK }}
          animate={{ strokeDashoffset: 0, fillOpacity: 1, strokeOpacity: 0 }}
          transition={textTransition(0.12)}
        >
          VBT
        </motion.text>

        {/* Consultores (versalitas) */}
        <motion.text
          x={41}
          y={29}
          fill="currentColor"
          fillOpacity={0.7}
          stroke={BLUEPRINT}
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: 6.4, fontWeight: 500, letterSpacing: "1.7px" }}
          strokeDasharray={360}
          initial={reduce ? { strokeDashoffset: 0, fillOpacity: 0.7, strokeOpacity: 0 } : { strokeDashoffset: 360, fillOpacity: 0, strokeOpacity: PEAK }}
          animate={{ strokeDashoffset: 0, fillOpacity: 0.7, strokeOpacity: 0 }}
          transition={textTransition(0.24)}
        >
          CONSULTORES
        </motion.text>
      </svg>
    </span>
  );
}
