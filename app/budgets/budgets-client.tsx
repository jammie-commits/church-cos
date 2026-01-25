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

export function BudgetsClient({
  year,
  departments,
  initialRequests,
}: {
  year: number;
  departments: Department[];
  initialRequests: DepartmentBudgetRequest[];
}) {
  const [requests, setRequests] = useState<DepartmentBudgetRequest[]>(initialRequests);
  const [departmentId, setDepartmentId] = useState<number>(departments[0]?.id ?? 0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const deptNameById = useMemo(() => {
    const m = new Map<number, string>();
    for (const d of departments) m.set(d.id, d.name);
    return m;
  }, [departments]);

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const json = await postJson<{ ok: boolean; request: DepartmentBudgetRequest }>("/api/budgets/requests", {
        departmentId,
        year,
        title,
        description: description || undefined,
        amount,
      });
      setRequests((prev) => [json.request, ...prev]);
      setTitle("");
      setDescription("");
      setAmount("");
    } catch (e: any) {
      setError(e?.message || "Failed to submit");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200/60 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <h2 className="text-lg font-extrabold">Submit Budget Request</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Your department request is sent to Admin for approval.</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Department</span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Amount</span>
            <input
              className="h-11 w-full rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
              placeholder="e.g. 1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Title</span>
            <input
              className="h-11 w-full rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
              placeholder="e.g. Sunday School Breakfast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Description (optional)</span>
            <textarea
              className="min-h-[92px] w-full rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm"
              placeholder="Explain the purpose and breakdown"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            className="h-11 rounded-xl bg-brand-purple px-5 text-sm font-bold text-white disabled:opacity-50"
            disabled={saving || !departmentId || !title.trim() || !amount.trim()}
            onClick={submit}
          >
            {saving ? "Submitting…" : "Submit"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <h2 className="text-lg font-extrabold">My Requests</h2>
        <div className="mt-4 space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-slate-200/60 dark:border-white/10 p-4 text-sm text-slate-600 dark:text-gray-400">No requests yet.</div>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold truncate">{r.title}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">
                      {deptNameById.get(r.departmentId) ?? `Dept #${r.departmentId}`} • {r.year} • {r.status}
                    </p>
                    {r.description ? <p className="mt-2 text-sm text-slate-700 dark:text-gray-300">{r.description}</p> : null}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold">{Number(r.amount ?? 0).toLocaleString()}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-500">Requested</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
