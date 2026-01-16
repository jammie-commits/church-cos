import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";
import { MonthlyGivingChart } from "@/components/analytics/monthly-giving-chart";
import { CategoryBreakdown } from "@/components/analytics/category-breakdown";
import { formatCurrency, groupTransactionsByCategory, groupTransactionsByMonth } from "@/server/analytics";
import { requireAdminSession } from "@/server/require-admin";

export default async function AdminFinance() {
    await requireAdminSession();

    const transactions = await storage.getTransactions();
    const totalGiving = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const monthly = groupTransactionsByMonth(transactions, { months: 6 }).map((m) => ({ label: m.label, total: m.total }));
    const byCategory = groupTransactionsByCategory(transactions);

    const now = new Date();
    const thisMonthTotal = transactions
        .filter((tx) => {
            if (!tx.date) return false;
            const d = new Date(tx.date);
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const completedCount = transactions.filter((t) => t.status === "Completed").length;
    const pendingCount = transactions.filter((t) => t.status === "Pending").length;

    return (
        <AppShell role="admin">
            <TopBar
                title="Finance Overview"
                showBack={true}
                showSearch={false}
                showNotifications={true}
                showProfile={true}
            />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    {/* KPI Cards */}
                    <section className="p-4">
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                            <div className="flex min-w-[260px] snap-center flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Giving (This Month)</p>
                                    <span className="material-symbols-outlined text-primary-premium">account_balance_wallet</span>
                                </div>
                                <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold font-display">{formatCurrency(thisMonthTotal)}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">All categories • All payment types</p>
                            </div>

                            <div className="flex min-w-[260px] snap-center flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Giving (All Time)</p>
                                    <span className="material-symbols-outlined text-primary-premium">payments</span>
                                </div>
                                <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold font-display">{formatCurrency(totalGiving)}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Across {transactions.length} transactions</p>
                            </div>

                            <div className="flex min-w-[260px] snap-center flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Status</p>
                                    <span className="material-symbols-outlined text-primary-premium">verified</span>
                                </div>
                                <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold font-display">{completedCount}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Completed • {pendingCount} pending</p>
                            </div>
                        </div>
                    </section>

                    {/* Analytics */}
                    <section className="px-4 py-2">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Monthly Giving</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Last 6 months</p>
                                <MonthlyGivingChart data={monthly} />
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Category Breakdown</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Top categories</p>
                                <CategoryBreakdown items={byCategory} />
                            </div>
                        </div>
                    </section>

                    {/* Transactions */}
                    <section className="px-4 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recent Transactions</h3>
                            <button className="text-primary-premium text-sm font-semibold">See All</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 flex items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                                        <span className="material-symbols-outlined">smartphone</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">James K. Mwangi</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Tithe • MPESA • 10:45 AM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">+$1,200.00</p>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 font-bold uppercase">Verified</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppShell>
    );
}
