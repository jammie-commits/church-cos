import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";

export default async function EventDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventId = Number(id);
    const event = Number.isFinite(eventId) ? await storage.getEvent(eventId) : undefined;

    return (
        <AppShell role="member">
            <TopBar title="Event" showBack={true} showSearch={false} showNotifications={false} showProfile={false} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                    {!event ? (
                        <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-400">error</span>
                                <div>
                                    <h1 className="text-lg font-extrabold text-white">Event not found</h1>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">This event may have been removed or is unavailable.</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Link
                                    href="/events"
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-purple hover:brightness-110 px-4 py-3 text-sm font-extrabold text-white transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Back to Events
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5">
                                <div className="relative p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-[11px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-gray-200">
                                                    {event.type}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-[11px] font-extrabold uppercase tracking-widest text-brand-purple">
                                                    Upcoming
                                                </span>
                                            </div>
                                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">{event.title}</h1>
                                            <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
                                                {event.description || "Join us for this gathering."}
                                            </p>
                                        </div>
                                        <div className="size-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-brand-purple">event</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">Date</p>
                                            <p className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                                                {new Date(event.date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">Time</p>
                                            <p className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                                                {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">Location</p>
                                            <p className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">{event.location || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            aria-label="Register"
                                            title="Register"
                                            className="flex-1 rounded-xl bg-white text-black hover:bg-gray-100 px-4 py-3 text-sm font-extrabold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                                            Register
                                        </button>
                                        <Link
                                            href="/events"
                                            className="flex-1 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 px-4 py-3 text-sm font-extrabold text-slate-900 dark:text-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                            All Events
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-lime">info</span>
                                    <div>
                                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Attendance (coming soon)</h2>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                                            Next step is wiring check-in, attendance lists, and reminders.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
