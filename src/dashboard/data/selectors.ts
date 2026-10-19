import type { Equipment, Notification, RepairRequest, User } from "@/dashboard/types";

// Pure, data-in/data-out helpers. They take the current equipment/requests
// arrays as arguments rather than importing the mock arrays directly, so the
// same functions work whether the caller is reading static seed data or the
// live state from DashboardProvider — and they'll work unchanged once that
// state comes from a real API response instead of mock data.

export function getEquipmentById(equipment: Equipment[], id: string): Equipment | undefined {
  return equipment.find((eq) => eq.id === id);
}

export function getRepairRequestById(requests: RepairRequest[], id: string): RepairRequest | undefined {
  return requests.find((rr) => rr.id === id);
}

export function getRepairRequestsForEquipment(requests: RepairRequest[], equipmentId: string): RepairRequest[] {
  return requests.filter((rr) => rr.equipmentId === equipmentId);
}

export function getUserById(users: User[], id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/** Open-ended statuses that still count as an active, unresolved fault. */
const OPEN_STATUSES = new Set<RepairRequest["status"]>([
  "Draft",
  "Submitted",
  "Pending Supervisor Approval",
  "Supervisor Approved",
  "Pending MD Approval",
  "Approved",
  "Repair In Progress",
  "Pending Parts",
]);

export function isOpenRequest(status: RepairRequest["status"]): boolean {
  return OPEN_STATUSES.has(status);
}

export function getAdminStats(equipment: Equipment[], requests: RepairRequest[]) {
  return {
    totalEquipment: equipment.length,
    openFaults: requests.filter((rr) => isOpenRequest(rr.status)).length,
    pendingSupervisorApprovals: requests.filter((rr) => rr.status === "Pending Supervisor Approval").length,
    pendingMdApprovals: requests.filter((rr) => rr.status === "Pending MD Approval").length,
    repairsInProgress: requests.filter((rr) => rr.status === "Repair In Progress").length,
    pendingParts: requests.filter((rr) => rr.status === "Pending Parts").length,
    completedRepairs: requests.filter((rr) => ["Repair Completed", "Closed"].includes(rr.status)).length,
    totalMaintenanceCost: equipment.reduce((sum, eq) => sum + eq.totalMaintenanceCost, 0),
  };
}

/** Requests filed by a given mechanic — backs every "my reports" view. */
export function getRequestsReportedBy(requests: RepairRequest[], userId: string): RepairRequest[] {
  return requests.filter((rr) => rr.reportedByUserId === userId);
}

/** The Supervisor's action-required queue: requests routed to them, awaiting their decision. */
export function getSupervisorQueue(requests: RepairRequest[], supervisorId: string): RepairRequest[] {
  return requests.filter((rr) => rr.status === "Pending Supervisor Approval" && rr.assignedSupervisorId === supervisorId);
}

/** The MD's action-required queue — a single MD sees every request awaiting final approval. */
export function getMdQueue(requests: RepairRequest[]): RepairRequest[] {
  return requests.filter((rr) => rr.status === "Pending MD Approval");
}

/** Picks the right supervisor to route a new fault report to, by the equipment's site. */
export function getSupervisorForSite(users: User[], site: string): User | undefined {
  return users.find((u) => u.role === "supervisor" && u.site === site) ?? users.find((u) => u.role === "supervisor");
}

/** Next sequential Repair Request ID for the given year, e.g. RR-2026-0007. */
export function generateNextRequestId(requests: RepairRequest[], year = new Date().getFullYear()): string {
  const prefix = `RR-${year}-`;
  const highest = requests
    .map((rr) => rr.id)
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number.parseInt(id.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 0);
  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

export function getNotificationsForUser(notifications: Notification[], userId: string): Notification[] {
  return notifications
    .filter((n) => n.recipientUserId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
    amount,
  );
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
