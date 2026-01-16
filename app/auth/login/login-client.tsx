"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setError(null);
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = (await res.json().catch(() => null)) as any;
            if (!res.ok) {
                setError(data?.message ?? "Sign in failed");
                return;
            }

            const next = searchParams.get("next") || "/dashboard";
            router.push(next);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] text-white p-6">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-black/0 to-brand-lime/10"></div>

            {/* Back to home link */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-sm font-medium">Back to home</span>
            </Link>

            {/* Login form */}
            <div className="relative w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex size-16 items-center justify-center bg-gradient-to-br from-brand-purple to-brand-lime rounded-2xl">
                        <span className="material-symbols-outlined text-white text-3xl">church</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                    <p className="text-gray-400">Sign in to your JTW CMS account</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                placeholder="you@church.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-semibold">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-brand-lime hover:opacity-90">
                                    Forgot?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="size-4 rounded border-white/10 bg-white/5 text-brand-purple focus:ring-brand-purple"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                                Keep me signed in
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-brand-purple hover:brightness-110 disabled:bg-brand-purple/50 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-brand-lime hover:opacity-90 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
