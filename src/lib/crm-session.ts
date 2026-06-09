import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, leads, type UserRole } from "./schema";
import { CRM_COOKIE, verifySession } from "./crm-auth";
import { normalizeRole, canEditLead } from "./crm-permissions";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const uid = await verifySession(jar.get(CRM_COOKIE)?.value);
  if (!uid) return null;
  const rows = await db.select().from(users).where(eq(users.id, uid));
  const u = rows[0];
  if (!u || !u.active) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: normalizeRole(u.role),
    mustChangePassword: u.mustChangePassword,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) throw new Error("unauthorized");
  return u;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const u = await requireUser();
  if (u.role !== "admin") throw new Error("forbidden");
  return u;
}

/**
 * Carga el lead y garantiza que el usuario actual pueda editarlo.
 * Redirige a /admin si no hay sesión o el usuario no tiene alcance sobre el lead.
 */
export async function requireLeadAccess(leadId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const rows = await db
    .select({ id: leads.id, assignedTo: leads.assignedTo })
    .from(leads)
    .where(eq(leads.id, leadId));
  const lead = rows[0];
  if (!lead || !canEditLead(user, lead)) redirect("/admin");
  return { user, lead };
}
