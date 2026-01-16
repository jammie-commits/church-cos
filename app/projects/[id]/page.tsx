import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";

export default function ProjectDetails() {
    return (
        <AppShell role="member">
            <TopBar title="Project Details" showBack={true} showSearch={false} showNotifications={false} showProfile={false} />

            <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Project Header Info */}
                    <div className="flex flex-col p-4 mt-2">
                        <div className="flex justify-between items-start mb-1">
                            <span className="bg-brand-purple/15 dark:bg-primary-premium/20 text-primary-premium text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">In Progress</span>
                            <p className="text-gray-500 dark:text-[#92a4c9] text-xs font-medium">Updated 2h ago</p>
                        </div>
                        <h1 className="text-gray-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">Cathedral Roof Renovation</h1>
                        <p className="text-gray-500 dark:text-[#92a4c9] text-sm font-normal mt-1 leading-relaxed">Structural repairs and solar panel installation for the main sanctuary.</p>
                    </div>

                    {/* Funding Card */}
                    <div className="p-4 pt-0">
                        <div className="bg-white dark:bg-[#232f48] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-none">
                            <div className="flex justify-between items-end mb-4">
                                <div className="flex flex-col">
                                    <p className="text-gray-500 dark:text-[#92a4c9] text-sm font-medium">Project Progress</p>
                                    <p className="text-gray-900 dark:text-white text-3xl font-black tracking-tight leading-none">71%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 dark:text-[#92a4c9] text-[11px] font-bold uppercase">Status</p>
                                    <p className="text-gray-700 dark:text-white text-base font-bold">In Progress</p>
                                </div>
                            </div>
                            <div className="relative w-full h-3 bg-gray-100 dark:bg-background-dark/50 rounded-full overflow-hidden mb-2">
                                <div className="absolute top-0 left-0 h-full bg-primary-premium rounded-full" style={{ width: "71%" }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-primary-premium text-sm font-bold">71% Complete</p>
                                <p className="text-gray-500 dark:text-[#92a4c9] text-xs">Keep supporting the work</p>
                            </div>
                            <button className="w-full mt-6 bg-primary-premium text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-premium/30 active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined text-xl">volunteer_activism</span>
                                Support This Project
                            </button>
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">Top Contributors</h2>
                            <button className="text-primary-premium text-sm font-semibold">View All</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a2233] rounded-xl border border-gray-100 dark:border-none shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv9hQNYhfUMEM9W3WfvHCEht1g3-RyfwXaB-X0IL8V89oPFCT8RUGXt748EUsS2YTUj0yHP1depni01r4LXVd-PlOqCidlNurvZgrewRUnBjL6dkLtSF5nTXm0JCaVYuXYqDu-NU4bu4OgkOQRhDu3VcnZXASvrJQ0R5F8T5fuzqZXm4eZqwvNn3DYONJbfhnJHuDsv5AQw665J0DAuMNJpjY3aD5nEUFiDioDZeVld6vy5DnZJADVuGAXl5nKK_qMVrNbOFOQKyo')" }}></div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">The Sterling Family</p>
                                        <p className="text-[11px] text-gray-500 dark:text-[#92a4c9]">Platinum Partner</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Partner</p>
                                    <p className="text-[10px] text-[#0bda5e] font-bold uppercase">Supporter</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Timeline */}
                    <div className="px-4 py-6">
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-6">Project Timeline</h2>
                        <div className="relative ml-3 border-l-2 border-gray-100 dark:border-white/10 flex flex-col gap-8">
                            <div className="relative pl-8">
                                <div className="absolute -left-[11px] top-0 size-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">Phase 1 Complete</span>
                                    <h4 className="text-gray-900 dark:text-white font-bold text-base">Architectural Planning</h4>
                                    <p className="text-gray-500 dark:text-[#92a4c9] text-xs mt-1">Design approved by city council and church board.</p>
                                    <span className="text-[10px] text-gray-400 mt-2 italic font-medium">Aug 12, 2023</span>
                                </div>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute -left-[11px] top-0 size-5 rounded-full bg-primary-premium ring-4 ring-primary-premium/20 flex items-center justify-center">
                                    <div className="size-2 bg-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-primary-premium uppercase tracking-wide">Active Phase</span>
                                    <h4 className="text-gray-900 dark:text-white font-bold text-base">Funding Drive</h4>
                                    <p className="text-gray-500 dark:text-[#92a4c9] text-xs mt-1">Working toward the next construction milestone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
