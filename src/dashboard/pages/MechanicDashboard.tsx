import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, StatCard, DataTable, StatusBadge, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getRequestsReportedBy, isOpenRequest, formatDate } from "@/dashboard/data/selectors";
import type { RepairRequest } from "@/dashboard/types";

export default function MechanicDashboard() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests, refreshEquipment, refreshRepairRequests } = useDashboardData();

  // Best-effort refresh on every visit so this screen doesn't rely solely
  // on the one fetch that ran right after login.
  useEffect(() => {
    refreshEquipment().catch(() => {});
    refreshRepairRequests().catch(() => {});
  }, [refreshEquipment, refreshRepairRequests]);

  if (!user) return null;

  const myRequests = getRequestsReportedBy(repairRequests, user.id);
  const openReports = myRequests.filter((rr) => isOpenRequest(rr.status)).length;
  const awaitingApproval = myRequests.filter(
    (rr) => rr.status === "pending_supervisor_approval" || rr.status === "pending_md_approval",
  ).length;
  const activeRepairs = myRequests.filter((rr) => rr.status === "repair_in_progress" || rr.status === "pending_parts").length;
  const completedRepairs = myRequests.filter((rr) => rr.status === "repair_completed" || rr.status === "closed").length;

  const recent = [...myRequests]
    .sort((a, b) => new Date(b.faultDatetime).getTime() - new Date(a.faultDatetime).getTime())
    .slice(0, 8);

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault", cell: (rr) => <span className="line-clamp-1 max-w-xs">{rr.faultDescription}</span> },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.faultDatetime) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${user.fullName.split(" ")[0]}`}
        description={`${user.site ?? "Report"} · Report faults and track your repairs here.`}
        actions={
          <Button size="lg" onClick={() => navigate("/dashboard/report-fault")}>
            + Report Equipment Fault
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="My Open Reports" value={openReports} />
        <StatCard label="Awaiting Approval" value={awaitingApproval} tone="warning" />
        <StatCard label="Active Repairs" value={activeRepairs} />
        <StatCard label="Completed Repairs" value={completedRepairs} tone="success" />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Recent reports</h2>
        <DataTable
          columns={columns}
          rows={recent}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="You haven't reported any faults yet — tap Report Equipment Fault to get started."
        />
      </div>
    </div>
  );
}
