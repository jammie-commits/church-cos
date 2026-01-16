import { storage } from "@/server/storage";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { MonthlyGivingChart } from "@/components/analytics/monthly-giving-chart";
import { CategoryBreakdown } from "@/components/analytics/category-breakdown";
import { formatCurrency, groupTransactionsByCategory, groupTransactionsByMonth } from "@/server/analytics";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/server/session";

export default async function Finance() {
    const session = await getServerSession();
    if (!session) redirect("/auth/login");

    const transactions = await storage.getTransactions(session.userId);
    const totalGiving = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const formattedTotal = formatCurrency(totalGiving);

    const now = new Date();
    const thisMonthTotal = transactions
        .filter((tx) => {
            if (!tx.date) return false;
            const d = new Date(tx.date);
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const last12Months = groupTransactionsByMonth(transactions, { months: 12 });
    const monthlyAvg = last12Months.reduce((sum, m) => sum + m.total, 0) / Math.max(1, last12Months.length);
    const consistencyMonths = last12Months.filter((m) => m.total > 0).length;
    const monthlyChart = groupTransactionsByMonth(transactions, { months: 6 }).map((m) => ({ label: m.label, total: m.total }));
    const breakdown = groupTransactionsByCategory(transactions);

    return (
        <AppShell role="member">
            <TopBar title="Finance" showBack={false} showSearch={false} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                {/* Annual Giving Card */}
                <div className="relative rounded-2xl overflow-hidden mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/30 via-brand-purple/10 to-brand-lime/20"></div>
                    <div className="absolute inset-0 backdrop-blur-3xl bg-black/20"></div>
                    <div className="relative p-8">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-2">
                                    Annual Contribution
                                </p>
                                <h2 className="text-4xl font-bold tracking-tight">{formattedTotal}</h2>
                            </div>
                            <div className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-1">
                                <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
                                <span className="text-green-400 text-sm font-bold">+12.3%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                                    Monthly Avg
                                </p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(monthlyAvg)}
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                                    This Month
                                </p>
                                <p className="text-xl font-bold">{formatCurrency(thisMonthTotal)}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                                    Consistency
                                </p>
                                <p className="text-xl font-bold">{consistencyMonths} mos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold">Monthly Giving</h2>
                                <p className="text-sm text-gray-400 mt-0.5">Last 6 months</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="material-symbols-outlined text-[18px] text-brand-lime">analytics</span>
                                <span className="font-semibold">Trend</span>
                            </div>
                        </div>
                        <MonthlyGivingChart data={monthlyChart} />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold">By Category</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Where your giving goes</p>
                        </div>
                        <CategoryBreakdown items={breakdown} />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Link
                        href="/finance/give"
                        className="bg-gradient-to-br from-green-600/20 to-green-500/10 hover:from-green-600/30 hover:to-green-500/20 border border-green-500/20 rounded-2xl p-6 transition-all group"
                    >
                        <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-green-400 text-2xl">volunteer_activism</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Give Now</h3>
                        <p className="text-sm text-gray-400">Make a contribution</p>
                    </Link>

                    <Link
                        href="/finance/statements"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all group"
                    >
                        <div className="p-3 bg-white/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-gray-300 text-2xl">description</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Statements</h3>
                        <p className="text-sm text-gray-400">View giving history</p>
                    </Link>
                </div>

                {/* Transaction History */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold">Recent Activity</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Last {transactions.length} transactions</p>
                        </div>
                            <button className="text-brand-lime text-sm font-semibold hover:opacity-90">
                            View All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {transactions.slice(0, 6).map((tx, idx) => (
                            <div
                                key={tx.id}
                                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                            >
                                <div className="flex-shrink-0">
                                    <div className="size-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-400">payments</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm mb-1">{tx.purpose}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>
                                            {new Date(tx.date!).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span>•</span>
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded font-bold uppercase">
                                            {tx.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">${tx.amount}</p>
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
