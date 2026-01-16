"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { label: string; total: number };

function formatShortCurrency(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}

export function MonthlyGivingChart({ data }: { data: Point[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatShortCurrency(Number(v))}
            tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const value = Number(payload[0]?.value ?? 0);
              return (
                <div className="rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-sm text-white backdrop-blur">
                  <div className="text-xs text-slate-300">{label}</div>
                  <div className="font-bold">{formatShortCurrency(value)}</div>
                </div>
              );
            }}
          />
          <Bar dataKey="total" radius={[10, 10, 6, 6]} fill="#135bec" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
