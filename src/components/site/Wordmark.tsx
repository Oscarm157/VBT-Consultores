/**
 * Wordmark VBT como texto serif vivo (no el JPEG de referencia).
 * VBT en Playfair display + "Consultores" con tracking, ecoando el logo.
 * El logo limpio final lo entrega Oscar; esto es el placeholder de marca.
 */
export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: { mark: "text-xl", sub: "text-[8px] tracking-[0.5em]" },
    md: { mark: "text-2xl", sub: "text-[9px] tracking-[0.55em]" },
    lg: { mark: "text-4xl", sub: "text-[11px] tracking-[0.6em]" },
  }[size];

  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className={`font-serif font-medium tracking-[0.14em] text-chalk ${scale.mark}`}
      >
        VBT
      </span>
      <span
        className={`mt-1 font-mono uppercase text-bone/80 ${scale.sub}`}
      >
        Consultores
      </span>
    </span>
  );
}
