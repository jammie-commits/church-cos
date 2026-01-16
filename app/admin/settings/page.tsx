import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { requireAdminSession } from "@/server/require-admin";

export default async function AdminSettings() {
    await requireAdminSession();

    const cards = [
        {
            title: "Church Profile",
            description: "Update branding and contact information.",
            icon: "domain",
            primaryLabel: "Edit",
            primary: true,
        },
        {
            title: "Access Control",
            description: "Configure roles, departments, and admin permissions.",
            icon: "admin_panel_settings",
            primaryLabel: "Manage",
        },
        {
            title: "Audit Logs",
            description: "Track admin actions across members, finance, and events.",
            icon: "receipt_long",
            primaryLabel: "View Logs",
        },
    ];

    return (
        <AppShell role="admin">
            <TopBar title="Admin Settings" showBack={true} showSearch={false} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="px-4 py-4 md:px-6 md:py-6 space-y-3 max-w-7xl mx-auto w-full">
                    {cards.map((card) => (
                        <div key={card.title} className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-5">
                            <div className="flex items-start gap-3">
                                <div className="size-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 grid place-items-center">
                                    <span className="material-symbols-outlined text-[20px] text-primary-premium">{card.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{card.title}</h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-[#92a4c9]">{card.description}</p>

                                    <button
                                        className={
                                            card.primary
                                                ? "mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-premium px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-primary-premium/20"
                                                : "mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 text-sm font-extrabold text-gray-900 dark:text-white"
                                        }
                                    >
                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                        {card.primaryLabel}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
