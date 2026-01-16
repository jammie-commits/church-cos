"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const run = async () => {
            try {
                await fetch("/api/auth/logout", { method: "POST" });
            } finally {
                router.replace("/");
            }
        };
        void run();
    }, [router]);

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6">
            <div className="text-center">
                <p className="text-sm text-gray-400">Signing you out…</p>
            </div>
        </div>
    );
}
