import { storage } from "@/server/storage";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Events() {
    const events = await storage.getEvents();

    return (
        <AppShell role="member">
            <TopBar title="Events" showBack={false} showSearch={true} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
                    <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm font-medium whitespace-nowrap">
                        All Events
                    </button>
                    <button className="px-4 py-2 hover:bg-white/5 border border-white/5 rounded-lg text-sm font-medium text-gray-400 whitespace-nowrap">
                        Services
                    </button>
                    <button className="px-4 py-2 hover:bg-white/5 border border-white/5 rounded-lg text-sm font-medium text-gray-400 whitespace-nowrap">
                        Conferences
                    </button>
                    <button className="px-4 py-2 hover:bg-white/5 border border-white/5 rounded-lg text-sm font-medium text-gray-400 whitespace-nowrap">
                        Past
                    </button>
                </div>

                {/* Featured Event */}
                {events.length > 0 && (
                    <div className="mb-6">
                        <Link
                            href={`/events/${events[0].id}`}
                            className="block relative rounded-2xl overflow-hidden group border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5"
                        >
                            <div className="aspect-[16/9] bg-brand-purple/10 dark:bg-brand-purple/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-8xl text-brand-purple/30 dark:text-white/20">event</span>
                            </div>
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Featured
                                    </span>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
                                        {events[0].type || "Event"}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">{events[0].title}</h2>
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-gray-300 mb-4">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        {new Date(events[0].date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        {new Date(events[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {events[0].location}
                                    </span>
                                </div>
                                <button className="px-6 py-3 bg-brand-purple text-white rounded-xl font-bold hover:bg-brand-purple/90 transition-all">
                                    Register Now
                                </button>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Events Grid */}
                <div className="space-y-4">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="block bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden transition-all group"
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-brand-purple/10 rounded-xl flex flex-col items-center justify-center border border-brand-purple/15">
                                            <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                                                {new Date(event.date).toLocaleString("en", { month: "short" })}
                                            </span>
                                            <span className="text-2xl font-bold">
                                                {new Date(event.date).getDate()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider rounded">
                                                {event.type || "Event"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-brand-purple transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-gray-400">
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

                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-brand-purple dark:text-gray-500 dark:group-hover:text-brand-lime transition-colors">
                                        arrow_forward
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            </div>
        </AppShell>
    );
}
