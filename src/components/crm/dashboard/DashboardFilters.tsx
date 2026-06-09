"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

type Agent = { id: string; name: string };

const RANGES = [
  { value: "month", label: "Este mes" },
  { value: "30d", label: "30 días" },
  { value: "90d", label: "90 días" },
  { value: "year", label: "Año" },
  { value: "all", label: "Todo" },
] as const;

const SOURCES = [
  { value: "", label: "Todas las fuentes" },
  { value: "bot", label: "Chatbot" },
  { value: "form", label: "Form" },
  { value: "manual", label: "Manual" },
];

export function DashboardFilters({
  agents,
  showAgent,
}: {
  agents: Agent[];
  showAgent: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const range = params.get("range") ?? "30d";
  const owner = params.get("owner") ?? "";
  const source = params.get("source") ?? "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      const qs = next.toString();
      router.replace(qs ? `/admin/dashboard?${qs}` : "/admin/dashboard", { scroll: false });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2" data-pending={pending ? "" : undefined}>
      {/* segmented control de rango */}
      <div
        className="inline-flex rounded-lg p-0.5"
        style={{ background: "var(--crm-surface-2)", border: "1px solid var(--crm-line)" }}
      >
        {RANGES.map((r) => {
          const on = r.value === range;
          return (
            <button
              key={r.value}
              onClick={() => setParam("range", r.value === "30d" ? "" : r.value)}
              className="relative h-8 rounded-md px-3 text-[12.5px] font-medium transition-colors"
              style={{ color: on ? "#fff" : "var(--crm-ink-soft)" }}
            >
              {on && (
                <motion.span
                  layoutId="crm-range-pill"
                  className="absolute inset-0 rounded-md"
                  style={{ background: "var(--crm-wine)", boxShadow: "0 1px 3px rgba(125,17,30,0.35)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          );
        })}
      </div>

      {showAgent && (
        <SelectField
          ariaLabel="Agent"
          value={owner}
          onChange={(v) => setParam("owner", v)}
          options={[{ value: "", label: "Todos los agentes" }, ...agents.map((a) => ({ value: a.id, label: a.name }))]}
        />
      )}

      <SelectField
        ariaLabel="Source"
        value={source}
        onChange={(v) => setParam("source", v)}
        options={SOURCES}
      />
    </div>
  );
}

function SelectField({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="crm-select h-9 appearance-none !pr-8"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2"
        style={{ color: "var(--crm-ink-mute)" }}
      />
    </div>
  );
}
