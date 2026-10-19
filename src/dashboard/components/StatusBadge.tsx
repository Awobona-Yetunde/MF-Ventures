import { cn } from "@/lib/cn";
import type { RepairStatus, EquipmentStatus } from "@/dashboard/types";

type BadgeStatus = RepairStatus | EquipmentStatus;

const STATUS_STYLES: Record<string, string> = {
  // Repair request statuses
  Draft: "bg-slate-100 text-slate-600",
  Submitted: "bg-blue-50 text-blue-700",
  "Pending Supervisor Approval": "bg-amber-50 text-amber-700",
  "Supervisor Approved": "bg-blue-50 text-blue-700",
  "Pending MD Approval": "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  "Repair In Progress": "bg-brand-blue/10 text-brand-blue",
  "Pending Parts": "bg-orange-50 text-orange-700",
  "Repair Completed": "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
  "Rejected / Returned": "bg-red-50 text-red-700",
  Cancelled: "bg-slate-100 text-slate-500",
  // Equipment statuses
  Operational: "bg-emerald-50 text-emerald-700",
  "Under Maintenance": "bg-amber-50 text-amber-700",
  "Out of Service": "bg-red-50 text-red-700",
};

export function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600",
        className,
      )}
    >
      {status}
    </span>
  );
}
