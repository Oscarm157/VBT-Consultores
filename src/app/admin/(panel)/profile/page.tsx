import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/crm-session";
import { ProfileForm } from "@/components/crm/ProfileForm";
import { ROLE_LABELS } from "@/components/crm/UserRowActions";
import { Breadcrumb } from "@/components/crm/Breadcrumb";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile", robots: { index: false } };

const ROLE_NOTE: Record<string, string> = {
  admin: "Full access, including user management.",
  agent: "You only work the leads assigned to you.",
  viewer: "You see all leads in read-only mode, no editing.",
};

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");

  return (
    <div className="crm-fade">
      <Breadcrumb items={[{ label: "Leads", href: "/admin" }, { label: "Profile" }]} />

      <div className="mt-4">
        <h1 className="font-serif text-[28px] tracking-tight text-[var(--crm-ink)]">Your profile</h1>
        <p className="mt-0.5 text-[13px] text-[var(--crm-ink-mute)]">Edita tu nombre y administra tu contraseña.</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="crm-card p-6">
          <ProfileForm name={me.name} email={me.email} />
        </div>

        <aside className="space-y-4">
          <div className="crm-card p-5">
            <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--crm-ink-mute)]">Rol</p>
            <p className="mt-1.5 font-serif text-[18px] tracking-tight text-[var(--crm-ink)]">{ROLE_LABELS[me.role]}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--crm-ink-soft)]">{ROLE_NOTE[me.role]}</p>
          </div>

          <Link
            href="/admin/change-password"
            className="crm-card group flex items-center justify-between gap-3 p-5 transition-colors hover:border-[var(--crm-wine-soft)] hover:bg-[var(--crm-wine-tint)]"
          >
            <span className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--crm-wine-tint)] text-[var(--crm-wine)]">
                <KeyRound className="size-4" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-[13.5px] font-medium text-[var(--crm-ink)]">Cambiar contraseña</span>
                <span className="block text-[12px] text-[var(--crm-ink-mute)]">Set a new one whenever you want</span>
              </span>
            </span>
            <ArrowRight className="size-4 text-[var(--crm-ink-mute)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--crm-wine)]" strokeWidth={1.8} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
