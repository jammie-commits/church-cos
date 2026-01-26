import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";
import { requireTopAdminSession } from "@/server/require-role";
import { formatCurrency, groupTransactionsByCategory } from "@/server/analytics";

function formatMaybe(value: unknown): string {
  if (value == null) return "—";
  if (value instanceof Date) return value.toLocaleString();
  const asString = String(value);
  return asString.length ? asString : "—";
}

function sumAmounts(rows: Array<{ amount: unknown }>): number {
  return rows.reduce((sum, r) => {
    const n = Number(r.amount ?? 0);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

export default async function AdminMemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireTopAdminSession();

  const { id } = await params;
  const user = await storage.getUser(id);
  if (!user) notFound();

  const deptIds = await storage.getUserDepartments(user.id);
  const depts = await storage.getDepartments();
  const deptNames = depts
    .filter((d) => deptIds.includes(d.id))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));

  const tx = await storage.getTransactions(user.id);
  const projects = await storage.getProjects();
  const attendance = await storage.getUserAttendance(user.id);
  const registrations = await storage.getUserRegistrations(user.id);

  const totalGiving = sumAmounts(tx);
  const categoryTotals = groupTransactionsByCategory(tx as any);

  const contributionsByProjectId = new Map<number, number>();
  for (const t of tx) {
    if (t.category !== "Project") continue;
    if (t.projectId == null) continue;
    const amount = Number(t.amount ?? 0);
    if (!Number.isFinite(amount)) continue;
    contributionsByProjectId.set(t.projectId, (contributionsByProjectId.get(t.projectId) ?? 0) + amount);
  }

  const supportedProjects = Array.from(contributionsByProjectId.entries())
    .map(([projectId, total]) => ({
      projectId,
      total,
      project: projects.find((p) => p.id === projectId),
    }))
    .sort((a, b) => b.total - a.total);

  const now = new Date();
  const activeRegistrations = registrations.filter((r) => r.status === "Registered");
  const upcomingRegistrations = activeRegistrations.filter((r) => new Date(r.eventDate).getTime() >= now.getTime());
  const pastRegistrations = activeRegistrations.filter((r) => new Date(r.eventDate).getTime() < now.getTime());

  const attendanceByEventId = new Map<number, (typeof attendance)[number]>();
  for (const a of attendance) attendanceByEventId.set(a.eventId, a);

  const missedRegistrations = pastRegistrations.filter((r) => {
    const a = attendanceByEventId.get(r.eventId);
    if (!a) return true;
    return a.status === "Absent" || a.status == null;
  });

  const attendanceCounts = {
    registeredUpcoming: upcomingRegistrations.length,
    registeredTotal: activeRegistrations.length,
    missed: missedRegistrations.length,
    present: attendance.filter((a) => a.status === "Present").length,
    absent: attendance.filter((a) => a.status === "Absent").length,
    excused: attendance.filter((a) => a.status === "Excused").length,
    services: attendance.filter((a) => a.eventType === "Service").length,
    events: attendance.filter((a) => a.eventType === "Event").length,
  };

  return (
    <AppShell role="top_admin">
      <TopBar title="Member Details" showBack={true} showSearch={false} showNotifications={false} showProfile={false} />

      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto w-full px-4 py-4 md:px-6 md:py-6 space-y-4">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-gray-400 truncate">{formatMaybe(user.email)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                    ID: {formatMaybe(user.memberId)}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold uppercase">
                    Role: {formatMaybe(user.role)}
                  </span>
                </div>
              </div>

              <Link
                href="/admin/members"
                className="shrink-0 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2 text-sm font-bold hover:bg-white dark:hover:bg-black/30 transition-colors"
              >
                Back to members
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Personal</h2>
              <dl className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Gender</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.gender)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Age</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.age)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">National ID</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.nationalId)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Marital Status</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.maritalStatus)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Children</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.childrenCount)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Contact & Location</h2>
              <dl className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Phone</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.phoneNumber)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Residence</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white text-right">{formatMaybe(user.residenceAddress)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Work & Education</h2>
              <dl className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Employment</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.employmentStatus)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Occupation</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.occupation)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Education</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{formatMaybe(user.educationLevel)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Departments</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {deptNames.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-gray-400">No departments assigned.</p>
                ) : (
                  deptNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold"
                    >
                      {name}
                    </span>
                  ))
                )}
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-gray-500">
                Created: {formatMaybe(user.createdAt)} • Updated: {formatMaybe(user.updatedAt)}
              </p>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5 md:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Financial Details</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">Totals based on recorded transactions.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Total given</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(totalGiving)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryTotals.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-gray-400">No transactions recorded for this member.</p>
                ) : (
                  categoryTotals.slice(0, 6).map((c) => (
                    <div
                      key={c.category}
                      className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50/60 dark:bg-black/20 px-4 py-3"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">{c.category}</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{formatCurrency(Number(c.total))}</p>
                    </div>
                  ))
                )}
              </div>

              {tx.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-gray-400">Recent transactions</h3>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                          <th className="py-2 pr-3">Date</th>
                          <th className="py-2 pr-3">Category</th>
                          <th className="py-2 pr-3">Project</th>
                          <th className="py-2 pr-3">Method</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-white/10">
                        {tx.slice(0, 10).map((t) => {
                          const project = t.projectId != null ? projects.find((p) => p.id === t.projectId) : undefined;
                          return (
                            <tr key={t.id} className="text-slate-900 dark:text-white">
                              <td className="py-2 pr-3 whitespace-nowrap text-slate-600 dark:text-gray-400">{formatDate(t.date)}</td>
                              <td className="py-2 pr-3 font-semibold">{t.category}</td>
                              <td className="py-2 pr-3 text-slate-600 dark:text-gray-400">
                                {project ? (
                                  <Link className="font-semibold hover:underline" href={`/projects/${project.id}`}>
                                    {project.name}
                                  </Link>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="py-2 pr-3 text-slate-600 dark:text-gray-400">{t.type}</td>
                              <td className="py-2 text-right font-extrabold">{formatCurrency(Number(t.amount))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Projects Supported</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">Based on Project-category transactions.</p>
              <div className="mt-4 space-y-3">
                {supportedProjects.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-gray-400">No project contributions recorded.</p>
                ) : (
                  supportedProjects.slice(0, 8).map((sp) => (
                    <div
                      key={sp.projectId}
                      className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50/60 dark:bg-black/20 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {sp.project ? (
                              <Link className="hover:underline" href={`/projects/${sp.projectId}`}>
                                {sp.project.name}
                              </Link>
                            ) : (
                              `Project #${sp.projectId}`
                            )}
                          </p>
                          {sp.project?.status && (
                            <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">Status: {sp.project.status}</p>
                          )}
                        </div>
                        <p className="shrink-0 text-sm font-extrabold">{formatCurrency(sp.total)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Registrations & Attendance</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">Registrations are RSVPs; attendance is check-in/status.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Registered (total): {attendanceCounts.registeredTotal}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Registered (upcoming): {attendanceCounts.registeredUpcoming}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Missed (registered): {attendanceCounts.missed}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Present: {attendanceCounts.present}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Absent: {attendanceCounts.absent}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Excused: {attendanceCounts.excused}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Services: {attendanceCounts.services}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                  Events: {attendanceCounts.events}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50/60 dark:bg-black/20 p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-gray-400">Upcoming registrations</h3>
                <div className="mt-3 space-y-2">
                  {upcomingRegistrations.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-gray-400">No upcoming registrations.</p>
                  ) : (
                    upcomingRegistrations.slice(0, 6).map((r) => (
                      <div key={r.registrationId} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link className="text-sm font-semibold text-slate-900 dark:text-white hover:underline" href={`/events/${r.eventId}`}>
                            {r.eventTitle}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate-600 dark:text-gray-400">
                            {formatDate(r.eventDate)} • {r.eventType}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50/60 dark:bg-black/20 p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-gray-400">Missed registrations</h3>
                <div className="mt-3 space-y-2">
                  {missedRegistrations.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-gray-400">No missed registrations.</p>
                  ) : (
                    missedRegistrations.slice(0, 6).map((r) => (
                      <div key={r.registrationId} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link className="text-sm font-semibold text-slate-900 dark:text-white hover:underline" href={`/events/${r.eventId}`}>
                            {r.eventTitle}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate-600 dark:text-gray-400">
                            {formatDate(r.eventDate)} • {r.eventType}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              {attendance.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-gray-400">No attendance records found for this member.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                      <th className="py-2 pr-3">Date</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3">Title</th>
                      <th className="py-2 pr-3">Location</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-white/10">
                    {attendance.slice(0, 12).map((a) => (
                      <tr key={a.attendanceId} className="text-slate-900 dark:text-white">
                        <td className="py-2 pr-3 whitespace-nowrap text-slate-600 dark:text-gray-400">{formatDate(a.eventDate)}</td>
                        <td className="py-2 pr-3 font-semibold">{a.eventType}</td>
                        <td className="py-2 pr-3">
                          <Link className="font-semibold hover:underline" href={`/events/${a.eventId}`}>
                            {a.eventTitle}
                          </Link>
                        </td>
                        <td className="py-2 pr-3 text-slate-600 dark:text-gray-400">{a.eventLocation ?? "—"}</td>
                        <td className="py-2">
                          <span className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-1 text-xs font-bold">
                            {a.status ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
