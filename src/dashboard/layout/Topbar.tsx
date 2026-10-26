import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import type { User } from "@/dashboard/types";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { formatDateTime, getInitials } from "@/dashboard/data/selectors";
import { ROLE_LABEL } from "@/dashboard/data/labels";

interface TopbarProps {
  user: User;
  onMenuClick?: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const { logout } = useDashboardSession();
  const { notifications, markNotificationRead, maintenanceAlerts, dismissMaintenanceAlert } = useDashboardData();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const myNotifications = notifications.slice(0, 8);
  const unreadCount = myNotifications.filter((n) => !n.isRead).length + maintenanceAlerts.length;

  function handleSignOut() {
    logout();
    navigate("/dashboard/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink lg:hidden"
          aria-label="Open navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <p className="text-sm font-semibold text-ink">Welcome, {user.fullName.split(" ")[0]}</p>
          <p className="text-xs text-muted">
            {ROLE_LABEL[user.role]}
            {user.site ? ` · ${user.site}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((open) => !open);
              setProfileOpen(false);
            }}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-surface"
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 16v-5a6 6 0 10-12 0v5l-1.5 2h15L18 16z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-black/5 bg-white p-2 shadow-lg">
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Notifications</p>
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-brand-blue hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {maintenanceAlerts.map((alert) => (
                  <div key={`${alert.equipmentId}:${alert.nextMaintenanceDate}`} className="rounded-md bg-amber-50 px-2 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        navigate(`/dashboard/equipment/${alert.equipmentId}`);
                      }}
                      className="block w-full text-left"
                    >
                      <p className="text-sm text-ink">
                        <span className="font-semibold">{alert.equipmentName}</span>{" "}
                        {alert.overdueDays === 0 ? "is due for maintenance today." : `is overdue for maintenance by ${alert.overdueDays} day${alert.overdueDays === 1 ? "" : "s"}.`}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissMaintenanceAlert(alert)}
                      className="mt-1 text-xs font-semibold text-amber-700 hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
                {myNotifications.length === 0 && maintenanceAlerts.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-muted">Nothing new.</p>
                ) : (
                  myNotifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        markNotificationRead(n.id);
                        setNotifOpen(false);
                        if (n.repairRequestId) navigate(`/dashboard/repair-requests/${n.repairRequestId}`);
                      }}
                      className={cn("block w-full rounded-md px-2 py-2 text-left text-sm", !n.isRead && "bg-brand-blue/5")}
                    >
                      <p className="text-ink">{n.message}</p>
                      <p className="mt-0.5 text-xs text-muted">{formatDateTime(n.createdAt)}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotifOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-semibold text-brand-blue"
            aria-label="Account menu"
            aria-expanded={profileOpen}
          >
            {getInitials(user.fullName)}
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-black/5 bg-white p-1.5 shadow-lg">
              <p className="px-3 py-2 text-sm font-semibold text-ink">{user.fullName}</p>
              <Link
                to="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-surface"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
