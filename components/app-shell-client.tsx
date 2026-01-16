"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import type { AppRole } from "@/components/app-shell";

export function AppShellClient({
    role,
    children,
}: {
    role: AppRole;
    children: ReactNode;
}) {
    const pathname = usePathname();
    const [desktopNavOpen, setDesktopNavOpen] = useState(false);

    useEffect(() => {
        setDesktopNavOpen(false);
    }, [pathname]);

    return (
        <div className="relative min-h-screen w-full bg-background-light dark:bg-background-dark overflow-x-hidden">
            {/* Hover trigger: move cursor to the left edge to reveal the sidebar */}
            <div
                className="hidden md:block fixed inset-y-0 left-0 z-40 w-3"
                onMouseEnter={() => setDesktopNavOpen(true)}
                aria-hidden="true"
            />

            <Sidebar
                variant={role}
                desktopMode="hover"
                desktopOpen={desktopNavOpen}
                onDesktopOpenChange={setDesktopNavOpen}
                onNavigate={() => setDesktopNavOpen(false)}
            />

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">{children}</div>
        </div>
    );
}
