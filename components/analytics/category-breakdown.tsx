import { ProgressBar } from "@/components/analytics/progress-bar";

type Item = {
  category: string;
  total: number;
};

function iconForCategory(category: string): string {
  switch (category) {
    case "Tithe":
      return "church";
    case "Offering":
      return "volunteer_activism";
    case "Project":
      return "business";
    case "Seed":
      return "psychiatry";
    case "Thanksgiving":
      return "celebration";
    default:
      return "payments";
  }
}

export function CategoryBreakdown({
  items,
  currency = "USD",
}: {
  items: Item[];
  currency?: string;
}) {
  const total = items.reduce((sum, i) => sum + i.total, 0);
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency });

  return (
    <div className="space-y-4">
      {items.slice(0, 5).map((item) => {
        const pct = total > 0 ? (item.total / total) * 100 : 0;
        return (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[18px]">
                  {iconForCategory(item.category)}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-slate-400">{Math.round(pct)}%</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{fmt.format(item.total)}</span>
            </div>
            <ProgressBar value={pct} />
          </div>
        );
      })}
    </div>
  );
}
