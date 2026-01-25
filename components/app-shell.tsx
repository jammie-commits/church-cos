import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AppShellClient } from "@/components/app-shell-client";
import { verifySessionToken } from "@/server/auth";

export type AppRole = "member" | "admin" | "top_admin" | "finance";

async function resolveRole(explicitRole?: AppRole): Promise<AppRole> {
    const cookieStore = await cookies();
    const token = cookieStore.get("jtw_session")?.value;
    const payload = token ? verifySessionToken(token) : null;
    const sessionRole: AppRole = (payload?.role as AppRole) ?? "member";

    // Never allow a page to elevate role beyond the session.
    // A page can request a LOWER role (e.g., render member shell), but never higher.
    if (!explicitRole) return sessionRole;
    if (explicitRole === sessionRole) return sessionRole;
    // Always render the Top Admin shell for top_admin sessions so Summary + full nav stays accessible.
    if (sessionRole === "top_admin") return "top_admin";
    if (sessionRole === "admin" && (explicitRole === "member" || explicitRole === "admin")) return explicitRole;
    if (sessionRole === "finance" && (explicitRole === "member" || explicitRole === "finance")) return explicitRole;
    return "member";
}

export async function AppShell({
    role,
    children,
}: {
    role?: AppRole;
    children: ReactNode;
}) {
    const resolvedRole = await resolveRole(role);

    return <AppShellClient role={resolvedRole}>{children}</AppShellClient>;
}
