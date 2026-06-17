/**
 * Logo VBT: imagotipo (doble chevron) + "VBT" serif itálica + "Consultores" en
 * versalitas. Mismo lockup que arranca en el hero. Hereda color via currentColor.
 */
export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: { mark: 24, brand: "text-xl", sub: "text-[7px] tracking-[0.28em]" },
    md: { mark: 28, brand: "text-2xl", sub: "text-[8px] tracking-[0.3em]" },
    lg: { mark: 40, brand: "text-4xl", sub: "text-[10px] tracking-[0.32em]" },
  }[size];

  return (
    <span className={`inline-flex items-center gap-2.5 text-chalk ${className}`}>
      <svg
        width={scale.mark}
        height={scale.mark}
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden
        className="shrink-0"
      >
        <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
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
