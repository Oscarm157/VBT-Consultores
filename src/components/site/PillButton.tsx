import Link from "next/link";

type Variant = "primary" | "ghost" | "accent" | "inverted";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] transition-all duration-300 active:scale-[0.98] hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-cream text-ink hover:bg-accent-dim",
  ghost: "border border-chalk/30 text-chalk hover:border-chalk/70 hover:bg-chalk/[0.04]",
  accent: "bg-cream text-ink hover:bg-accent-dim",
  inverted: "bg-surface-2 text-chalk hover:bg-surface-3 border border-line",
};

function Arrow() {
  return (
    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
      &rarr;
    </span>
  );
}

type CommonProps = {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function PillButton({
  href,
  external,
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...rest
}: CommonProps & {
  href: string;
  external?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
        {arrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function SubmitPill({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
