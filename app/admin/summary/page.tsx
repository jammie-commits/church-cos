import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";
import { requireTopAdminSession } from "@/server/require-role";
import { formatCurrency, groupTransactionsByCategory } from "@/server/analytics";

import { SummaryClient } from "./summary-client";

type ViewKey = "overview" | "members" | "finances" | "projects" | "events" | "services";

export default async function AdminSummary({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireTopAdminSession();

  const params = await searchParams;
  const view = (typeof params.view === "string" ? params.view : "overview") as ViewKey;

  const [users, transactions, projects, events, departments, requests] = await Promise.all([
    storage.getAllUsers(),
    storage.getTransactions(),
    storage.getProjects(),
    storage.getEvents(),
    storage.getDepartments(),
    storage.getDepartmentBudgetRequests({ year: new Date().getFullYear() }),
  ]);

  const totalMembers = users.length;
  const totalCollected = transactions.reduce((sum, tx) => sum + Number(tx.amount ?? 0), 0);
  const categoryTotals = groupTransactionsByCategory(transactions as any);

  const serviceEvents = events.filter((e) => e.type === "Service");

  const cards = [
    { key: "members" as const, title: "Total Members", value: String(totalMembers), icon: "groups" },
    { key: "finances" as const, title: "Total Money Collected", value: formatCurrency(totalCollected), icon: "payments" },
    { key: "projects" as const, title: "Projects", value: String(projects.length), icon: "business" },
    { key: "events" as const, title: "Events", value: String(events.length), icon: "event" },
    { key: "services" as const, title: "Services", value: String(serviceEvents.length), icon: "church" },
  ];

  return (
    <AppShell role="top_admin">
      <TopBar title="Top Admin Summary" showBack={false} showSearch={false} showNotifications={true} showProfile={true} />

      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Dashboard</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">System Summary</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Top Admin has full access to system features, budgets, and transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {cards.map((c) => (
              <Link
                key={c.key}
                href={`/admin/summary?view=${c.key}`}
                className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">{c.title}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{c.value}</p>
                  </div>
                  <div className="size-11 rounded-xl bg-brand-purple/10 border border-brand-purple/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-brand-purple">{c.icon}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="lg:col-span-2 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-extrabold">Details</h2>
                <Link
                  href="/admin/summary"
                  className="text-sm font-bold text-brand-purple hover:opacity-90"
                >
                  Overview
                </Link>
              </div>

              {view === "members" ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-gray-400">Showing first 25 members</p>
                  <div className="divide-y divide-slate-200/60 dark:divide-white/10 rounded-xl border border-slate-200/60 dark:border-white/10 overflow-hidden">
                    {users.slice(0, 25).map((u) => (
                      <div key={u.id} className="p-3 bg-white/60 dark:bg-black/20 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-slate-600 dark:text-gray-400 truncate">{u.email}</p>
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : view === "finances" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryTotals.map((c) => (
                      <div key={c.category} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">{c.category}</p>
                        <p className="mt-2 text-xl font-extrabold">{formatCurrency(Number(c.total))}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-200/60 dark:border-white/10 overflow-hidden">
                    <div className="p-3 bg-white/60 dark:bg-black/20 flex items-center justify-between">
                      <p className="text-sm font-extrabold">All Transactions</p>
                      <p className="text-xs text-slate-600 dark:text-gray-400">Showing latest 30</p>
                    </div>
                    <div className="divide-y divide-slate-200/60 dark:divide-white/10">
                      {transactions.slice(0, 30).map((tx) => (
                        <div key={tx.id} className="p-3 bg-white/50 dark:bg-black/10 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{tx.category} • {tx.type}</p>
                            <p className="text-xs text-slate-600 dark:text-gray-400 truncate">{tx.purpose || tx.transactionCode || "—"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold">{formatCurrency(Number(tx.amount))}</p>
                            <p className="text-xs text-slate-500 dark:text-gray-500">{tx.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : view === "projects" ? (
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold truncate">{p.name}</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">{p.status} • Target {formatCurrency(Number(p.targetAmount))}</p>
                      </div>
                      <Link href={`/projects/${p.id}`} className="text-sm font-bold text-brand-purple">Open</Link>
                    </div>
                  ))}
                </div>
              ) : view === "events" ? (
                <div className="space-y-3">
                  {events.slice(0, 25).map((e) => (
                    <div key={e.id} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                      <p className="text-sm font-extrabold">{e.title}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">{e.type} • {new Date(e.date).toLocaleString()}</p>
                      {e.location ? <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">{e.location}</p> : null}
                    </div>
                  ))}
                </div>
              ) : view === "services" ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4">
                    <p className="text-sm font-extrabold">Annual Programme (Recurring)</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-gray-300">
                      <li>Sunday services: 6:30 AM and 9:00 AM (weekly)</li>
                      <li>Youth & Teens: one service every month</li>
                      <li>Easter: 3-day service ending Easter Monday</li>
                      <li>Disciples: Fridays 10:00 PM until dawn</li>
                      <li>End-year: second Sunday of December (last Sunday service), Disciples Dinner, Crossover Service</li>
                    </ul>
                    <Link href="/programme" className="mt-3 inline-block text-sm font-bold text-brand-purple">Open Programme</Link>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 dark:border-white/10 overflow-hidden">
                    <div className="p-3 bg-white/60 dark:bg-black/20 flex items-center justify-between">
                      <p className="text-sm font-extrabold">Service Events</p>
                      <p className="text-xs text-slate-600 dark:text-gray-400">From Events module</p>
                    </div>
                    <div className="divide-y divide-slate-200/60 dark:divide-white/10">
                      {serviceEvents.slice(0, 25).map((e) => (
                        <div key={e.id} className="p-3 bg-white/50 dark:bg-black/10">
                          <p className="text-sm font-bold">{e.title}</p>
                          <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">{new Date(e.date).toLocaleString()}</p>
                        </div>
                      ))}
                      {serviceEvents.length === 0 ? (
                        <div className="p-3 text-sm text-slate-600 dark:text-gray-400">No service events created yet.</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-gray-400">Select a card to view details.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link href="/admin/members" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 font-bold">Manage Members</Link>
                    <Link href="/admin/finance" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 font-bold">Finance Overview</Link>
                    <Link href="/admin/finance/budget" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 font-bold">Budgets & Utilities</Link>
                    <Link href="/admin/events" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 font-bold">Manage Events</Link>
                    <Link href="/admin/settings" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 font-bold">Settings & Access</Link>
                    <Link href="/programme" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 font-bold">Annual Programme</Link>
                  </div>
                </div>
              )}
            </section>

            <div className="space-y-4">
              <SummaryClient departments={departments} initialRequests={requests} />

              <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                <h2 className="text-lg font-extrabold">Top Admin Shortcuts</h2>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Link href="/admin/members" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3 font-bold">Users (CRUD)</Link>
                  <Link href="/admin/events" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3 font-bold">Events & Services (CRUD)</Link>
                  <Link href="/admin/finance" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3 font-bold">Transactions & Reports</Link>
                  <Link href="/admin/finance/budget" className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3 font-bold">Budgets Approval</Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
