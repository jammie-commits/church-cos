import { storage } from "@/server/storage";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";

export default async function Projects() {
    const projects = await storage.getProjects();

    const activeCount = projects.filter((p) => p.status === "Active").length;
    const upcomingCount = projects.filter((p) => p.status === "Upcoming").length;

    return (
        <AppShell role="member">
            <TopBar title="Projects" showBack={false} showSearch={false} showNotifications={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-brand-purple/20 to-brand-purple/10 border border-brand-purple/20 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-brand-purple/20 rounded-lg">
                                <span className="material-symbols-outlined text-brand-lime">trending_up</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Active</p>
                        <p className="text-2xl font-bold">{activeCount}</p>
                        <p className="text-xs text-gray-500 mt-2">In progress right now</p>
                    </div>

                    <div className="bg-gradient-to-br from-brand-purple/20 to-brand-purple/10 border border-brand-purple/20 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-brand-purple/20 rounded-lg">
                                <span className="material-symbols-outlined text-brand-lime">business</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">All Projects</p>
                        <p className="text-2xl font-bold">{projects.length}</p>
                        <p className="text-xs text-gray-500 mt-2">{upcomingCount} upcoming</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
                    <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm font-medium whitespace-nowrap">
                        All Projects
                    </button>
                    <button className="px-4 py-2 hover:bg-white/5 border border-white/5 rounded-lg text-sm font-medium text-gray-400 whitespace-nowrap">
                        Active
                    </button>
                    <button className="px-4 py-2 hover:bg-white/5 border border-white/5 rounded-lg text-sm font-medium text-gray-400 whitespace-nowrap">
                        Completed
                    </button>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    {projects.map((project) => {
                        const collected = Number(project.collectedAmount ?? 0);
                        const target = Number(project.targetAmount ?? 0);
                        const progress = target > 0 ? (collected / target) * 100 : 0;
                        
                        return (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-brand-purple/20 text-brand-lime text-[10px] font-bold uppercase tracking-wider rounded">
                                                Infrastructure
                                            </span>
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded">
                                                {project.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                                        <p className="text-sm text-gray-400">{project.description || "Building for our community"}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors ml-4">
                                        arrow_forward
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-brand-lime">{Math.round(progress)}% Complete</span>
                                            <span className="text-xs text-gray-500">{target > 0 ? "Target set" : "No target"}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-brand-purple to-brand-lime rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="size-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-lime border-2 border-black flex items-center justify-center text-xs font-bold text-black"
                                                >
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                            ))}
                                            <div className="size-8 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-xs font-semibold text-gray-400">
                                                +{Math.floor(Math.random() * 20)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-brand-lime text-sm font-semibold">
                                            <span>View Details</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            </div>
        </AppShell>
    );
}
