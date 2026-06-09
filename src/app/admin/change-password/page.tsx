import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, KeyRound, Check } from "lucide-react";
import { getCurrentUser } from "@/lib/crm-session";
import { changePassword } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Password", robots: { index: false, follow: false } };

const RULES = ["At least 8 characters", "Different from the temporary one"];

export default async function ChangePassword({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");

  const { error } = await searchParams;
  const forced = me.mustChangePassword;

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--crm-surface)] to-[var(--crm-bg)] px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[440px] -translate-x-1/2 rounded-full bg-[var(--crm-wine-tint)] blur-3xl"
      />
      <div className="crm-fade relative w-full max-w-[380px]">
        {!forced && (
          <Link
            href="/admin/profile"
            className="mb-5 inline-flex items-center gap-1.5 text-[12.5px] text-[var(--crm-ink-mute)] transition-colors hover:text-[var(--crm-ink)]"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.8} />
            Back to profile
          </Link>
        )}

        <div className="mb-7 text-center">
          <span className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-[var(--crm-wine-tint)] text-[var(--crm-wine)]">
            <KeyRound className="size-5" strokeWidth={1.7} />
          </span>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--crm-wine)]">VBT Consultores</p>
          <h1 className="mt-1.5 font-serif text-[25px] tracking-tight text-[var(--crm-ink)]">
            {forced ? "Set a password" : "Cambiar contraseña"}
          </h1>
          {forced && (
            <p className="mt-1.5 text-[13px] text-[var(--crm-ink-mute)]">First sign-in: choose a password only you know.</p>
          )}
        </div>

        <form action={changePassword} className="crm-card p-6 shadow-[0_12px_40px_rgba(20,18,14,0.07)]">
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-[var(--crm-ink)]">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoFocus
            autoComplete="new-password"
            className="crm-input !h-10 !text-[15px]"
            placeholder="At least 8 characters"
          />
          {error && <p className="mt-2.5 text-[12.5px] text-[var(--crm-wine)]">The password must be at least 8 characters.</p>}

          <ul className="mt-3 space-y-1">
            {RULES.map((r) => (
              <li key={r} className="flex items-center gap-1.5 text-[12px] text-[var(--crm-ink-mute)]">
                <Check className="size-3 text-[var(--crm-ink-mute)]" strokeWidth={2} />
                {r}
              </li>
            ))}
          </ul>

          <button type="submit" className="crm-btn crm-btn-primary mt-5 w-full">
            {forced ? "Save and continue" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
