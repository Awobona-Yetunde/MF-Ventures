import { Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/NotFound";
import EngineeringSupport from "@/pages/services/EngineeringSupport";

import { DashboardProvider } from "@/dashboard/state/DashboardProvider";
import { RequireAuth, RequireRole } from "@/dashboard/state/guards";
import { DashboardLayout } from "@/dashboard/layout/DashboardLayout";
import DashboardLogin from "@/dashboard/pages/Login";
import DashboardHome from "@/dashboard/pages/DashboardHome";
import EquipmentList from "@/dashboard/pages/EquipmentList";
import EquipmentProfile from "@/dashboard/pages/EquipmentProfile";
import RepairRequestsList from "@/dashboard/pages/RepairRequestsList";
import RepairRequestDetail from "@/dashboard/pages/RepairRequestDetail";
import ReportFault from "@/dashboard/pages/ReportFault";
import ApprovalQueue from "@/dashboard/pages/ApprovalQueue";
import RepairHistory from "@/dashboard/pages/RepairHistory";
import CostsParts from "@/dashboard/pages/CostsParts";
import Reports from "@/dashboard/pages/Reports";
import NotificationsPage from "@/dashboard/pages/Notifications";
import UserManagement from "@/dashboard/pages/UserManagement";
import Settings from "@/dashboard/pages/Settings";

/** Wraps the whole /dashboard subtree — including the login screen — in one shared session + data store. */
function DashboardScope() {
  return (
    <DashboardProvider>
      <Outlet />
    </DashboardProvider>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<Services />} />
          <Route
            path="/services/engineering-support"
            element={<EngineeringSupport />}
          />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Internal dashboard — Digital Equipment Maintenance & Approval System.
            DashboardProvider wires every screen under here to the real backend
            API (see src/dashboard/api/), so an approval, a new fault report, or
            a logged repair action shows up everywhere else as soon as it's
            fetched again from the server. */}
        <Route element={<DashboardScope />}>
          <Route path="dashboard/login" element={<DashboardLogin />} />

          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="equipment" element={<EquipmentList />} />
            <Route
              path="equipment/:equipmentId"
              element={<EquipmentProfile />}
            />
            <Route path="repair-requests" element={<RepairRequestsList />} />
            <Route
              path="repair-requests/:requestId"
              element={<RepairRequestDetail />}
            />
            <Route
              path="report-fault"
              element={
                <RequireRole allow={["mechanic", "admin"]}>
                  <ReportFault />
                </RequireRole>
              }
            />
            <Route
              path="approvals"
              element={
                <RequireRole allow={["supervisor", "md"]}>
                  <ApprovalQueue />
                </RequireRole>
              }
            />
            <Route path="history" element={<RepairHistory />} />
            <Route
              path="costs"
              element={
                <RequireRole allow={["supervisor", "md", "admin"]}>
                  <CostsParts />
                </RequireRole>
              }
            />
            <Route
              path="reports"
              element={
                <RequireRole allow={["supervisor", "md", "admin"]}>
                  <Reports />
                </RequireRole>
              }
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route
              path="users"
              element={
                <RequireRole allow={["admin"]}>
                  <UserManagement />
                </RequireRole>
              }
            />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
