import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, DataTable, StatusBadge, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getAdminStats, getEquipmentById, getMdQueue, formatNaira, formatDate } from "@/dashboard/data/selectors";
import type { RepairRequest } from "@/dashboard/types";

const PRIORITY_RANK: Record<RepairRequest["priority"], number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function MDDashboard() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests } = useDashboardData();
  if (!user) return null;

  const stats = getAdminStats(equipment, repairRequests);
  const activeFaults = stats.openFaults;
  const queue = [...getMdQueue(repairRequests)].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);

  // Management view: priority and cost first, technical detail stays on the request page.
  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.id}</span> },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Estimated Cost", cell: (rr) => (rr.estimatedCost ? formatNaira(rr.estimatedCost) : "—") },
    { header: "Supervisor Approved", cell: (rr) => formatDate(rr.supervisorApproval?.timestamp ?? null) },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description="Management-level view of fleet risk, cost and approvals." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard label="Total Equipment" value={stats.totalEquipment} />
        <StatCard label="Active Faults" value={activeFaults} tone="warning" />
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
