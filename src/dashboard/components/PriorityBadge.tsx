import { cn } from "@/lib/cn";
import type { Priority } from "@/dashboard/types";

const PRIORITY_STYLES: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority === "Critical" && <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />}
      {priority}
    </span>
  );
}
