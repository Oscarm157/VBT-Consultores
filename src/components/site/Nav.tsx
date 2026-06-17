"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { editorialEase } from "@/lib/motion";
import { Wordmark } from "./Wordmark";
import { PillButton } from "./PillButton";
import type { Locale } from "@/content/dictionaries";

type NavDict = {
  services: string;
  about: string;
  blog: string;
  faq: string;
  contact: string;
  resources: string;
  cta: string;
  megaTitle: string;
  megaLead: string;
};

type ServiceItem = {
  slug: string;
  name: string;
  summary: string;
  items: readonly string[];
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M3 4.5 L6 7.5 L9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Nav({
  lang,
  dict,
  langSwitch,
  services,
  servicesCta,
}: {
  lang: Locale;
  dict: NavDict;
  langSwitch: { to: string; aria: string };
  services: readonly ServiceItem[];
  servicesCta: string;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false); // mobile
  const [menu, setMenu] = useState(false); // services dropdown

  // En la home el hero trae su propio nav: el Nav global se oculta sobre el hero
  // y entra (sólido) al pasar el umbral, mismo punto donde el nav del hero se desvanece.
  const isHome = pathname === `/${lang}`;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cierra menús al cambiar de ruta (reset en render, no en efecto).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
    setMenu(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY >= window.innerHeight * 0.72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(false), 120);
  };

  const otherLang = lang === "es" ? "en" : "es";
  const rest = pathname.replace(/^\/(es|en)/, "");
  const switchHref = `/${otherLang}${rest || ""}`;

  const servicesActive = pathname.startsWith(`/${lang}/servicios`);

  const linkCls = (active: boolean) =>
    `px-3 py-1.5 text-[15px] tracking-[-0.01em] transition-colors ${
      active ? "text-chalk" : "text-bone/90 hover:text-chalk"
    }`;

  const topLinks = [
    { href: `/${lang}/nosotros`, label: dict.about, seg: "nosotros" },
    { href: `/${lang}/blog`, label: dict.blog, seg: "blog" },
    { href: `/${lang}/recursos`, label: dict.resources, seg: "recursos" },
    { href: `/${lang}/contacto`, label: dict.contact, seg: "contacto" },
  ];

  return (
    <header
      onMouseLeave={scheduleClose}
      aria-hidden={isHome && !pastHero ? true : undefined}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,opacity] duration-300 motion-reduce:transition-none ${
        isHome && !pastHero ? "pointer-events-none opacity-0" : "opacity-100"
      } ${
        menu
          ? "border-b border-line bg-ink"
          : scrolled
            ? "glass border-b border-white/[0.06]"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:h-24 sm:px-8">
        <Link href={`/${lang}`} aria-label="VBT Consultores" className="shrink-0">
          <Wordmark size="md" />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href={`/${lang}/servicios`}
            onMouseEnter={openMenu}
            onFocus={openMenu}
            aria-expanded={menu}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[15px] tracking-[-0.01em] transition-colors ${
              menu || servicesActive ? "bg-surface-2 text-chalk" : "text-bone/90 hover:text-chalk"
            }`}
          >
            {dict.services}
            <Chevron open={menu} />
          </Link>

          {topLinks.map((l) => (
            <Link
              key={l.seg}
              href={l.href}
              onMouseEnter={scheduleClose}
              className={linkCls(pathname.startsWith(`/${lang}/${l.seg}`))}
            >
              {l.label}
            </Link>
          ))}

          <Link
            href={switchHref}
            aria-label={langSwitch.aria}
            className="text-[13px] font-medium tracking-[0.08em] text-smoke transition-colors hover:text-chalk"
          >
            {langSwitch.to}
          </Link>
          <PillButton
            href={`/${lang}/contacto`}
            variant="primary"
            className="px-5 py-2.5 text-sm"
          >
            {dict.cta}
          </PillButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-[5px] p-2 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-chalk transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-chalk transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-px w-6 bg-chalk transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Dropdown Servicios (full-width) */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key="mega-serv"
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.2, ease: editorialEase }}
            onMouseEnter={openMenu}
            className="absolute inset-x-0 top-full hidden border-t border-line bg-ink md:block"
          >
            <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_2fr] lg:gap-16">
              <div className="flex flex-col items-start">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
                  <span aria-hidden className="signal-blue-glow inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                  {dict.services}
                </span>
                <h3 className="mt-4 max-w-xs font-serif text-2xl font-normal leading-tight tracking-[-0.02em] text-chalk">
                  {dict.megaTitle}
                </h3>
                <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-bone/90">
                  {dict.megaLead}
                </p>
                <PillButton
                  href={`/${lang}/servicios`}
                  variant="ghost"
                  arrow
                  className="mt-6 text-sm"
                >
                  {servicesCta}
                </PillButton>
              </div>
              <div className="grid gap-x-10 gap-y-9 sm:grid-cols-3 lg:border-l lg:border-line lg:pl-16">
                {services.map((s, i) => (
                  <div key={s.slug}>
                    <Link
                      href={`/${lang}/servicios/${s.slug}`}
                      className="group flex items-baseline gap-2"
                    >
                      <span className="font-mono text-[11px] tabular-nums text-bone">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-[17px] font-normal text-chalk transition-colors group-hover:text-bone">
                        {s.name}
                      </span>
                    </Link>
                    <ul className="mt-4 flex flex-col gap-3 pl-6">
                      {s.items.map((it) => (
                        <li key={it}>
                          <Link
                            href={`/${lang}/servicios/${s.slug}`}
                            className="group flex items-center gap-2 text-[13.5px] leading-snug text-bone/80 transition-colors hover:text-chalk"
                          >
                            <span
                              aria-hidden
                              className="h-1 w-1 shrink-0 rounded-full bg-bone/50 transition-colors group-hover:bg-cream"
                            />
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: editorialEase }}
            className="overflow-hidden border-t border-line bg-ink md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-6">
              {[
                { href: `/${lang}/servicios`, label: dict.services },
                { href: `/${lang}/nosotros`, label: dict.about },
                { href: `/${lang}/blog`, label: dict.blog },
                { href: `/${lang}/faq`, label: dict.faq },
                { href: `/${lang}/recursos`, label: dict.resources },
                { href: `/${lang}/contacto`, label: dict.contact },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-3 font-serif text-2xl tracking-tight text-chalk"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-4">
                <PillButton href={`/${lang}/contacto`} variant="primary" arrow>
                  {dict.cta}
                </PillButton>
                <Link
                  href={switchHref}
                  className="text-[13px] font-medium tracking-[0.08em] text-smoke"
                >
                  {langSwitch.to}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
