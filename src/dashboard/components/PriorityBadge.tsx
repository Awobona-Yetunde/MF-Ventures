import { cn } from "@/lib/cn";
import type { Priority } from "@/dashboard/types";
import { PRIORITY_LABEL, PRIORITY_STYLE } from "@/dashboard/data/labels";

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        PRIORITY_STYLE[priority],
        className,
      )}
    >
      {priority === "critical" && <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />}
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
