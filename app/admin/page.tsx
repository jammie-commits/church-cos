import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { requireAdminSession } from "@/server/require-admin";

export default async function AdminOverview() {
    await requireAdminSession();

    const quickLinks = [
        {
            href: "/admin/members",
            icon: "groups",
            title: "Members",
            description: "Directory, roles, and departments",
            accent: "text-brand-lime",
            bg: "bg-brand-purple/20",
        },
        {
            href: "/admin/finance",
            icon: "account_balance",
            title: "Finance",
            description: "Giving, budgets, and reports",
            accent: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            href: "/admin/events",
            icon: "event",
            title: "Events",
            description: "Services, attendance, scheduling",
            accent: "text-brand-lime",
            bg: "bg-brand-purple/20",
        },
        {
            href: "/admin/settings",
            icon: "settings",
            title: "Settings",
            description: "Church profile and access control",
            accent: "text-brand-lime",
            bg: "bg-brand-purple/20",
        },
    ];

    return (
        <AppShell role="admin">
            <TopBar title="Admin Overview" showBack={false} showSearch={false} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="p-4">
                        <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">Jesus The Way Ministry</p>
                            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Admin Console</h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">Manage members, giving, events, and settings.</p>
                        </div>
                    </div>

                    <div className="px-4 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Links</h2>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {quickLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#232f48] p-5 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#1a2233]"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex size-12 items-center justify-center rounded-xl ${item.bg} ${item.accent}`}>
                                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{item.title}</p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-[#92a4c9]">{item.description}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400 transition-transform group-hover:translate-x-0.5">
                                            chevron_right
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="px-4">
                        <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#232f48] p-5 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Next</p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-[#92a4c9]">
                                Coming next: real RBAC enforcement + audit logs + notifications inbox.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
