"use client";

import { useRouter } from "next/navigation";

interface TopBarProps {
    title: string;
    showBack?: boolean;
    showSearch?: boolean;
    showNotifications?: boolean;
    showProfile?: boolean;
    onBackClick?: () => void;
}

export function TopBar({
    title,
    showBack = false,
    showSearch = true,
    showNotifications = true,
    showProfile = true,
    onBackClick,
}: TopBarProps) {
    const router = useRouter();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            router.back();
        }
    };

    return (
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 gap-2">
            {showBack ? (
                <button
                    onClick={handleBackClick}
                    className="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#232f48] text-gray-700 dark:text-white"
                >
                    <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
                </button>
            ) : showProfile ? (
                <div className="flex size-10 shrink-0 items-center">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary-premium/20"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoh0ayAFZGJBCSapVPYT74wt8kvZmSSDQvZntmy687W6an8b6rnuuI5ia0_YztHsqfKVTlKU93UyGrWIMie2uyKovR_bhoyOHQSz7dKayWf2oPtn9XjNTp_9hO7hMCfzjZNMY_68uA-1-Yvv60k5KCz-Pg1lYUI1lYXJzS2R4OHM1bw-J9zbuRtMhBqvlj-gDPMRok7cyksUfPvatiJBdvA7TZSZ2a-nZzR713ajSAEB6f43mAOnpup9-c1q2SbiJLSS8ysz2matM")',
                        }}
                    ></div>
                </div>
            ) : (
                <div className="flex size-10 shrink-0" />
            )}

            <div className="flex-1 min-w-0 px-2 sm:px-4">
                <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight truncate">
                    {title}
                </h2>
            </div>

            <div className="flex gap-2 items-center shrink-0">
                {showSearch && (
                    <button className="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#232f48] text-gray-700 dark:text-white">
                        <span className="material-symbols-outlined text-[22px]">search</span>
                    </button>
                )}
                {showNotifications && (
                    <button className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gray-200 dark:bg-[#232f48] text-gray-700 dark:text-white px-3">
                        <span className="material-symbols-outlined text-[22px]">notifications</span>
                        <span className="size-2 bg-red-500 rounded-full border-2 border-gray-200 dark:border-background-dark" aria-hidden="true"></span>
                    </button>
                )}
            </div>
        </div>
    );
}
