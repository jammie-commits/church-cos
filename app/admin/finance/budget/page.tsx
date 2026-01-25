import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { storage } from "@/server/storage";
import { requireFinanceBudgetAccess, isAdminLike } from "@/server/require-role";

import { BudgetClient } from "./budget-client";

export default async function FinanceBudgetPage() {
  const session = await requireFinanceBudgetAccess();

  const year = new Date().getFullYear();

  const [projects, utilities, projectBudgets, utilityBudgets, departments, requests] = await Promise.all([
    storage.getProjects(),
    storage.getUtilities(),
    storage.getProjectBudgets(year),
    storage.getUtilityBudgets(year),
    storage.getDepartments(),
    storage.getDepartmentBudgetRequests({ year }),
  ]);

  const shellRole = session.role === "finance" ? "finance" : session.role === "top_admin" ? "top_admin" : "admin";

  return (
    <AppShell role={shellRole as any}>
      <TopBar title="Finance Budget" showBack={true} showSearch={false} showNotifications={true} showProfile={true} />

      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Budget Year</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{year}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              All church projects and utilities must have allocated budgets. Department requests flow to Admin for approval.
            </p>
          </div>

          <BudgetClient
            year={year}
            projects={projects}
            utilities={utilities}
            projectBudgets={projectBudgets}
            utilityBudgets={utilityBudgets}
            departments={departments}
            initialRequests={requests}
            canReview={isAdminLike(session.role)}
          />
        </div>
      </div>
    </AppShell>
  );
}
