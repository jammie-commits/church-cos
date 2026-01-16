import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { requireAdminSession } from "@/server/require-admin";

export default async function AdminEvents() {
    await requireAdminSession();

    const upcoming = [
        { title: "Sunday Morning Worship", date: "Sun • 9:00 AM", location: "Main Sanctuary" },
        { title: "Youth Service", date: "Sun • 3:00 PM", location: "Youth Hall" },
        { title: "Midweek Prayer", date: "Wed • 6:30 PM", location: "Prayer Room" },
    ];

    const stats = [
        { label: "Upcoming", value: String(upcoming.length), icon: "event" },
        { label: "Draft", value: "3", icon: "draft" },
        { label: "This Week", value: "2", icon: "date_range" },
    ];

    return (
        <AppShell role="admin">
            <TopBar title="Admin Events" showBack={true} showSearch={false} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-7xl mx-auto w-full">
                    <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-5">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-brand-lime">info</span>
                            <div>
                                <p className="text-sm font-extrabold text-gray-900 dark:text-white">Events Management</p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-[#92a4c9]">
                                    Next step is wiring events/services + attendance tracking. The UI below is the intended layout.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {stats.map((s) => (
                            <div key={s.label} className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">{s.label}</p>
                                    <span className="material-symbols-outlined text-gray-400 text-[18px]">{s.icon}</span>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Upcoming</h2>
                            <button className="inline-flex items-center gap-2 rounded-xl bg-primary-premium px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-primary-premium/20">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                New Event
                            </button>
                        </div>

                        <div className="mt-3 space-y-3">
                            {upcoming.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{item.title}</p>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-[#92a4c9]">
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                    {item.date}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    {item.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-brand-purple/20 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-lime">
                                                Draft
                                            </span>
                                            <button
                                                className="size-9 rounded-xl border border-gray-200 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 grid place-items-center"
                                                aria-label={`Open ${item.title}`}
                                                title="Open"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-gray-700 dark:text-white">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
