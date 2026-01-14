import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "amber" | "emerald" | "purple";
}

export function StatCard({ title, value, icon, trend, trendUp, color = "blue" }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-display text-slate-900">{value}</h3>
          {trend && (
            <p className={cn("text-xs mt-2 font-medium flex items-center gap-1", trendUp ? "text-emerald-600" : "text-red-600")}>
              <span>{trendUp ? "↑" : "↓"}</span> {trend}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl border", colorStyles[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
