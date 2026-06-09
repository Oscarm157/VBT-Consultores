"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";

type Owner = { id: string; name: string };

const SOURCES = [
  { value: "", label: "Todas las fuentes" },
  { value: "bot", label: "Chatbot" },
  { value: "form", label: "Formulario" },
  { value: "manual", label: "Manual" },
];

const SORTS = [
  { value: "recent", label: "Más recientes" },
  { value: "name", label: "Name A–Z" },
  { value: "status", label: "Etapa" },
];

const selectCls = "crm-select h-9 appearance-none !pl-3 !pr-8 text-[13px]";

function Select({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        aria-label={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectCls}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--crm-ink-mute)]" />
    </div>
  );
}

export function LeadFilters({
  owners,
  showOwner,
  showUnassigned,
}: {
  owners: Owner[];
  showOwner: boolean;
  showUnassigned: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(params.get("search") ?? "");
  const [advanced, setAdvanced] = useState(
    Boolean(params.get("owner") || params.get("source") || params.get("sort"))
  );
  const firstRender = useRef(true);

  const owner = params.get("owner") ?? "";
  const source = params.get("source") ?? "";
  const sort = params.get("sort") ?? "recent";
  const unassigned = params.get("unassigned") === "1";

  // Push a single param change while preserving the rest; reset page to 1.
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    startTransition(() => {
      const qs = next.toString();
      router.replace(qs ? `/admin?${qs}` : "/admin", { scroll: false });
    });
  }

  // Debounce the search box into the URL.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      if ((params.get("search") ?? "") !== search) setParam("search", search);
    }, 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const ownerOptions = [
    { value: "", label: "Todos los responsables" },
    ...owners.map((o) => ({ value: o.id, label: o.name })),
  ];

  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="group relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--crm-ink-mute)] transition-colors group-focus-within:text-[var(--crm-wine)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, correo, teléfono, empresa…"
            className="crm-input h-10 !pl-10 !pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--crm-ink-mute)] transition-colors hover:bg-[var(--crm-surface-2)] hover:text-[var(--crm-ink)]"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {showUnassigned && (
          <button
            onClick={() => setParam("unassigned", unassigned ? "" : "1")}
            className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors ${
              unassigned
                ? "border-[var(--crm-wine-ring)] bg-[var(--crm-wine-tint)] text-[var(--crm-wine)]"
                : "border-[var(--crm-line-strong)] bg-[var(--crm-surface)] text-[var(--crm-ink-soft)] hover:border-[var(--crm-ink-mute)] hover:text-[var(--crm-ink)]"
            }`}
          >
            <span className={`size-1.5 rounded-full ${unassigned ? "bg-[var(--crm-wine)]" : "bg-[var(--crm-ink-mute)]"}`} />
            Sin asignar
          </button>
        )}

        <button
          onClick={() => setAdvanced((v) => !v)}
          className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors ${
            advanced
              ? "border-[var(--crm-ink-mute)] bg-[var(--crm-surface-2)] text-[var(--crm-ink)]"
              : "border-[var(--crm-line-strong)] bg-[var(--crm-surface)] text-[var(--crm-ink-soft)] hover:border-[var(--crm-ink-mute)] hover:text-[var(--crm-ink)]"
          }`}
        >
          <SlidersHorizontal className="size-3.5" />
          Filtros
        </button>
      </div>

      {advanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-2 gap-2 pt-0.5 sm:grid-cols-3">
            {showOwner && (
              <Select name="owner" value={owner} options={ownerOptions} onChange={(v) => setParam("owner", v)} />
            )}
            <Select name="source" value={source} options={SOURCES} onChange={(v) => setParam("source", v)} />
            <Select name="sort" value={sort} options={SORTS} onChange={(v) => setParam("sort", v === "recent" ? "" : v)} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
