import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-gradient-to-br from-brand-purple to-brand-lime rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">church</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">JTW CMS</h1>
                            <p className="text-xs text-gray-400">Church Management System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/auth/login"
                            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link 
                            href="/auth/register"
                            className="px-6 py-2.5 bg-brand-purple hover:brightness-110 rounded-lg text-sm font-semibold transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6 pt-20">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                        <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-300">Jesus The Way Ministry Members Portal</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        Welcome to
                        <br />
                        <span className="bg-gradient-to-r from-brand-purple to-brand-lime bg-clip-text text-transparent">
                            Jesus The Way Ministry
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Connect with your church community. Stay updated on events, track your giving, 
                        participate in projects, and grow together in faith.
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-16">
                        <Link 
                            href="/auth/register"
                            className="px-8 py-4 bg-brand-purple hover:brightness-110 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg shadow-brand-purple/20"
                        >
                            Sign Up
                        </Link>
                        <Link 
                            href="/auth/login"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-base font-semibold transition-all"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="mb-4 p-3 bg-brand-purple/20 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-brand-lime text-2xl">groups</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Member Management</h3>
                            <p className="text-sm text-gray-400">
                                Comprehensive member database with engagement tracking
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="mb-4 p-3 bg-green-500/20 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-green-400 text-2xl">payments</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Giving & Finance</h3>
                            <p className="text-sm text-gray-400">
                                Track donations, pledges, and financial reporting
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="mb-4 p-3 bg-brand-purple/20 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-brand-lime text-2xl">event</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Event Planning</h3>
                            <p className="text-sm text-gray-400">
                                Schedule services, events, and manage attendance
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="mb-4 p-3 bg-green-500/20 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-green-400 text-2xl">business</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Project Tracking</h3>
                            <p className="text-sm text-gray-400">
                                Manage church projects and fundraising campaigns
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 backdrop-blur-xl bg-black/40 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                    <p className="text-sm text-gray-400">© 2026 JTW CMS. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
