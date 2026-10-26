// Human-readable labels and badge colors for every backend enum. Kept
// separate from src/dashboard/types/index.ts so the types themselves stay a
// plain mirror of the API schema — this file is the only place a display
// string is allowed to drift from the raw value.
import type { ApprovalDecision, EquipmentStatus, FaultType, NotificationType, Priority, Role, RepairStatus } from "@/dashboard/types";

export const ROLE_LABEL: Record<Role, string> = {
  mechanic: "Mechanic",
  supervisor: "Supervisor",
  md: "Managing Director",
  admin: "Administrator",
};

export const FAULT_TYPE_LABEL: Record<FaultType, string> = {
  corrective_maintenance: "Corrective Maintenance",
  preventive_maintenance: "Preventive Maintenance",
  emergency_repair: "Emergency Repair",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const PRIORITY_STYLE: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-50 text-blue-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
};

export const REPAIR_STATUS_LABEL: Record<RepairStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  pending_supervisor_approval: "Pending Supervisor Approval",
  supervisor_approved: "Supervisor Approved",
  pending_md_approval: "Pending MD Approval",
  approved: "Approved",
  repair_in_progress: "Repair In Progress",
  pending_parts: "Pending Parts",
  repair_completed: "Repair Completed",
  closed: "Closed",
  rejected_returned: "Rejected / Returned",
  cancelled: "Cancelled",
};

export const REPAIR_STATUS_STYLE: Record<RepairStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-blue-50 text-blue-700",
  pending_supervisor_approval: "bg-amber-50 text-amber-700",
  supervisor_approved: "bg-blue-50 text-blue-700",
  pending_md_approval: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  repair_in_progress: "bg-brand-blue/10 text-brand-blue",
  pending_parts: "bg-orange-50 text-orange-700",
  repair_completed: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
  rejected_returned: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export const EQUIPMENT_STATUS_LABEL: Record<EquipmentStatus, string> = {
  operational: "Actively Working",
  under_maintenance: "Idle",
  out_of_service: "Out of Service",
};

export const EQUIPMENT_STATUS_STYLE: Record<EquipmentStatus, string> = {
  operational: "bg-emerald-50 text-emerald-700",
  under_maintenance: "bg-amber-50 text-amber-700",
  out_of_service: "bg-red-50 text-red-700",
};

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  new_fault_report: "New Fault Report",
  supervisor_approved: "Supervisor Approved",
  md_approved: "MD Approved",
  request_more_info: "More Information Requested",
  repair_completed: "Repair Completed",
  critical_fault: "Critical Fault",
  rejected: "Rejected",
};

export const APPROVAL_DECISION_LABEL: Record<ApprovalDecision, string> = {
  approve: "Approved",
  reject_return: "Rejected / Returned",
  request_info: "More Information Requested",
};

export const APPROVAL_DECISION_STYLE: Record<ApprovalDecision, string> = {
  approve: "text-emerald-700",
  reject_return: "text-red-700",
  request_info: "text-amber-700",
};

/** Open-ended statuses that still count as an active, unresolved fault. */
export const OPEN_REPAIR_STATUSES = new Set<RepairStatus>([
  "draft",
  "submitted",
  "pending_supervisor_approval",
  "supervisor_approved",
  "pending_md_approval",
  "approved",
  "repair_in_progress",
  "pending_parts",
]);
