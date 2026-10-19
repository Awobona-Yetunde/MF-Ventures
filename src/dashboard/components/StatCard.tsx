import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "warning" | "danger" | "success";
}

const TONE_STYLES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-brand-blue/10 text-brand-blue",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  success: "bg-emerald-50 text-emerald-700",
};

export function StatCard({ label, value, icon, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon && (
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", TONE_STYLES[tone])}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink">{value}</p>
    </div>
  );
}
