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

            const nextParam = searchParams.get("next");
            if (nextParam) {
                router.push(nextParam);
                return;
            }

            const role = String(data?.user?.role ?? "");
            if (role === "top_admin") {
                router.push("/admin/summary");
                return;
            }

            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark text-foreground p-6">

            {/* Back to home link */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-sm font-medium">Back to home</span>
            </Link>

            {/* Login form */}
            <div className="relative w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex size-16 items-center justify-center bg-brand-purple rounded-2xl ring-2 ring-brand-lime/25">
                        <span className="material-symbols-outlined text-white text-3xl">church</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                    <p className="text-slate-600 dark:text-gray-400">Sign in to your JTW CMS account</p>
                </div>

                <div className="bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-[0_18px_60px_-35px_rgba(106,13,173,0.35)]">
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
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/60 focus:border-brand-purple/40 transition-all dark:bg-white/5 dark:border-white/10"
                                placeholder="you@church.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-semibold">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-brand-purple hover:opacity-90 dark:text-brand-lime">
                                    Forgot?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/60 focus:border-brand-purple/40 transition-all dark:bg-white/5 dark:border-white/10"
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
                            className="w-full px-6 py-3 bg-brand-purple text-white hover:bg-brand-purple/90 disabled:opacity-60 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:scale-100"
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
                        <p className="text-sm text-slate-600 dark:text-gray-400">
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
