import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <span className="material-symbols-outlined text-3xl">search_off</span>
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-gray-400">The page you’re looking for doesn’t exist or was moved.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-brand-purple hover:brightness-110 font-semibold transition-all">
            Go to dashboard
          </Link>
          <Link href="/" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
