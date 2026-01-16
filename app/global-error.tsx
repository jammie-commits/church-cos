"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <span className="material-symbols-outlined text-3xl text-red-200">error</span>
          </div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="mt-2 text-sm text-gray-400">Try again, or return to the dashboard.</p>
          <p className="mt-3 text-xs text-gray-500 break-all">{error?.digest ?? error?.message}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-brand-purple hover:brightness-110 font-semibold transition-all"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
