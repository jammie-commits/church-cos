import clsx from "clsx";

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className={clsx("h-2 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-lime to-emerald-500"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
