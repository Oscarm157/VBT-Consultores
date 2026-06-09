"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  KanbanSquare,
  ListFilter,
  UserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: typeof Users };

const roleLabels: Record<string, string> = {
  admin: "Admin",
  agent: "Agente",
  viewer: "Lector",
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function PanelNav({
  user,
  showUsers,
  showDashboard,
  logoutAction,
}: {
  user: { name: string; role: string };
  showUsers: boolean;
  showDashboard: boolean;
  logoutAction: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [];
  if (showDashboard) items.push({ href: "/admin/dashboard", label: "Resumen", icon: LayoutDashboard });
  items.push({ href: "/admin", label: "Leads", icon: ListFilter });
  items.push({ href: "/admin/board", label: "Tablero", icon: KanbanSquare });
  items.push({ href: "/admin/profile", label: "Perfil", icon: UserRound });
  if (showUsers) items.push({ href: "/admin/users", label: "Usuarios", icon: Users });

  const roleLabel = roleLabels[user.role] ?? user.role;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--crm-line)] bg-[var(--crm-surface)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-7">
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-1.5">
          <Link href="/admin" className="mr-2 flex items-baseline gap-2 sm:mr-3">
            <span className="font-serif text-[18px] leading-none tracking-tight text-[var(--crm-ink)]">
              VBT Consultores
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--crm-wine)] sm:inline">
              CRM
            </span>
          </Link>
          <nav className="hidden items-center gap-0.5 md:flex">
            {items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="crm-nav-link"
                data-active={isActive(pathname, href)}
              >
                <Icon className="size-[15px]" strokeWidth={1.9} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User + logout (desktop) */}
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="max-w-[160px] truncate text-[13px] font-medium text-[var(--crm-ink-soft)]">
              {user.name}
            </span>
            <span className="crm-badge crm-badge-wine">{roleLabel}</span>
          </div>
          <form action={logoutAction} className="hidden md:block">
            <button type="submit" className="crm-btn crm-btn-ghost crm-btn-sm" aria-label="Salir">
              <LogOut className="size-[15px]" strokeWidth={1.9} />
              Salir
            </button>
          </form>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="crm-btn crm-btn-ghost crm-btn-sm !px-2 md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="crm-mobile-nav"
          >
            {open ? <X className="size-[18px]" strokeWidth={1.9} /> : <Menu className="size-[18px]" strokeWidth={1.9} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="crm-mobile-nav"
          className="crm-fade border-t border-[var(--crm-line)] bg-[var(--crm-surface)] shadow-[0_18px_40px_rgba(20,18,14,0.12)] md:hidden"
        >
          <div className="mx-auto max-w-[1200px] px-4 pb-4 pt-3 sm:px-7">
            <div className="mb-2.5 flex items-center gap-2 px-1">
              <span className="truncate text-[13px] font-medium text-[var(--crm-ink-soft)]">{user.name}</span>
              <span className="crm-badge crm-badge-wine">{roleLabel}</span>
            </div>
            <nav className="flex flex-col gap-1">
              {items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="crm-nav-link !h-11 !w-full !justify-start !text-[14px]"
                  data-active={isActive(pathname, href)}
                >
                  <Icon className="size-[17px]" strokeWidth={1.9} />
                  {label}
                </Link>
              ))}
            </nav>
            <form action={logoutAction} className="mt-2.5 border-t border-[var(--crm-line)] pt-2.5">
              <button type="submit" className="crm-btn crm-btn-ghost crm-btn-sm !h-11 !w-full !justify-start !text-[14px]">
                <LogOut className="size-[17px]" strokeWidth={1.9} />
                Salir
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
