import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Wordmark size="lg" />
      <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-bone">
        Error 404
      </p>
      <h1 className="mt-5 max-w-lg font-serif text-[clamp(2rem,6vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.02em] text-chalk">
        Esta página no existe.
      </h1>
      <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-bone/80">
        La dirección cambió o el enlace está roto. This page could not be found.
      </p>
      <Link
        href="/es"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-accent-dim"
      >
        Volver al inicio
        <span aria-hidden>&rarr;</span>
      </Link>
    </main>
  );
}
