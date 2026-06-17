import Link from "next/link";
import { Wordmark } from "./Wordmark";
import type { Dictionary, Locale } from "@/content/dictionaries";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${lang}/servicios`, label: dict.nav.services },
    { href: `/${lang}/nosotros`, label: dict.nav.about },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/faq`, label: dict.nav.faq },
    { href: `/${lang}/recursos`, label: dict.nav.resources },
    { href: `/${lang}/contacto`, label: dict.nav.contact },
  ];
  const c = dict.contact;

  return (
    <footer className="border-t border-white/[0.08] bg-ink">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1.1fr]">
          <div className="max-w-sm">
            <Wordmark size="lg" />
            <p className="mt-7 text-[15px] leading-relaxed text-bone/90">
              {dict.footer.tagline}
            </p>
            <a
              href={`mailto:${c.email}`}
              className="mt-6 inline-block text-[15px] text-chalk underline decoration-white/30 decoration-1 underline-offset-4 transition-colors hover:decoration-chalk"
            >
              {c.email}
            </a>
          </div>

          <div>
            <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-smoke">
              {dict.footer.navLabel}
            </h3>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-bone/90 transition-colors hover:text-chalk"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-smoke">
              {dict.footer.contactLabel}
            </h3>
            <ul className="mt-5 space-y-4 text-[14px] leading-relaxed text-bone/90">
              <li>
                {c.address}
                <br />
                {c.city}
              </li>
              <li>
                <a href={c.phoneHref} className="transition-colors hover:text-chalk">
                  {c.phone}
                </a>
                <span className="px-2 text-ash">·</span>
                <a
                  href={c.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-chalk"
                >
                  WhatsApp {c.whatsapp}
                </a>
              </li>
              <li>
                <span className="text-smoke">{dict.footer.hoursLabel}: </span>
                {c.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center">
          <span className="text-[13px] text-ash">
            &copy; {2026} VBT Consultores. {dict.footer.rights}
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ash">
            Tijuana, B.C.
          </span>
        </div>
      </div>
    </footer>
  );
}
