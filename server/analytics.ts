export type MonthlyTotal = { key: string; label: string; total: number };
export type CategoryTotal = { category: string; total: number };

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatMonthLabel(date: Date): string {
  return date.toLocaleString("en-US", { month: "short" });
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function getLastNMonths(now: Date, n: number): Date[] {
  const months: Date[] = [];
  const cursor = startOfMonth(now);
  for (let i = n - 1; i >= 0; i--) {
    months.push(new Date(cursor.getFullYear(), cursor.getMonth() - i, 1));
  }
  return months;
}

export function groupTransactionsByMonth(
  transactions: Array<{ amount: unknown; date: Date | null }>,
  opts: { months?: number; now?: Date } = {}
): MonthlyTotal[] {
  const months = opts.months ?? 6;
  const now = opts.now ?? new Date();
  const monthStarts = getLastNMonths(now, months);

  const totalsByKey = new Map<string, number>();
  for (const monthStart of monthStarts) {
    const key = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;
    totalsByKey.set(key, 0);
  }

  for (const tx of transactions) {
    if (!tx.date) continue;
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!totalsByKey.has(key)) continue;
    const amount = Number(tx.amount ?? 0);
    totalsByKey.set(key, (totalsByKey.get(key) ?? 0) + (Number.isFinite(amount) ? amount : 0));
  }

  return monthStarts.map((monthStart) => {
    const key = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      label: formatMonthLabel(monthStart),
      total: totalsByKey.get(key) ?? 0,
    };
  });
}

export function groupTransactionsByCategory(
  transactions: Array<{ amount: unknown; category: string }>
): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    const category = tx.category || "Other";
    const amount = Number(tx.amount ?? 0);
    totals.set(category, (totals.get(category) ?? 0) + (Number.isFinite(amount) ? amount : 0));
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
