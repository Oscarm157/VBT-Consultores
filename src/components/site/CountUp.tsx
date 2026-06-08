"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * Cuenta de 0 al valor cuando `run` es true. Arranca SIEMPRE en el valor final,
 * así que aunque no anime, muestra lo correcto. Maneja prefijos/sufijos ("20+", "50K").
 */
export function CountUp({ value, run }: { value: string; run: boolean }) {
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? parseInt(match[2], 10) : null;
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduce || target === null || !run || !match) {
      setDisplay(value);
      return;
    }
    const pre = match[1];
    const post = match[3];
    setDisplay(`${pre}0${post}`);
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${pre}${Math.round(v)}${post}`),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
    // No incluir `match` (array nuevo cada render) en deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduce, target, value]);

  return <span>{display}</span>;
}
