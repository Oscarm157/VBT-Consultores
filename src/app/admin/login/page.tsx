import { login } from "../actions";

export const metadata = { title: "Acceso", robots: { index: false, follow: false } };

export default async function CrmLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 py-10">
      <div className="crm-fade w-full max-w-[368px]">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--crm-wine)]">
            VBT Consultores
          </p>
          <h1 className="mt-2 font-serif text-[26px] leading-tight tracking-tight text-[var(--crm-ink)]">
            Acceso al panel
          </h1>
          <p className="mt-1.5 text-[13px] text-[var(--crm-ink-mute)]">
            Panel interno de gestión.
          </p>
        </div>

        <form action={login} className="crm-card p-6 sm:p-7">
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-[var(--crm-ink)]">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="username"
            className="crm-input"
            placeholder="tu@vbtconsultores.com"
          />

          <label htmlFor="password" className="mb-1.5 mt-4 block text-[13px] font-medium text-[var(--crm-ink)]">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="crm-input"
            placeholder="••••••••"
          />

          {error && (
            <p className="mt-3 rounded-lg border border-[var(--crm-wine)]/25 bg-[var(--crm-wine-tint)] px-3 py-2 text-[12.5px] text-[var(--crm-wine)]">
              Correo o contraseña incorrectos.
            </p>
          )}

          <button type="submit" className="crm-btn crm-btn-primary mt-5 h-10 w-full">
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-[12px] text-[var(--crm-ink-mute)]">
          Solo para el equipo de VBT Consultores.
        </p>
      </div>
    </div>
  );
}
