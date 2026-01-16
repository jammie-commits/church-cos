import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            title: "Tithe Received",
            message: "Your monthly tithe of $200.00 has been processed successfully.",
            category: "Finance",
            categoryColor: "emerald",
            icon: "payments",
            time: "2m ago",
            unread: true,
        },
        {
            id: 2,
            title: "Prayer Request Update",
            message: "Pastor John has responded to your prayer request about family healing.",
            category: "Prayer",
            categoryColor: "purple",
            icon: "volunteer_activism",
            time: "1h ago",
            unread: true,
        },
        {
            id: 3,
            title: "Event Reminder",
            message: "Youth Conference starts tomorrow at 10:00 AM. Don't forget to bring your Bible!",
            category: "Events",
            categoryColor: "blue",
            icon: "event",
            time: "3h ago",
            unread: false,
        },
        {
            id: 4,
            title: "New Project: Cathedral Renovation",
            message: "We're raising $200,000 to renovate the cathedral roof. Your support matters!",
            category: "Projects",
            categoryColor: "orange",
            icon: "business",
            time: "5h ago",
            unread: false,
        },
    ];

    return (
        <AppShell role="member">
            <TopBar
                title="Notifications"
                showBack={true}
                showSearch={false}
                showNotifications={false}
                showProfile={false}
            />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Search Bar */}
                    <div className="px-4 py-3 md:px-6">
                        <div className="flex w-full items-center rounded-xl h-11 shadow-sm bg-white dark:bg-[#232f48] border border-gray-100 dark:border-none">
                            <div className="text-gray-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 px-4 pl-2 text-sm font-normal text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
                                placeholder="Search notifications"
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 px-4 pb-3 md:px-6 overflow-x-auto hide-scrollbar">
                        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary-premium px-5 shadow-md shadow-primary-premium/20">
                            <p className="text-white text-xs font-bold uppercase tracking-wider">All</p>
                        </button>
                        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#232f48] px-5 border border-gray-200 dark:border-none">
                            <p className="text-gray-600 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider">Unread</p>
                        </button>
                        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#232f48] px-5 border border-gray-200 dark:border-none">
                            <p className="text-gray-600 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider">Events</p>
                        </button>
                        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#232f48] px-5 border border-gray-200 dark:border-none">
                            <p className="text-gray-600 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider">Finance</p>
                        </button>
                    </div>

                    {/* Section Header */}
                    <div className="px-4 py-3 md:px-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Today</span>
                        <button className="text-[11px] font-bold text-primary-premium uppercase tracking-widest">Mark All Read</button>
                    </div>

                    {/* Notifications List */}
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex gap-3 px-4 py-4 md:px-6 justify-between border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a2233] transition-colors ${
                                    notification.unread ? "bg-white dark:bg-background-dark/50" : ""
                                }`}
                            >
                            <div className="w-2 flex items-center justify-center">
                                {notification.unread ? (
                                    <span className="size-2 rounded-full bg-primary-premium" aria-hidden="true" />
                                ) : (
                                    <span className="size-2" aria-hidden="true" />
                                )}
                            </div>
                            <div className="flex items-start gap-3 flex-1">
                                <div
                                    className={`flex items-center justify-center rounded-xl shrink-0 size-11 ${
                                        notification.categoryColor === "emerald"
                                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                            : notification.categoryColor === "purple"
                                            ? "bg-brand-purple/20 text-brand-lime"
                                            : notification.categoryColor === "blue"
                                            ? "bg-brand-purple/20 text-brand-lime"
                                            : "bg-brand-purple/20 text-brand-lime"
                                    }`}
                                >
                                    <span className="material-symbols-outlined">{notification.icon}</span>
                                </div>
                                <div className="flex flex-1 flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-gray-900 dark:text-white text-sm font-bold leading-normal">
                                            {notification.title}
                                        </p>
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                notification.categoryColor === "emerald"
                                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                                    : "bg-brand-purple/15 text-brand-lime"
                                            }`}
                                        >
                                            {notification.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-[#92a4c9] text-[13px] font-normal leading-snug line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end">
                                <p className="text-primary-premium text-[11px] font-bold">{notification.time}</p>
                            </div>
                            </div>
                        ))}
                    </div>

                    {/* Yesterday Section */}
                    <div className="px-4 py-3 md:px-6 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Yesterday</span>
                    </div>

                    <div className="flex gap-3 px-4 py-4 md:px-6 justify-between border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a2233]">
                        <div className="w-2 flex items-center justify-center">
                            <span className="size-2" aria-hidden="true" />
                        </div>
                        <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center justify-center rounded-xl bg-brand-purple/20 text-brand-lime shrink-0 size-11">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <p className="text-gray-900 dark:text-white text-sm font-bold leading-normal mb-1">New Member Welcome</p>
                                <p className="text-gray-600 dark:text-[#92a4c9] text-[13px] font-normal leading-snug line-clamp-2">
                                    Join us in welcoming 5 new members to our church family this Sunday!
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end">
                            <p className="text-gray-400 dark:text-gray-500 text-[11px] font-bold">1d ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
