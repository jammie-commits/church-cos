import Link from "next/link";
import { storage } from "@/server/storage";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { requireAdminSession } from "@/server/require-admin";

export default async function MemberDirectory() {
    await requireAdminSession();

    const users = await storage.getAllUsers();

    return (
        <AppShell role="admin">
            <TopBar
                title="Member Directory"
                showBack={true}
                showSearch={false}
                showNotifications={false}
                showProfile={false}
            />

            <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Search Bar */}
                    <div className="px-4 py-3 md:px-6">
                        <div className="relative flex items-center">
                            <div className="absolute left-3 text-gray-400">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="w-full h-11 bg-white dark:bg-[#232f48] border border-gray-200 dark:border-none rounded-xl pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-premium transition-all shadow-sm"
                                placeholder="Search by name or ID..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="px-4 py-3 md:px-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {users.length} Total Members
                        </span>
                        <button className="flex items-center gap-1 text-primary-premium text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                            Filter
                        </button>
                    </div>

                    {/* Member List */}
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {users.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 md:px-6 py-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
                            >
                                <div className="relative">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-primary-premium/20"
                                        style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbVSKKhloMGUPm7NsWc4BIgtq_iAKoVnkAv_Wd7aaV10hXKMmmYGhkFEIK49uuCu1YFst0ZLa6WS0g3hj5ZD3acsgyq-TjSV-R_y1J3TtRUqPfJn_h12GWnvVUNhj9bI2ZR8IU4jTW3_OzfXz0N47bXWhcazBrLqxGRWOFvPy80tsFkcLeoNknPlIwAyg12tryu1HNxw-JyYY_RSHxQ3HCHV7PcxLxqvo02bGFlBixivUAtngoY0M9WoFY3UWy2ZJ4wk3vVhv6Rco")` }}
                                    ></div>
                                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></div>
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <Link
                                        href={`/admin/members/${member.id}`}
                                        className="text-base font-semibold leading-tight truncate hover:underline underline-offset-4"
                                    >
                                        {member.firstName} {member.lastName}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">#{member.memberId}</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                                        <span className="text-xs text-slate-500 uppercase">{member.role}</span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
