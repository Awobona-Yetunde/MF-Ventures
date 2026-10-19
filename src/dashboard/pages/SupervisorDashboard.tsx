import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, DataTable, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getSupervisorQueue, formatDate } from "@/dashboard/data/selectors";
import type { RepairRequest } from "@/dashboard/types";

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests } = useDashboardData();
  if (!user) return null;

  const queue = getSupervisorQueue(repairRequests, user.id);
  const approved = repairRequests.filter((rr) => rr.supervisorApproval?.userId === user.id && rr.supervisorApproval.decision === "Approved").length;
  const repairsInProgress = repairRequests.filter((rr) => rr.status === "Repair In Progress").length;
  const pendingParts = repairRequests.filter((rr) => rr.status === "Pending Parts").length;
  const completed = repairRequests.filter((rr) => ["Repair Completed", "Closed"].includes(rr.status)).length;

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.id}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault Type", cell: (rr) => rr.faultType },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.reportedAt) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        description="Review and action the fault reports routed to you."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Pending Approval" value={queue.length} tone="warning" />
        <StatCard label="Approved by Me" value={approved} tone="success" />
        <StatCard label="Repair In Progress" value={repairsInProgress} />
        <StatCard label="Pending Parts" value={pendingParts} tone="danger" />
        <StatCard label="Completed" value={completed} tone="success" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Action required</h2>
          {queue.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/dashboard/approvals")}
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View full queue
            </button>
          )}
        </div>
        <DataTable
          columns={columns}
          rows={queue}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="Nothing is waiting on your approval right now."
        />
      </div>
    </div>
  );
}
