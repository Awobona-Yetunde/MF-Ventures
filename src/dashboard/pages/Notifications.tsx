import { useNavigate } from "react-router-dom";
import { PageHeader, EmptyState } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getNotificationsForUser, formatDateTime } from "@/dashboard/data/selectors";
import { cn } from "@/lib/cn";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { notifications, markNotificationRead } = useDashboardData();
  if (!user) return null;

  const mine = getNotificationsForUser(notifications, user.id);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Notifications" description="Approvals, rejections, and repair updates relevant to you." />

      {mine.length === 0 ? (
        <EmptyState message="You're all caught up — nothing to review." />
      ) : (
        <div className="space-y-2">
          {mine.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                markNotificationRead(n.id);
                if (n.relatedRequestId) navigate(`/dashboard/repair-requests/${n.relatedRequestId}`);
              }}
              className={cn(
                "flex w-full flex-col gap-1 rounded-lg border border-black/5 bg-white p-4 text-left shadow-sm transition-colors hover:bg-surface/60",
                !n.read && "ring-1 ring-brand-blue/20",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-ink">{n.message}</p>
                {!n.read && <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />}
              </div>
              <p className="text-xs text-muted">{formatDateTime(n.timestamp)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
