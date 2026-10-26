import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, EmptyState } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { formatDateTime } from "@/dashboard/data/selectors";
import { cn } from "@/lib/cn";

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, notificationsLoading, refreshNotifications, markNotificationRead, maintenanceAlerts, dismissMaintenanceAlert } =
    useDashboardData();

  useEffect(() => {
    refreshNotifications().catch(() => {});
  }, [refreshNotifications]);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Notifications" description="Approvals, rejections, and repair updates relevant to you." />

      {maintenanceAlerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-ink">Maintenance due</h2>
          {maintenanceAlerts.map((alert) => (
            <div
              key={`${alert.equipmentId}:${alert.nextMaintenanceDate}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => navigate(`/dashboard/equipment/${alert.equipmentId}`)}
                className="flex-1 text-left"
              >
                <p className="text-sm text-ink">
                  <span className="font-semibold">{alert.equipmentName}</span>{" "}
                  {alert.overdueDays === 0
                    ? "is due for maintenance today."
                    : `is overdue for maintenance by ${alert.overdueDays} day${alert.overdueDays === 1 ? "" : "s"}.`}
                </p>
                <p className="mt-1 text-xs text-muted">Next maintenance date: {alert.nextMaintenanceDate}</p>
              </button>
              <button
                type="button"
                onClick={() => dismissMaintenanceAlert(alert)}
                className="shrink-0 text-xs font-semibold text-amber-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {notificationsLoading ? (
        <EmptyState message="Loading notifications…" />
      ) : notifications.length === 0 ? (
        maintenanceAlerts.length === 0 && <EmptyState message="You're all caught up — nothing to review." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                markNotificationRead(n.id);
                if (n.repairRequestId) navigate(`/dashboard/repair-requests/${n.repairRequestId}`);
              }}
              className={cn(
                "flex w-full flex-col gap-1 rounded-lg border border-black/5 bg-white p-4 text-left shadow-sm transition-colors hover:bg-surface/60",
                !n.isRead && "ring-1 ring-brand-blue/20",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-ink">{n.message}</p>
                {!n.isRead && <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />}
              </div>
              <p className="text-xs text-muted">{formatDateTime(n.createdAt)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
