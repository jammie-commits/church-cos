import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";
import { formatCurrency, groupTransactionsByMonth } from "@/server/analytics";
import { MonthlyGivingChart } from "@/components/analytics/monthly-giving-chart";
import { redirect } from "next/navigation";
import { getServerSession } from "@/server/session";

export default async function Statements() {
    const session = await getServerSession();
    if (!session) redirect("/auth/login");

    const transactions = await storage.getTransactions(session.userId);
    const total = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const monthly = groupTransactionsByMonth(transactions, { months: 6 }).map((m) => ({ label: m.label, total: m.total }));

    return (
        <AppShell role="member">
            <TopBar title="Statements" showBack={true} showSearch={false} showNotifications={false} showProfile={false} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-7xl mx-auto w-full">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-white">Giving Statements</h1>
                                <p className="mt-1 text-sm text-gray-400">Download and review your giving history.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/finance/give"
                                    className="rounded-xl bg-brand-purple hover:brightness-110 px-4 py-2 text-sm font-extrabold text-white transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Give
                                </Link>
                                <button
                                    type="button"
                                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-extrabold text-white transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Giving</p>
                                <p className="mt-2 text-2xl font-extrabold text-white">{formatCurrency(total)}</p>
                                <p className="mt-1 text-xs text-gray-500">Across {transactions.length} transactions</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Last 6 Months</p>
                                <p className="mt-2 text-2xl font-extrabold text-white">{formatCurrency(monthly.reduce((s, m) => s + m.total, 0))}</p>
                                <p className="mt-1 text-xs text-gray-500">Trend view</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Receipts</p>
                                <p className="mt-2 text-2xl font-extrabold text-white">{transactions.length}</p>
                                <p className="mt-1 text-xs text-gray-500">Download support (coming soon)</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-white">Monthly Summary</h2>
                                <p className="mt-0.5 text-sm text-gray-400">Last 6 months</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="material-symbols-outlined text-[18px] text-brand-lime">bar_chart</span>
                                <span className="font-semibold">Totals</span>
                            </div>
                        </div>
                        <MonthlyGivingChart data={monthly} />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                                <p className="mt-0.5 text-sm text-gray-400">Most recent activity</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {transactions.slice(0, 10).map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 p-4"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="size-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-green-400">payments</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{tx.purpose || tx.category}</p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {tx.category} • {tx.type} • {tx.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-white">{formatCurrency(Number(tx.amount))}</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {tx.date ? new Date(tx.date).toLocaleDateString() : "—"}
                                        </p>
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
