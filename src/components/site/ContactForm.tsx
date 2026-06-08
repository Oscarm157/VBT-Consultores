"use client";

import { useState } from "react";
import { SubmitPill } from "./PillButton";

type FormDict = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  servicePlaceholder: string;
  serviceOther: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
};

type ServiceOption = { slug: string; name: string };

const field =
  "w-full rounded-lg border border-line bg-surface-2/60 px-4 py-3 text-[15px] text-chalk placeholder:text-ash outline-none transition-colors focus:border-chalk/40";
const label = "mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-smoke";

export function ContactForm({
  dict,
  services,
  locale,
}: {
  dict: FormDict;
  services: readonly ServiceOption[];
  locale: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale,
          source: "form",
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="console-panel flex min-h-[420px] flex-col items-start justify-center rounded-2xl p-10">
        <span className="signal-glow mb-5 inline-block h-2 w-2 rounded-full bg-cream" />
        <p className="max-w-sm font-serif text-[clamp(1.5rem,3vw,2rem)] font-normal leading-snug text-chalk">
          {dict.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            {dict.name}
          </label>
          <input id="name" name="name" required className={field} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="company" className={label}>
            {dict.company}
          </label>
          <input id="company" name="company" className={field} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            {dict.email}
          </label>
          <input id="email" name="email" type="email" required className={field} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            {dict.phone}
          </label>
          <input id="phone" name="phone" className={field} autoComplete="tel" inputMode="tel" />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={label}>
          {dict.service}
        </label>
        <select id="service" name="service" defaultValue="" className={`${field} appearance-none`}>
          <option value="" disabled>
            {dict.servicePlaceholder}
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="other">{dict.serviceOther}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          {dict.message}
        </label>
        <textarea id="message" name="message" rows={5} required className={`${field} resize-none`} />
      </div>

      {status === "error" && (
        <p className="text-[14px] text-bone">{dict.error}</p>
      )}

      <SubmitPill type="submit" variant="primary" arrow disabled={status === "sending"}>
        {status === "sending" ? dict.sending : dict.submit}
      </SubmitPill>
    </form>
  );
}
