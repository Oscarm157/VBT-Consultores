import { Reveal } from "./Reveal";
import { SignalLine } from "./SignalLine";

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  align = "left",
  tone = "dark",
  rule = true,
  level = "h2",
  className = "",
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  rule?: boolean;
  level?: "h1" | "h2";
  className?: string;
}) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const light = tone === "light";
  const Title = level;
  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span
          className={`mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] ${light ? "text-accent-ink" : "text-bone"}`}
        >
          {index && <span className="tabular-nums text-ash">{index}</span>}
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {eyebrow}
        </span>
      )}
      <Title
        className={`font-serif text-[clamp(2.1rem,5vw,3.8rem)] font-normal leading-[1.04] tracking-[-0.02em] ${light ? "text-ink" : "text-chalk"}`}
      >
        {title}
      </Title>
      {lead && (
        <p
          className={`mt-6 max-w-xl text-[17px] leading-relaxed ${light ? "text-ink/65" : "text-bone/90"}`}
        >
          {lead}
        </p>
      )}
      {rule && !light && <SignalLine className="mt-7 w-16" />}
    </Reveal>
  );
}
