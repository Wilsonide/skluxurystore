import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: number;
}

export default function AdminStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: AdminStatsCardProps) {
  const positive = trend !== undefined && trend >= 0;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <Icon size={20} className="text-slate-700" />
        </div>
      </div>

      {(description || trend !== undefined) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend !== undefined && (
            <span
              className={`flex items-center gap-1 font-semibold ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {positive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
              {Math.abs(trend)}%
            </span>
          )}

          {description && <span className="text-slate-500">{description}</span>}
        </div>
      )}
    </div>
  );
}
