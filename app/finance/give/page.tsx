import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";

export default function GiveNow() {
    return (
        <AppShell role="member">
            <TopBar title="Give" showBack={true} showSearch={false} showNotifications={false} showProfile={false} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                    <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Make a Contribution</h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Tithe, offering, project support, and more.</p>
                            </div>
                            <div className="size-12 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-400">volunteer_activism</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Amount</label>
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 px-4 py-3">
                                        <span className="text-gray-500 dark:text-gray-400 font-bold">$</span>
                                        <input
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category</label>
                                    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 px-4 py-3">
                                        <select className="w-full bg-transparent outline-none text-gray-900 dark:text-white">
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="Tithe">Tithe</option>
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="Offering">Offering</option>
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="Project">Project</option>
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="Seed">Seed</option>
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="Thanksgiving">Thanksgiving</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Method</label>
                                    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 px-4 py-3">
                                        <select className="w-full bg-transparent outline-none text-gray-900 dark:text-white">
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="MPESA">MPESA</option>
                                            <option className="bg-white text-gray-900 dark:bg-black dark:text-white" value="Bank">Bank</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Reference (optional)</label>
                                    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 px-4 py-3">
                                        <input
                                            placeholder="MPESA code / Bank ref"
                                            className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Note (optional)</label>
                                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 px-4 py-3">
                                    <input
                                        placeholder="e.g., Offering for Sunday service"
                                        className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    className="flex-1 rounded-xl bg-brand-purple hover:brightness-110 px-4 py-3 text-sm font-extrabold text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Continue
                                </button>
                                <Link
                                    href="/finance/statements"
                                    className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-3 text-sm font-extrabold text-gray-900 dark:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                    View Statements
                                </Link>
                            </div>

                            <div className="mt-2 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-lime">info</span>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Payments are currently a prototype UI flow. Next step is wiring MPESA STK + bank confirmations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
