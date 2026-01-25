"use client";

import { useMemo, useState } from "react";

import type { Department, DepartmentBudgetRequest, Project, ProjectBudget, Utility, UtilityBudget } from "@shared/schema";

function money(value: unknown): string {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
}

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

export function BudgetClient({
  year,
  projects,
  utilities,
  projectBudgets,
  utilityBudgets,
  departments,
  initialRequests,
  canReview,
}: {
  year: number;
  projects: Project[];
  utilities: Utility[];
  projectBudgets: ProjectBudget[];
  utilityBudgets: UtilityBudget[];
  departments: Department[];
  initialRequests: DepartmentBudgetRequest[];
  canReview: boolean;
}) {
  const [pBudgets, setPBudgets] = useState<ProjectBudget[]>(projectBudgets);
  const [uBudgets, setUBudgets] = useState<UtilityBudget[]>(utilityBudgets);
  const [requests, setRequests] = useState<DepartmentBudgetRequest[]>(initialRequests);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deptNameById = useMemo(() => {
    const m = new Map<number, string>();
    for (const d of departments) m.set(d.id, d.name);
    return m;
  }, [departments]);

  const pBudgetByProjectId = useMemo(() => {
    const m = new Map<number, ProjectBudget>();
    for (const b of pBudgets) m.set(b.projectId, b);
    return m;
  }, [pBudgets]);

  const uBudgetByUtilityId = useMemo(() => {
    const m = new Map<number, UtilityBudget>();
    for (const b of uBudgets) m.set(b.utilityId, b);
    return m;
  }, [uBudgets]);

  const missingProjects = projects.filter((p) => !pBudgetByProjectId.has(p.id));
  const missingUtilities = utilities.filter((u) => !uBudgetByUtilityId.has(u.id));

  async function saveAllocation(kind: "project" | "utility", id: number, amount: string) {
    setError(null);
    const key = `${kind}:${id}`;
    setSavingKey(key);
    try {
      const json = await postJson<{ ok: boolean; budget: any }>("/api/budgets/allocations", {
        kind,
        id,
        year,
        amount,
      });

      if (kind === "project") {
        setPBudgets((prev) => {
          const next = prev.filter((b) => b.projectId !== id);
          next.push(json.budget);
          return next;
        });
      } else {
        setUBudgets((prev) => {
          const next = prev.filter((b) => b.utilityId !== id);
          next.push(json.budget);
          return next;
        });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSavingKey(null);
    }
  }

  async function decideRequest(id: number, status: "Approved" | "Rejected", decisionNote?: string) {
    setError(null);
    setSavingKey(`req:${id}`);
    try {
      const json = await postJson<{ ok: boolean; request: DepartmentBudgetRequest }>(`/api/budgets/requests/${id}/decision`, {
        status,
        decisionNote,
      });
      setRequests((prev) => prev.map((r) => (r.id === id ? json.request : r)));
    } catch (e: any) {
      setError(e?.message || "Failed to update request");
    } finally {
      setSavingKey(null);
    }
  }

  const [newUtilityName, setNewUtilityName] = useState("");
  const [newUtilityDesc, setNewUtilityDesc] = useState("");
  const [localUtilities, setLocalUtilities] = useState<Utility[]>(utilities);

  async function addUtility() {
    setError(null);
    setSavingKey("utility:new");
    try {
      const json = await postJson<{ ok: boolean; utility: Utility }>("/api/budgets/utilities", {
        name: newUtilityName,
        description: newUtilityDesc || undefined,
        active: true,
      });
      setLocalUtilities((prev) => [json.utility, ...prev]);
      setNewUtilityName("");
      setNewUtilityDesc("");
    } catch (e: any) {
      setError(e?.message || "Failed to add utility");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200/60 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Budget Coverage</p>
          <p className="mt-2 text-2xl font-extrabold">{projects.length + localUtilities.length}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Items needing budgets (projects + utilities)</p>
        </div>
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Missing Projects</p>
          <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{missingProjects.length}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Projects without a {year} budget</p>
        </div>
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Missing Utilities</p>
          <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{missingUtilities.length}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">Utilities without a {year} budget</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold">Project Budgets</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">Allocate budgets for every church project</p>
          </div>
        </div>

        <div className="space-y-3">
          {projects.map((p) => {
            const budget = pBudgetByProjectId.get(p.id);
            return (
              <div key={p.id} className="flex flex-col md:flex-row md:items-center gap-3 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-500">{budget ? `Allocated: ${money(budget.amount)}` : "Missing allocation"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="h-10 w-40 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
                    placeholder="Amount"
                    defaultValue={budget ? String(budget.amount) : ""}
                    onBlur={(e) => {
                      const v = e.currentTarget.value.trim();
                      if (!v) return;
                      // Store on element for button
                      (e.currentTarget as any).dataset.value = v;
                    }}
                  />
                  <button
                    className="h-10 rounded-xl bg-brand-purple px-4 text-sm font-bold text-white disabled:opacity-50"
                    disabled={savingKey === `project:${p.id}`}
                    onClick={(e) => {
                      const wrapper = (e.currentTarget.parentElement as HTMLElement) ?? null;
                      const input = wrapper?.querySelector("input") as HTMLInputElement | null;
                      const v = input?.value?.trim() ?? "";
                      if (!v) return;
                      saveAllocation("project", p.id, v);
                    }}
                  >
                    {savingKey === `project:${p.id}` ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold">Utilities</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">Daily-use items (tissues, liquid soap, electricity, Sunday school breakfast, drinking water)</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="h-10 w-full sm:w-56 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
              placeholder="New utility name"
              value={newUtilityName}
              onChange={(e) => setNewUtilityName(e.target.value)}
            />
            <input
              className="h-10 w-full sm:w-72 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
              placeholder="Description (optional)"
              value={newUtilityDesc}
              onChange={(e) => setNewUtilityDesc(e.target.value)}
            />
            <button
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black"
              disabled={!newUtilityName.trim() || savingKey === "utility:new"}
              onClick={addUtility}
            >
              {savingKey === "utility:new" ? "Adding…" : "Add"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {localUtilities.map((u) => {
            const budget = uBudgetByUtilityId.get(u.id);
            return (
              <div key={u.id} className="flex flex-col md:flex-row md:items-center gap-3 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-500">
                    {budget ? `Allocated: ${money(budget.amount)}` : "Missing allocation"}
                    {u.description ? ` • ${u.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="h-10 w-40 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm"
                    placeholder="Amount"
                    defaultValue={budget ? String(budget.amount) : ""}
                  />
                  <button
                    className="h-10 rounded-xl bg-brand-purple px-4 text-sm font-bold text-white disabled:opacity-50"
                    disabled={savingKey === `utility:${u.id}`}
                    onClick={(e) => {
                      const wrapper = (e.currentTarget.parentElement as HTMLElement) ?? null;
                      const input = wrapper?.querySelector("input") as HTMLInputElement | null;
                      const v = input?.value?.trim() ?? "";
                      if (!v) return;
                      saveAllocation("utility", u.id, v);
                    }}
                  >
                    {savingKey === `utility:${u.id}` ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold">Department Budget Requests</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">Departments submit requests; Admin reviews, approves, or rejects</p>
          </div>
          <a
            href="/budgets"
            className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Submit Request
          </a>
        </div>

        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-slate-200/60 dark:border-white/10 p-4 text-sm text-slate-600 dark:text-gray-400">
              No requests yet.
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold truncate">
                      {r.title} <span className="text-slate-400">•</span> {deptNameById.get(r.departmentId) ?? `Dept #${r.departmentId}`}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">
                      Year {r.year} • Amount {money(r.amount)} • Status {r.status}
                    </p>
                    {r.description ? <p className="mt-2 text-sm text-slate-700 dark:text-gray-300">{r.description}</p> : null}
                  </div>

                  {canReview ? (
                    <div className="flex items-center gap-2">
                      <button
                        className="h-9 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white disabled:opacity-50"
                        disabled={savingKey === `req:${r.id}` || r.status === "Approved"}
                        onClick={() => decideRequest(r.id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="h-9 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white disabled:opacity-50"
                        disabled={savingKey === `req:${r.id}` || r.status === "Rejected"}
                        onClick={() => decideRequest(r.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
