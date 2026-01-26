"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type RegistrationStatus = "Registered" | "Cancelled";

type ApiResponse =
  | { ok: true; registration: { status: RegistrationStatus; createdAt?: string | null; updatedAt?: string | null } | null }
  | { message: string };

export function RegisterButtonClient({ eventId }: { eventId: number }) {
  const [status, setStatus] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/events/${eventId}/registration`, { method: "GET", cache: "no-store" })
      .then(async (res) => {
        const json = (await res.json()) as ApiResponse;
        if (!alive) return;

        if (!res.ok) {
          setError("message" in json ? json.message : "Failed to load registration");
          setStatus(null);
          return;
        }

        setStatus("ok" in json && json.ok ? (json.registration?.status ?? null) : null);
      })
      .catch(() => {
        if (!alive) return;
        setError("Failed to load registration");
        setStatus(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [eventId]);

  const isRegistered = status === "Registered";

  const label = useMemo(() => {
    if (loading) return "Loading…";
    if (pending) return isRegistered ? "Cancelling…" : "Registering…";
    return isRegistered ? "Cancel registration" : "Register";
  }, [isRegistered, loading, pending]);

  async function toggle() {
    setError(null);
    const method = isRegistered ? "DELETE" : "POST";

    const res = await fetch(`/api/events/${eventId}/registration`, {
      method,
      headers: { "content-type": "application/json" },
    });

    const json = (await res.json()) as ApiResponse;

    if (!res.ok) {
      setError("message" in json ? json.message : "Request failed");
      return;
    }

    if ("ok" in json && json.ok) {
      setStatus(json.registration?.status ?? null);
    }
  }

  return (
    <div className="flex-1">
      <button
        type="button"
        aria-label={isRegistered ? "Cancel registration" : "Register"}
        title={isRegistered ? "Cancel registration" : "Register"}
        disabled={loading || pending}
        onClick={() => startTransition(toggle)}
        className="w-full rounded-xl bg-white text-black hover:bg-gray-100 disabled:opacity-60 disabled:hover:bg-white px-4 py-3 text-sm font-extrabold transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
        {label}
      </button>
      {error ? <p className="mt-2 text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}
