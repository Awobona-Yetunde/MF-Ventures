import type { Equipment, RepairRequest, User } from "@/dashboard/types";
import { OPEN_REPAIR_STATUSES } from "@/dashboard/data/labels";

// Pure, data-in/data-out helpers over whatever arrays the caller currently
// has loaded from the API (via DashboardProvider) — they don't know or care
// whether that data is fully loaded yet, so callers handle loading states
// themselves.

export function getEquipmentById(equipment: Equipment[], id: string): Equipment | undefined {
  return equipment.find((eq) => eq.id === id);
}

export function getRepairRequestById(requests: RepairRequest[], id: string): RepairRequest | undefined {
  return requests.find((rr) => rr.id === id);
}

export function getRepairRequestsForEquipment(requests: RepairRequest[], equipmentId: string): RepairRequest[] {
  return requests.filter((rr) => rr.equipmentId === equipmentId);
}

export function getUserById(users: User[], id: string | null | undefined): User | undefined {
  if (!id) return undefined;
  return users.find((u) => u.id === id);
}

/** Resolves a user id to a display name, falling back to a shortened id when the users list hasn't loaded (or isn't visible to this role). */
export function getUserDisplayName(users: User[], id: string | null | undefined): string {
  if (!id) return "—";
  const user = getUserById(users, id);
  return user?.fullName ?? `User ${id.slice(0, 8)}`;
}

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function isOpenRequest(status: RepairRequest["status"]): boolean {
  return OPEN_REPAIR_STATUSES.has(status);
}

export function getAdminStats(equipment: Equipment[], requests: RepairRequest[]) {
  return {
    totalEquipment: equipment.length,
    openFaults: requests.filter((rr) => isOpenRequest(rr.status)).length,
    pendingSupervisorApprovals: requests.filter((rr) => rr.status === "pending_supervisor_approval").length,
    pendingMdApprovals: requests.filter((rr) => rr.status === "pending_md_approval").length,
    repairsInProgress: requests.filter((rr) => rr.status === "repair_in_progress").length,
    pendingParts: requests.filter((rr) => rr.status === "pending_parts").length,
    completedRepairs: requests.filter((rr) => rr.status === "repair_completed" || rr.status === "closed").length,
    totalMaintenanceCost: equipment.reduce((sum, eq) => sum + eq.totalMaintenanceCost, 0),
  };
}

/** Requests filed by a given mechanic — backs every "my reports" view. */
export function getRequestsReportedBy(requests: RepairRequest[], userId: string): RepairRequest[] {
  return requests.filter((rr) => rr.reportedById === userId);
}

/**
 * Days the equipment was idle because of this fault: from the moment the
 * fault was reported (`faultDatetime`) to the moment the repair was
 * completed. The backend doesn't record a separate "completed at"
 * timestamp, so `updatedAt` is used as the completion time — the last
 * update to a request that has reached repair_completed/closed is the
 * completion itself. Returns null for a request that isn't finished yet,
 * since there's no end point to measure to.
 */
export function getIdleDays(request: RepairRequest): number | null {
  if (request.status !== "repair_completed" && request.status !== "closed") return null;
  const start = new Date(request.faultDatetime).getTime();
  const end = new Date(request.updatedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

function startOfDay(iso: string): Date {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetweenInclusive(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export interface MonthlyEquipmentActivity {
  equipmentId: string;
  equipmentName: string;
  daysInMonth: number;
  idleDays: number;
  activeWorkingDays: number;
}

/**
 * For each equipment item, how many days in the given month it was idle
 * because of a fault versus actively working. A fault's idle span runs
 * from when it was reported (`faultDatetime`) to when the repair was
 * completed (`updatedAt`, the closest proxy the backend records); only the
 * portion of that span that falls inside the given month counts. Equipment
 * with no qualifying fault is active for every day of the month.
 */
export function getMonthlyEquipmentActivity(
  equipment: Equipment[],
  requests: RepairRequest[],
  year: number,
  month: number, // 0-indexed, matches Date's convention
): MonthlyEquipmentActivity[] {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const totalDaysInMonth = monthEnd.getDate();

  return equipment.map((eq) => {
    const faultsForEquipment = requests.filter(
      (rr) => rr.equipmentId === eq.id && (rr.status === "repair_completed" || rr.status === "closed"),
    );

    let idleDays = 0;
    for (const rr of faultsForEquipment) {
      const faultStart = startOfDay(rr.faultDatetime);
      const faultEnd = startOfDay(rr.updatedAt);
      if (faultEnd < faultStart) continue;

      const overlapStart = faultStart > monthStart ? faultStart : monthStart;
      const overlapEnd = faultEnd < monthEnd ? faultEnd : monthEnd;
      if (overlapEnd >= overlapStart) {
        idleDays += daysBetweenInclusive(overlapStart, overlapEnd);
      }
    }
    idleDays = Math.min(idleDays, totalDaysInMonth);

    return {
      equipmentId: eq.id,
      equipmentName: eq.name,
      daysInMonth: totalDaysInMonth,
      idleDays,
      activeWorkingDays: totalDaysInMonth - idleDays,
    };
  });
}

export function formatNaira(amount: number | null | undefined): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
    amount ?? 0,
  );
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
