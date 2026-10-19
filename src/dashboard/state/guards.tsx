import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDashboardSession } from "./DashboardProvider";
import { EmptyState } from "@/dashboard/components";
import type { Role } from "@/dashboard/types";

/** Gates every /dashboard/* screen behind a mocked session. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useDashboardSession();
  if (!user) return <Navigate to="/dashboard/login" replace />;
  return <>{children}</>;
}

/**
 * Gates a single route to the roles that should see it, per the spec's
 * permissions table — e.g. Settings → Admin only, Approval Queue →
 * Supervisor/MD only. Renders an explanatory empty state rather than
 * redirecting, since this only runs once RequireAuth already knows who's
 * signed in.
 */
export function RequireRole({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user } = useDashboardSession();
  if (!user) return null;
  if (!allow.includes(user.role)) {
    return <EmptyState message="You don't have permission to view this page." />;
  }
  return <>{children}</>;
}
