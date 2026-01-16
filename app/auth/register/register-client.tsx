"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterClient() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setError(null);
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = (await res.json().catch(() => null)) as any;
            if (!res.ok) {
                setError(data?.message ?? "Registration failed");
                return;
            }

            const memberId = data?.user?.memberId as string | undefined;
            router.push(memberId ? `/profile/complete?memberId=${encodeURIComponent(memberId)}` : "/profile/complete");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

            {/* Register form */}
            <div className="relative w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex size-16 items-center justify-center bg-gradient-to-br from-brand-purple to-brand-lime rounded-2xl">
                        <span className="material-symbols-outlined text-white text-3xl">church</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Get started</h1>
                    <p className="text-gray-400">Create your account - Step 1 of 2</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-brand-purple hover:brightness-110 disabled:bg-brand-purple/50 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Creating account...
                                </span>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-brand-lime hover:opacity-90 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
