import { redirect } from "next/navigation";

import { getServerSession } from "@/server/session";
import type { AppRole } from "@/server/auth";

export function isAdminLike(role: AppRole): boolean {
  return role === "admin" || role === "top_admin";
}

export function canAccessFinanceBudget(role: AppRole): boolean {
  return role === "admin" || role === "top_admin" || role === "finance";
}

export async function requireRole(allowed: AppRole[], opts?: { redirectTo?: string }) {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");
  if (!allowed.includes(session.role)) redirect(opts?.redirectTo ?? "/dashboard");
  return session;
}

export async function requireTopAdminSession() {
  return requireRole(["top_admin"], { redirectTo: "/dashboard" });
}

export async function requireFinanceBudgetAccess() {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");
  if (!canAccessFinanceBudget(session.role)) redirect("/dashboard");
  return session;
}
