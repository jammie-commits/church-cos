import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";

export default function ProfilePage() {
    return (
        <AppShell role="member">
                <TopBar title="Profile" showBack={true} showSearch={false} showNotifications={false} showProfile={false} />

                <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                    <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-7xl mx-auto w-full">
                        <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="size-14 rounded-full bg-cover bg-center border-2 border-primary-premium/20"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoh0ayAFZGJBCSapVPYT74wt8kvZmSSDQvZntmy687W6an8b6rnuuI5ia0_YztHsqfKVTlKU93UyGrWIMie2uyKovR_bhoyOHQSz7dKayWf2oPtn9XjNTp_9hO7hMCfzjZNMY_68uA-1-Yvv60k5KCz-Pg1lYUI1lYXJzS2R4OHM1bw-J9zbuRtMhBqvlj-gDPMRok7cyksUfPvatiJBdvA7TZSZ2a-nZzR713ajSAEB6f43mAOnpup9-c1q2SbiJLSS8ysz2matM")',
                                    }}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white truncate">Member Profile</p>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-green-700 dark:text-green-300">
                                            <span className="material-symbols-outlined text-[14px]">verified</span>
                                            Active
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Update your details and church information.</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/30 p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-brand-lime text-[18px]">badge</span>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Member ID</p>
                                    </div>
                                    <p className="mt-2 text-sm font-extrabold text-gray-900 dark:text-white">—</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/30 p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-brand-lime text-[18px]">groups</span>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Department</p>
                                    </div>
                                    <p className="mt-2 text-sm font-extrabold text-gray-900 dark:text-white">—</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/profile/complete"
                                    className="flex-1 rounded-xl bg-primary-premium hover:brightness-110 px-4 py-3 text-center text-sm font-extrabold text-white shadow-lg shadow-primary-premium/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-3 text-center text-sm font-extrabold text-gray-900 dark:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">home</span>
                                    Dashboard
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-brand-lime">security</span>
                                <div>
                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">Security</p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Account security features will live here (password reset, sessions, 2FA).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </AppShell>
    );
}
