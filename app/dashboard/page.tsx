import { storage } from "@/server/storage";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { MonthlyGivingChart } from "@/components/analytics/monthly-giving-chart";
import { CategoryBreakdown } from "@/components/analytics/category-breakdown";
import { formatCurrency, groupTransactionsByCategory, groupTransactionsByMonth } from "@/server/analytics";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/server/session";

export default async function Dashboard() {
    const session = await getServerSession();
    if (!session) redirect("/auth/login");

    const groupIds = await storage.getUserDepartments(session.userId);
    const departments = await storage.getDepartments();
    const myGroups = departments
        .filter((d) => groupIds.includes(d.id))
        .map((d) => d.name)
        .sort((a, b) => a.localeCompare(b));
    const projects = await storage.getProjects();
    const events = await storage.getEvents();
    const transactions = await storage.getTransactions(session.userId);

    const totalGiving = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const lastMonthGiving = totalGiving * 0.88;
    const givingGrowth = lastMonthGiving > 0 ? (((totalGiving - lastMonthGiving) / lastMonthGiving) * 100).toFixed(1) : "0.0";
    const formattedGiving = formatCurrency(totalGiving);
    const activeProjects = projects.filter(p => p.status === "Active");
    const avgAttendance = 87;

    const monthlyGiving = groupTransactionsByMonth(transactions, { months: 6 }).map((m) => ({
        label: m.label,
        total: m.total,
    }));
    const givingByCategory = groupTransactionsByCategory(transactions);

    return (
        <AppShell role="member">
            <TopBar title="Dashboard" showBack={false} showSearch={false} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-brand-purple/10 rounded-lg">
                                <span className="material-symbols-outlined text-brand-purple text-xl">payments</span>
                            </div>
                            <div className="px-2 py-1 bg-emerald-50 dark:bg-green-500/20 rounded-full flex items-center gap-1 border border-emerald-200/60 dark:border-transparent">
                                <span className="text-emerald-700 dark:text-green-400 text-xs font-bold">↑{givingGrowth}%</span>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">My Giving</p>
                        <p className="text-2xl font-bold mb-1">{formattedGiving}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">YTD Performance</p>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-brand-purple/10 rounded-lg">
                                <span className="material-symbols-outlined text-brand-purple text-xl">groups</span>
                            </div>
                            <div className="px-2 py-1 bg-brand-purple/10 rounded-full flex items-center gap-1 border border-brand-purple/15">
                                <span className="text-brand-purple text-xs font-bold">Joined</span>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">My Groups</p>
                        <p className="text-2xl font-bold mb-1">{groupIds.length}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">Departments joined</p>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-brand-lime/10 rounded-lg">
                                <span className="material-symbols-outlined text-brand-lime text-xl">event</span>
                            </div>
                            <div className="px-2 py-1 bg-brand-lime/10 rounded-full border border-brand-lime/15">
                                <span className="text-brand-lime text-xs font-bold">{avgAttendance}%</span>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Events</p>
                        <p className="text-2xl font-bold mb-1">{events.length}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">Upcoming activities</p>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-brand-lime/10 rounded-lg">
                                <span className="material-symbols-outlined text-brand-lime text-xl">business</span>
                            </div>
                            <div className="px-2 py-1 bg-brand-lime/10 rounded-full border border-brand-lime/15">
                                <span className="text-brand-lime text-xs font-bold">Active</span>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Projects</p>
                        <p className="text-2xl font-bold mb-1">{activeProjects.length}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">In progress</p>
                    </div>
                </div>

                {/* Giving Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold">Giving Trend</h2>
                                <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Last 6 months</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
                                <span className="material-symbols-outlined text-[18px] text-brand-purple">bar_chart</span>
                                <span className="font-semibold">Monthly totals</span>
                            </div>
                        </div>
                        <MonthlyGivingChart data={monthlyGiving} />
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold">Breakdown</h2>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">By category</p>
                        </div>
                        <CategoryBreakdown items={givingByCategory} />
                    </div>
                </div>

                {/* Activity Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Events Timeline */}
                    <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold">Upcoming Events</h2>
                                <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Next 7 days</p>
                            </div>
                            <Link href="/events" className="px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/15 border border-brand-purple/20 rounded-lg text-sm font-medium text-brand-purple transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {events.slice(0, 4).map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all group dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-brand-purple/10 rounded-xl flex flex-col items-center justify-center border border-brand-purple/15">
                                            <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                                                {new Date(event.date).toLocaleString("en", { month: "short" })}
                                            </span>
                                            <span className="text-xl font-bold">
                                                {new Date(event.date).getDate()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1 truncate">{event.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">schedule</span>
                                                {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">location_on</span>
                                                {event.location}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-brand-purple transition-colors dark:text-gray-500 dark:group-hover:text-brand-lime">arrow_forward</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <Link href="/finance" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group dark:bg-white/5 dark:hover:bg-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <span className="material-symbols-outlined text-green-400 text-xl">volunteer_activism</span>
                                    </div>
                                    <span className="font-medium text-sm">Give</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 group-hover:text-brand-purple transition-colors dark:text-gray-500 dark:group-hover:text-white">arrow_forward</span>
                            </Link>
                            <Link href="/projects" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group dark:bg-white/5 dark:hover:bg-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-purple/20 rounded-lg">
                                        <span className="material-symbols-outlined text-brand-lime text-xl">business</span>
                                    </div>
                                    <span className="font-medium text-sm">Projects</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 group-hover:text-brand-purple transition-colors dark:text-gray-500 dark:group-hover:text-white">arrow_forward</span>
                            </Link>
                            <Link href="/media/dashboard" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group dark:bg-white/5 dark:hover:bg-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-purple/20 rounded-lg">
                                        <span className="material-symbols-outlined text-brand-lime text-xl">videocam</span>
                                    </div>
                                    <span className="font-medium text-sm">Media</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 group-hover:text-brand-purple transition-colors dark:text-gray-500 dark:group-hover:text-white">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* My Groups */}
                <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold">My Groups</h2>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Departments you’ve joined</p>
                        </div>
                        <Link
                            href="/profile/complete"
                            className="px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/15 border border-brand-purple/20 rounded-lg text-sm font-medium text-brand-purple transition-colors"
                        >
                            Update
                        </Link>
                    </div>

                    {myGroups.length === 0 ? (
                        <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 text-sm text-slate-600 dark:text-gray-400">
                            You haven’t joined any departments yet. Add your groups in Profile.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {myGroups.map((name) => (
                                <span
                                    key={name}
                                    className="inline-flex items-center rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3 py-1 text-xs font-bold text-brand-purple"
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Projects Overview */}
                <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold">Active Projects</h2>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">Funding progress</p>
                        </div>
                        <Link href="/projects" className="px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/15 border border-brand-purple/20 rounded-lg text-sm font-medium text-brand-purple transition-colors">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {projects.slice(0, 3).map((project) => {
                            const collected = Number(project.collectedAmount ?? 0);
                            const target = Number(project.targetAmount ?? 0);
                            const progress = target > 0 ? (collected / target) * 100 : 0;
                            return (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block p-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 rounded-xl transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">{project.name}</h3>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">Infrastructure</p>
                                        </div>
                                        <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple text-xs font-bold rounded border border-brand-purple/15">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-slate-200/70 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-purple rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600 dark:text-gray-400">
                                            <span>Progress</span>
                                            <span>{target > 0 ? "Target set" : "No target"}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            </div>
        </AppShell>
    );
}
