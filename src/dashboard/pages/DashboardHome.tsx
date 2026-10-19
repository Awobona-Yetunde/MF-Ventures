import { useDashboardSession } from "@/dashboard/state/DashboardProvider";
import MechanicDashboard from "./MechanicDashboard";
import SupervisorDashboard from "./SupervisorDashboard";
import MDDashboard from "./MDDashboard";
import AdminDashboard from "./AdminDashboard";

/** The /dashboard index route — renders the right home screen for the signed-in role. */
export default function DashboardHome() {
  const { user } = useDashboardSession();
  if (!user) return null;

  switch (user.role) {
    case "mechanic":
      return <MechanicDashboard />;
    case "supervisor":
      return <SupervisorDashboard />;
    case "md":
      return <MDDashboard />;
    case "admin":
      return <AdminDashboard />;
  }
}
