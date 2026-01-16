import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";

export default function MediaDashboard() {
    return (
        <AppShell role="member">
            <TopBar
                title="Media Team"
                showBack={false}
                showSearch={false}
                showNotifications={true}
                showProfile={true}
            />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Hero Stats Card */}
                    <div className="px-4 py-4 md:px-6 md:py-6">
                        <div className="bg-gradient-to-br from-primary-premium/80 to-brand-lime/30 rounded-2xl p-6 text-white shadow-lg border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider opacity-90">
                                        Media Department
                                    </p>
                                    <h2 className="text-2xl font-extrabold mt-1">Team Dashboard</h2>
                                </div>
                                <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">videocam</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                <div className="bg-white/10 rounded-xl p-3">
                                    <p className="text-xs text-white/80 font-bold uppercase mb-1">Events</p>
                                    <p className="text-2xl font-extrabold">24</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3">
                                    <p className="text-xs text-white/80 font-bold uppercase mb-1">Assets</p>
                                    <p className="text-2xl font-extrabold">156</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3">
                                    <p className="text-xs text-white/80 font-bold uppercase mb-1">Team</p>
                                    <p className="text-2xl font-extrabold">12</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 pb-4 md:px-6">
                        <h3 className="text-lg font-bold text-white mb-3">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 active:scale-95 transition-all">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-premium/15 text-brand-lime border border-brand-purple/30">
                                    <span className="material-symbols-outlined text-xl">cloud_upload</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold text-left">Upload Media</h4>
                                    <p className="mt-1 text-xs text-gray-400">Coming soon</p>
                                </div>
                            </button>
                            <button className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 active:scale-95 transition-all">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/15 text-green-300 border border-green-500/20">
                                    <span className="material-symbols-outlined text-xl">videocam</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold text-left">Start Stream</h4>
                                    <p className="mt-1 text-xs text-gray-400">Coming soon</p>
                                </div>
                            </button>
                            <Link
                                href="/media/inventory"
                                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 active:scale-95 transition-all"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-premium/15 text-brand-lime border border-brand-purple/30">
                                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold text-left">Equipment</h4>
                                    <p className="mt-1 text-xs text-gray-400">Inventory & usage</p>
                                </div>
                            </Link>
                            <Link
                                href="/events"
                                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 active:scale-95 transition-all"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-premium/15 text-brand-lime border border-brand-purple/30">
                                    <span className="material-symbols-outlined text-xl">event</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold text-left">Schedule</h4>
                                    <p className="mt-1 text-xs text-gray-400">Upcoming events</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Live Schedule */}
                    <div className="px-4 md:px-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-white">Today's Schedule</h3>
                            <Link href="/events" className="text-primary-premium text-sm font-bold">View All</Link>
                        </div>
                        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <div className="flex-shrink-0">
                                        <div className="size-10 rounded-full bg-red-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-sm">radio_button_checked</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Live Now</p>
                                        </div>
                                        <h4 className="text-gray-900 dark:text-white text-sm font-bold">Sunday Morning Worship</h4>
                                        <p className="text-gray-500 dark:text-[#92a4c9] text-xs">09:00 AM • Main Sanctuary</p>
                                    </div>
                                    <button className="text-red-500 font-bold text-xs px-3 py-1.5 bg-red-500/10 rounded-lg">Join</button>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex-shrink-0">
                                        <div className="size-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-600 dark:text-[#92a4c9] text-sm">schedule</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white text-sm font-bold">Youth Service</h4>
                                        <p className="text-gray-400 text-xs">03:00 PM • Youth Hall</p>
                                    </div>
                                    <span className="text-gray-400 text-xs font-bold">In 5h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="px-4 py-6 md:px-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-white">Active Team</h3>
                            <button className="text-primary-premium text-sm font-bold">Manage</button>
                        </div>
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="size-10 rounded-full bg-primary-premium border-2 border-background-dark flex items-center justify-center text-white font-bold text-xs"
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="size-10 rounded-full bg-white/10 border-2 border-background-dark flex items-center justify-center text-gray-300 font-bold text-xs">
                                +7
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
