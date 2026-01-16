import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AppShellClient } from "@/components/app-shell-client";
import { verifySessionToken } from "@/server/auth";

export type AppRole = "admin" | "member";

async function resolveRole(explicitRole?: AppRole): Promise<AppRole> {
    const cookieStore = await cookies();
    const token = cookieStore.get("jtw_session")?.value;
    const payload = token ? verifySessionToken(token) : null;
    const sessionRole: AppRole = payload?.role === "admin" ? "admin" : "member";

    // Never allow a page to elevate role beyond the session.
    if (explicitRole === "admin") return sessionRole;
    return sessionRole;
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
