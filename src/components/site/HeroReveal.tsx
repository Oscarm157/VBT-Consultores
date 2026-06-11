"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const BG_IMAGE_1 = "/v2/base.webp";
const BG_IMAGE_2 = "/v2/reveal.webp";
const SPOTLIGHT_R = 260;

type NavLink = { label: string; href: string };

function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string;
  cursorX: number;
  cursorY: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,0.75)");
    g.addColorStop(0.75, "rgba(255,255,255,0.4)");
    g.addColorStop(0.88, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const mask = canvas.toDataURL();
    reveal.style.maskImage = `url(${mask})`;
    reveal.style.webkitMaskImage = `url(${mask})`;
    reveal.style.maskSize = "100% 100%";
    reveal.style.webkitMaskSize = "100% 100%";
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export function HeroReveal({
  lang,
  title1,
  title2,
  paraLeft,
  paraRight,
  cta,
  navLinks,
  navCta,
}: {
  lang: string;
  title1: string;
  title2: string;
  paraLeft: string;
  paraRight: string;
  cta: NavLink;
  navLinks: readonly NavLink[];
  navCta: NavLink;
}) {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: "100dvh" }}
    >
      {/* 1 · base image */}
      <div
        className="hero-zoom absolute inset-0 bg-center bg-cover bg-no-repeat z-10"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* 2 · cursor-revealed image */}
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <Link href={`/${lang}/v2`} className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 256 256" fill="#ffffff" aria-hidden>
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-3xl font-serif italic">VBT</span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1">
          {navLinks.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "text-white"
                  : "text-white/80 hover:bg-white/15 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href={navCta.href}
          className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {navCta.label}
        </Link>
      </nav>

      {/* heading */}
      <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 z-50 pointer-events-none">
        <h1
          className="text-white leading-[0.95]"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)" }}
        >
          <span
            className="hero-anim hero-reveal block font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.04em", animationDelay: "0.25s" }}
          >
            {title1}
          </span>
          <span
            className="hero-anim hero-reveal block font-sans font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
            style={{ letterSpacing: "-0.06em", animationDelay: "0.42s" }}
          >
            {title2}
          </span>
        </h1>
      </div>

      {/* bottom row: textos hasta abajo (items-end); boton arriba del texto derecho */}
      <div className="absolute bottom-8 sm:bottom-10 left-5 right-5 md:left-14 md:right-14 z-50 flex items-end justify-between gap-8 pointer-events-none">
        {/* bottom-left */}
        <p className="hero-anim hero-fade hidden sm:block max-w-[260px] text-sm text-white/80 leading-relaxed" style={{ animationDelay: "0.7s" }}>
          {paraLeft}
        </p>

        {/* bottom-right: boton encima, texto debajo */}
        <div
          className="hero-anim hero-fade w-full sm:w-auto sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5"
          style={{ animationDelay: "0.85s" }}
        >
          <Link
            href={cta.href}
            className="pointer-events-auto bg-signal hover:bg-signal-dim text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-signal/30"
          >
            {cta.label}
          </Link>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{paraRight}</p>
        </div>
      </div>
    </section>
  );
}
