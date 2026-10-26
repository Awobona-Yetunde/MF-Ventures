import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, DataTable, StatusBadge, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getAdminStats, getEquipmentById, formatNaira, formatDate } from "@/dashboard/data/selectors";
import type { Priority, RepairRequest } from "@/dashboard/types";

const PRIORITY_RANK: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function MDDashboard() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests, approvalQueue, refreshApprovalQueue, refreshEquipment, refreshRepairRequests } = useDashboardData();

  useEffect(() => {
    refreshApprovalQueue();
    refreshEquipment().catch(() => {});
    refreshRepairRequests().catch(() => {});
  }, [refreshApprovalQueue, refreshEquipment, refreshRepairRequests]);

  const queue = useMemo(
    () => [...approvalQueue].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]),
    [approvalQueue],
  );

  if (!user) return null;

  const stats = getAdminStats(equipment, repairRequests);

  // Management view: priority and cost first, technical detail stays on the request page.
  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Estimated Cost", cell: (rr) => (rr.estimatedCost ? formatNaira(rr.estimatedCost) : "—") },
    { header: "Reported", cell: (rr) => formatDate(rr.faultDatetime) },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome, ${user.fullName.split(" ")[0]}`} description="Management-level view of fleet risk, cost and approvals." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard label="Total Equipment" value={stats.totalEquipment} />
        <StatCard label="Active Faults" value={stats.openFaults} tone="warning" />
        <StatCard label="Pending MD Approval" value={queue.length} tone="warning" />
        <StatCard label="Repairs In Progress" value={stats.repairsInProgress} />
        <StatCard label="Pending Parts" value={stats.pendingParts} tone="danger" />
        <StatCard label="Completed Repairs" value={stats.completedRepairs} tone="success" />
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Total maintenance cost</h2>
        <p className="mt-2 text-2xl font-extrabold text-ink">{formatNaira(stats.totalMaintenanceCost)}</p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Final approval required</h2>
        <DataTable
          columns={columns}
          rows={queue}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="Nothing is waiting on your final approval right now."
        />
      </div>
    </div>
  );
}
