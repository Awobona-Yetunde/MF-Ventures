import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useDashboardSession } from "@/dashboard/state/DashboardProvider";

/**
 * Shell for every /dashboard/* screen. Distinct from the public-site Layout:
 * fixed sidebar + topbar instead of a floating header, since this is an
 * internal tool, not a marketing page.
 *
 * Only ever rendered inside <RequireAuth>, so `user` is guaranteed here.
 */
export function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user } = useDashboardSession();
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar role={user.role} className="hidden lg:flex" />

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <Sidebar role={user.role} className="relative z-10 flex" onNavigate={() => setMobileNavOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
