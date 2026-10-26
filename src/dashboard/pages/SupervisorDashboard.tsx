import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, DataTable, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, formatDate } from "@/dashboard/data/selectors";
import { FAULT_TYPE_LABEL } from "@/dashboard/data/labels";
import type { RepairRequest } from "@/dashboard/types";

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests, approvalQueue, refreshApprovalQueue, refreshEquipment, refreshRepairRequests } = useDashboardData();

  useEffect(() => {
    refreshApprovalQueue();
    refreshEquipment().catch(() => {});
    refreshRepairRequests().catch(() => {});
  }, [refreshApprovalQueue, refreshEquipment, refreshRepairRequests]);

  if (!user) return null;

  const repairsInProgress = repairRequests.filter((rr) => rr.status === "repair_in_progress").length;
  const pendingParts = repairRequests.filter((rr) => rr.status === "pending_parts").length;
  const completed = repairRequests.filter((rr) => rr.status === "repair_completed" || rr.status === "closed").length;

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault Type", cell: (rr) => FAULT_TYPE_LABEL[rr.faultType] },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.faultDatetime) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${user.fullName.split(" ")[0]}`}
        description="Review and action the fault reports routed to you."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Approval" value={approvalQueue.length} tone="warning" />
        <StatCard label="Repair In Progress" value={repairsInProgress} />
        <StatCard label="Pending Parts" value={pendingParts} tone="danger" />
        <StatCard label="Completed" value={completed} tone="success" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Action required</h2>
          {approvalQueue.length > 0 && (
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
          rows={approvalQueue}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="Nothing is waiting on your approval right now."
        />
      </div>
    </div>
  );
}
