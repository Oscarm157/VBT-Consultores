import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/crm-session";
import { canManageUsers, canViewDashboard } from "@/lib/crm-permissions";
import { logout } from "../actions";
import { PanelNav } from "./PanelNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  if (me.mustChangePassword) redirect("/admin/change-password");

  return (
    <div className="min-h-[100dvh]">
      <PanelNav
        user={{ name: me.name, role: me.role }}
        showUsers={canManageUsers(me.role)}
        showDashboard={canViewDashboard(me.role)}
        logoutAction={logout}
      />
      <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-7 sm:py-8">{children}</main>
    </div>
  );
}
