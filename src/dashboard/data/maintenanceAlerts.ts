import type { Equipment } from "@/dashboard/types";

// The backend has no concept of a "maintenance due" notification — there's
// no such NotificationType, and nothing server-side watches
// next_maintenance_date. So this is computed entirely on the client from
// equipment already loaded, and "seen" state is kept per-browser in
// localStorage (there's no endpoint to persist it against). Re-setting an
// equipment's next maintenance date naturally produces a new alert, since
// the dismissal key includes the date itself.

export interface MaintenanceAlert {
  equipmentId: string;
  equipmentName: string;
  nextMaintenanceDate: string;
  /** 0 = due today, positive = days overdue. */
  overdueDays: number;
}

const DISMISSED_KEY = "mfv_dismissed_maintenance_alerts";

function alertKey(equipmentId: string, nextMaintenanceDate: string): string {
  return `${equipmentId}:${nextMaintenanceDate}`;
}

function readDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeDismissed(keys: Set<string>) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...keys]));
  } catch {
    // Best-effort — if storage is unavailable, alerts just stay un-dismissable this session.
  }
}

/** Equipment whose next maintenance date has arrived or passed, and isn't already under maintenance. */
export function getDueMaintenanceAlerts(equipment: Equipment[], today: Date = new Date()): MaintenanceAlert[] {
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dismissed = readDismissed();

  return equipment
    .filter((eq) => eq.nextMaintenanceDate && eq.status !== "under_maintenance")
    .map((eq) => {
      const due = new Date(eq.nextMaintenanceDate as string).getTime();
      const overdueDays = Math.round((todayStart - due) / (1000 * 60 * 60 * 24));
      return { equipmentId: eq.id, equipmentName: eq.name, nextMaintenanceDate: eq.nextMaintenanceDate as string, overdueDays };
    })
    .filter((alert) => alert.overdueDays >= 0 && !dismissed.has(alertKey(alert.equipmentId, alert.nextMaintenanceDate)))
    .sort((a, b) => b.overdueDays - a.overdueDays);
}

export function dismissMaintenanceAlert(alert: MaintenanceAlert): void {
  const dismissed = readDismissed();
  dismissed.add(alertKey(alert.equipmentId, alert.nextMaintenanceDate));
  writeDismissed(dismissed);
}
