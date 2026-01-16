import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";

export default function MediaInventory() {
    return (
        <AppShell role="member">
            <TopBar
                title="Media Inventory"
                showBack={true}
                showSearch={false}
                showNotifications={false}
                showProfile={false}
            />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                    {/* Segmented Buttons */}
                    <div className="flex">
                        <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-white/5 border border-white/10 p-1">
                            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-black/30 has-[:checked]:shadow-sm has-[:checked]:text-brand-lime text-gray-400 text-sm font-bold transition-all">
                                <span className="truncate">Inventory</span>
                                <input defaultChecked className="hidden" name="tab-group" type="radio" value="Inventory" />
                            </label>
                            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-black/30 has-[:checked]:shadow-sm has-[:checked]:text-brand-lime text-gray-400 text-sm font-bold transition-all">
                                <span className="truncate">Active Use</span>
                                <input className="hidden" name="tab-group" type="radio" value="Active" />
                            </label>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-3">
                        <div className="flex w-full h-12 items-center rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-gray-400">search</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 px-4 pl-2 text-base font-normal text-white placeholder:text-gray-500 outline-none"
                                placeholder="Search equipment..."
                            />
                        </div>
                    </div>

                    {/* Equipment List */}
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-premium/15 border border-brand-purple/30 text-brand-lime">
                                        <span className="material-symbols-outlined text-2xl">photo_camera</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-base font-bold text-white">Camera A (Sony A7IV)</p>
                                        <p className="text-xs text-gray-400">Serial: SN-8293-CAM</p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-500">
                                    Available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
