import { Suspense } from "react";
import { RegisterClient } from "./register-client";

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Loading...
                    </div>
                </div>
            }
        >
            <RegisterClient />
        </Suspense>
    );
}
