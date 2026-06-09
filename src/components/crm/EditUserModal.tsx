"use client";

import { useState, useTransition } from "react";
import { Pencil, ShieldCheck, UserCog, Eye } from "lucide-react";
import { updateUser } from "@/app/admin/users-actions";
import type { UserRole } from "@/lib/schema";
import { Modal } from "@/components/crm/Modal";

const labelCls = "mb-1 block text-[12.5px] font-medium text-[var(--crm-ink)]";

const ROLE_OPTIONS: { value: UserRole; label: string; hint: string; icon: typeof ShieldCheck }[] = [
  { value: "agent", label: "Agente", hint: "Solo trabaja sus leads asignados", icon: UserCog },
  { value: "admin", label: "Admin", hint: "Todo, incluida la gestión de usuarios", icon: ShieldCheck },
  { value: "viewer", label: "Lector", hint: "Ve todos los leads, sin editar", icon: Eye },
];

export function EditUserModal({
  user,
}: {
  user: { id: string; name: string; email: string; role: UserRole };
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setRole(user.role);
    setError(null);
    setOpen(true);
  };
  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        title="Edit user"
        className="rounded-md p-1.5 text-[var(--crm-ink-mute)] transition-colors hover:bg-[var(--crm-wine-tint)] hover:text-[var(--crm-wine)]"
      >
        <Pencil className="size-4" strokeWidth={1.7} />
      </button>

      <Modal open={open} onClose={close} title="Edit user" maxWidth={420}>
        <form
          action={(fd) =>
            startTransition(async () => {
              setError(null);
              const res = await updateUser(user.id, {
                name: String(fd.get("name") ?? ""),
                email: String(fd.get("email") ?? ""),
                role,
              });
              if (res.error) setError(res.error);
              else close();
            })
          }
          className="space-y-3.5"
        >
          <div>
            <label className={labelCls} htmlFor="e-name">Nombre</label>
            <input id="e-name" name="name" required defaultValue={user.name} className="crm-input" placeholder="Nombre completo" />
          </div>
          <div>
            <label className={labelCls} htmlFor="e-email">Correo</label>
            <input id="e-email" name="email" type="email" required defaultValue={user.email} className="crm-input" placeholder="nombre@vbtconsultores.com" />
          </div>

          <fieldset>
            <span className={labelCls}>Rol</span>
            <div className="space-y-1.5">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const sel = role === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      sel
                        ? "border-[var(--crm-wine-soft)] bg-[var(--crm-wine-tint)]"
                        : "border-[var(--crm-line)] bg-[var(--crm-surface-2)] hover:border-[var(--crm-line-strong)]"
                    }`}
                  >
                    <Icon className={`mt-0.5 size-4 shrink-0 ${sel ? "text-[var(--crm-wine)]" : "text-[var(--crm-ink-mute)]"}`} strokeWidth={1.8} />
                    <span className="min-w-0">
                      <span className={`block text-[13px] font-medium ${sel ? "text-[var(--crm-wine)]" : "text-[var(--crm-ink)]"}`}>{opt.label}</span>
                      <span className="block text-[11.5px] text-[var(--crm-ink-mute)]">{opt.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && <p className="text-[12.5px] text-[var(--crm-wine)]">{error}</p>}
          <div className="flex items-center gap-2 pt-1">
            <button type="submit" disabled={pending} className="crm-btn crm-btn-primary flex-1">
              {pending ? "Guardando…" : "Guardar cambios"}
            </button>
            <button type="button" onClick={close} className="crm-btn crm-btn-secondary">Cancelar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
