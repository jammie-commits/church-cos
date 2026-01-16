"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarVariant = "member" | "admin";

type DesktopSidebarMode = "fixed" | "hover";

export function Sidebar({
    variant = "member",
    desktopMode = "fixed",
    desktopOpen = true,
    onDesktopOpenChange,
    onNavigate,
}: {
    variant?: SidebarVariant;
    desktopMode?: DesktopSidebarMode;
    desktopOpen?: boolean;
    onDesktopOpenChange?: (open: boolean) => void;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();

    const memberItems = [
        { href: "/dashboard", icon: "home", label: "Home" },
        { href: "/finance", icon: "payments", label: "Finance" },
        { href: "/events", icon: "event", label: "Events" },
        { href: "/projects", icon: "business", label: "Projects" },
        { href: "/notifications", icon: "notifications", label: "Notifications" },
        { href: "/profile", icon: "person", label: "Profile" },
    ];

    const adminItems = [
        { href: "/admin", icon: "dashboard", label: "Overview" },
        { href: "/admin/members", icon: "groups", label: "Members" },
        { href: "/admin/finance", icon: "account_balance", label: "Finance" },
        { href: "/admin/events", icon: "event", label: "Events" },
        { href: "/admin/settings", icon: "settings", label: "Settings" },
    ];

    const navItems = variant === "admin" ? adminItems : memberItems;
    const mobileItems =
        variant === "admin"
            ? adminItems
            : [
                  { href: "/dashboard", icon: "home", label: "Home" },
                  { href: "/finance", icon: "payments", label: "Finance" },
                  { href: "/events", icon: "event", label: "Events" },
                  { href: "/projects", icon: "business", label: "Projects" },
                  { href: "/notifications", icon: "notifications", label: "Alerts" },
              ];
    const activeTextClass = "text-brand-lime";

    const desktopAsideClass =
        desktopMode === "hover"
            ? `transition-transform duration-200 ${desktopOpen ? "translate-x-0" : "-translate-x-full"} ${
                  desktopOpen ? "pointer-events-auto" : "pointer-events-none"
              }`
            : "";

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-black/80 backdrop-blur-xl z-50 ${desktopAsideClass}`}
                onMouseEnter={() => onDesktopOpenChange?.(true)}
                onMouseLeave={() => onDesktopOpenChange?.(false)}
            >
                <div className="flex flex-col w-full">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <Link href={variant === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3">
                            <div className="size-10 bg-gradient-to-br from-brand-purple to-brand-lime rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">church</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">JTW CMS</h1>
                                <p className="text-xs text-gray-400">{variant === "admin" ? "Admin Console" : "Members Portal"}</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {variant === "admin" ? "Administration" : "Navigation"}
                        </p>
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                const activeClass = "bg-brand-purple/35 text-white border-brand-lime";

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        className={`flex items-center gap-3 py-3 pr-3 pl-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15 border-l-4 ${
                                            isActive
                                                ? activeClass
                                                : "border-transparent text-gray-300/80 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Collapse Toggle */}
                    <div className="p-4 border-t border-white/10">
                        <Link
                            href="/auth/logout"
                            onClick={onNavigate}
                            className="mb-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Sign out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-black/80">
                <div className="flex items-center h-16 px-2 pb-[env(safe-area-inset-bottom)]" aria-label="Bottom navigation">
                    {mobileItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-label={item.label}
                                className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 px-1 transition-colors ${
                                    isActive ? activeTextClass : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${isActive ? "font-bold" : ""}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[10px] font-semibold leading-none whitespace-nowrap truncate max-w-full">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
