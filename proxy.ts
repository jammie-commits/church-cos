import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionTokenEdge } from "@/server/auth-edge";

const PUBLIC_PATHS = new Set<string>(["/", "/auth/login", "/auth/register", "/auth/logout"]);
const PROFILE_COMPLETE_PATH = "/profile/complete";
const DEFAULT_APP_PATH = "/dashboard";

function isPublicPath(pathname: string) {
    return PUBLIC_PATHS.has(pathname);
}

function isStaticAsset(pathname: string) {
    if (pathname.startsWith("/_next")) return true;
    if (pathname === "/favicon.ico") return true;
    return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (isStaticAsset(pathname)) {
        return NextResponse.next();
    }

    // Next.js internal routes (used during builds/prerender) should never be gated.
    if (pathname.startsWith("/_")) {
        return NextResponse.next();
    }

    // Never gate API calls here.
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const token = req.cookies.get("jtw_session")?.value;
    const payload = token ? await verifySessionTokenEdge(token) : null;
    const authed = !!payload;
    const role = payload?.role ?? "member";

    // 1) Public routes always accessible
    if (isPublicPath(pathname)) {
        // If already authed, keep them out of auth screens
        if (authed && pathname.startsWith("/auth/") && pathname !== "/auth/logout") {
            const url = req.nextUrl.clone();
            url.pathname = DEFAULT_APP_PATH;
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // 2) Profile completion requires auth
    if (pathname === PROFILE_COMPLETE_PATH) {
        if (!authed) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth/login";
            url.searchParams.set("next", pathname);
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // 3) Everything else requires auth
    if (!authed) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    // 4) Admin gates (RBAC)
    // - Summary dashboard is Top Admin only
    if (pathname.startsWith("/admin/summary")) {
        if (role !== "top_admin") {
            const url = req.nextUrl.clone();
            url.pathname = DEFAULT_APP_PATH;
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // - Finance Budget page can be accessed by Admin / Top Admin / Finance
    if (pathname.startsWith("/admin/finance/budget")) {
        if (role !== "admin" && role !== "top_admin" && role !== "finance") {
            const url = req.nextUrl.clone();
            url.pathname = DEFAULT_APP_PATH;
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // - All other /admin routes require Admin or Top Admin
    if (pathname.startsWith("/admin")) {
        if (role !== "admin" && role !== "top_admin") {
            const url = req.nextUrl.clone();
            url.pathname = DEFAULT_APP_PATH;
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};
