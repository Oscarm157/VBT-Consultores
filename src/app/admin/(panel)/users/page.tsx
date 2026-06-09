import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/crm-session";
import { getAllUsers } from "@/lib/crm-data";
import { canManageUsers } from "@/lib/crm-permissions";
import { fmtDate } from "@/lib/crm-format";
import { AddUserModal } from "@/components/crm/AddUserModal";
import { UserRowActions, UserRoleSelect } from "@/components/crm/UserRowActions";
import { Breadcrumb } from "@/components/crm/Breadcrumb";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users", robots: { index: false } };

export default async function UsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  if (!canManageUsers(me.role)) redirect("/admin");

  const all = await getAllUsers();

  return (
    <div className="crm-fade">
      <Breadcrumb items={[{ label: "Leads", href: "/admin" }, { label: "Users" }]} />
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] tracking-tight text-[var(--crm-ink)]">Users</h1>
          <p className="mt-0.5 text-[13px] text-[var(--crm-ink-mute)]">
            {all.length} total · team roles and access
          </p>
        </div>
        <AddUserModal />
      </div>

      <div className="crm-card mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-left">
          <thead className="border-b border-[var(--crm-line)] bg-[var(--crm-surface-2)] text-[11px] uppercase tracking-[0.08em] text-[var(--crm-ink-mute)]">
            <tr>
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Correo</th>
              <th className="px-4 py-2.5 font-medium">Rol</th>
              <th className="px-4 py-2.5 font-medium">Estado</th>
              <th className="px-4 py-2.5 font-medium">Alta</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--crm-line)]">
            {all.map((u) => {
              const isSelf = u.id === me.id;
              return (
                <tr key={u.id} className="transition-colors hover:bg-[var(--crm-wine-tint)]">
                  <td className="px-4 py-3 text-[13.5px] font-medium text-[var(--crm-ink)]">
                    {u.name}
                    {isSelf && <span className="ml-2 text-[11px] text-[var(--crm-ink-mute)]">you</span>}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--crm-ink-soft)]">{u.email}</td>
                  <td className="px-4 py-3">
                    <UserRoleSelect
                      userId={u.id}
                      role={u.role}
                      locked={isSelf && u.role === "admin"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[12.5px] ${u.active ? "text-emerald-700" : "text-[var(--crm-ink-mute)]"}`}>
                      <span className={`size-1.5 rounded-full ${u.active ? "bg-emerald-500" : "bg-stone-400"}`} />
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-[var(--crm-ink-mute)]">{fmtDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <UserRowActions
                      user={{ id: u.id, name: u.name, email: u.email, role: u.role }}
                      active={u.active}
                      isSelf={isSelf}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
