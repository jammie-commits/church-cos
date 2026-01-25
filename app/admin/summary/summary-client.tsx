"use client";

import { useMemo, useState } from "react";

import type { Department, DepartmentBudgetRequest } from "@shared/schema";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function SummaryClient({
  departments,
  initialRequests,
}: {
  departments: Department[];
  initialRequests: DepartmentBudgetRequest[];
}) {
  const [requests, setRequests] = useState<DepartmentBudgetRequest[]>(initialRequests);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deptNameById = useMemo(() => {
    const m = new Map<number, string>();
    for (const d of departments) m.set(d.id, d.name);
    return m;
  }, [departments]);

  const pending = requests.filter((r) => r.status === "Pending");

  async function decide(id: number, status: "Approved" | "Rejected") {
    setError(null);
    setBusyId(id);
    try {
      const json = await postJson<{ ok: boolean; request: DepartmentBudgetRequest }>(`/api/budgets/requests/${id}/decision`, {
        status,
      });
      setRequests((prev) => prev.map((r) => (r.id === id ? json.request : r)));
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold">Pending Budget Approvals</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Top Admin can approve or reject submitted department budgets.</p>
        </div>
        <a
          href="/admin/finance/budget"
          className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Open Budgets
        </a>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200/60 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {pending.length === 0 ? (
          <div className="rounded-xl border border-slate-200/60 dark:border-white/10 p-4 text-sm text-slate-600 dark:text-gray-400">
            No pending requests.
          </div>
        ) : (
          pending.slice(0, 8).map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold truncate">{r.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">
                    {deptNameById.get(r.departmentId) ?? `Dept #${r.departmentId}`} • Year {r.year}
                  </p>
                  {r.description ? <p className="mt-2 text-sm text-slate-700 dark:text-gray-300">{r.description}</p> : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-9 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white disabled:opacity-50"
                    disabled={busyId === r.id}
                    onClick={() => decide(r.id, "Approved")}
                  >
                    {busyId === r.id ? "Working…" : "Approve"}
                  </button>
                  <button
                    className="h-9 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white disabled:opacity-50"
                    disabled={busyId === r.id}
                    onClick={() => decide(r.id, "Rejected")}
                  >
                    {busyId === r.id ? "Working…" : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
