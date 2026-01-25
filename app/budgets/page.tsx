import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";
import { getServerSession } from "@/server/session";

import { BudgetsClient } from "./budgets-client";

export default async function BudgetsPage() {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");

  const year = new Date().getFullYear();

  const deptIds = await storage.getUserDepartments(session.userId);
  const departments = (await storage.getDepartments()).filter((d) => deptIds.includes(d.id));

  const allMyRequests = await storage.getDepartmentBudgetRequests({ year, departmentIds: deptIds });

  return (
    <AppShell role="member">
      <TopBar title="Budget Requests" showBack={true} showSearch={false} showNotifications={true} showProfile={true} />

      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Year</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{year}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Submit budget requests per department. Admin reviews and approves or rejects.
            </p>
          </div>

          {departments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6 text-sm text-slate-600 dark:text-gray-400">
              You are not assigned to any departments yet. Add your groups in Profile.
            </div>
          ) : (
            <BudgetsClient year={year} departments={departments} initialRequests={allMyRequests} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
