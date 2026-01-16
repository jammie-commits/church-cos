import { redirect } from "next/navigation";

import { getServerSession } from "@/server/session";

export async function requireAdminSession() {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}
