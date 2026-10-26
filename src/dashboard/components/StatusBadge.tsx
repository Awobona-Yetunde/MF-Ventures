import { cn } from "@/lib/cn";
import type { RepairStatus, EquipmentStatus } from "@/dashboard/types";
import { EQUIPMENT_STATUS_LABEL, EQUIPMENT_STATUS_STYLE, REPAIR_STATUS_LABEL, REPAIR_STATUS_STYLE } from "@/dashboard/data/labels";

type BadgeStatus = RepairStatus | EquipmentStatus;

function isEquipmentStatus(status: BadgeStatus): status is EquipmentStatus {
  return status in EQUIPMENT_STATUS_LABEL;
}

export function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  const label = isEquipmentStatus(status) ? EQUIPMENT_STATUS_LABEL[status] : REPAIR_STATUS_LABEL[status];
  const style = isEquipmentStatus(status) ? EQUIPMENT_STATUS_STYLE[status] : REPAIR_STATUS_STYLE[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        style ?? "bg-slate-100 text-slate-600",
        className,
      )}
    >
      {label}
    </span>
  );
}
