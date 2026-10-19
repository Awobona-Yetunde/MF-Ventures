import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, DataTable, StatusBadge, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getAdminStats, getEquipmentById, formatNaira, formatDate } from "@/dashboard/data/selectors";
import type { RepairRequest } from "@/dashboard/types";

// Mock monthly maintenance spend — stands in for a real aggregation query.
const MONTHLY_COST_TREND = [
  { month: "May", amount: 420_000 },
  { month: "Jun", amount: 610_000 },
  { month: "Jul", amount: 340_000 },
  { month: "Aug", amount: 780_000 },
  { month: "Sep", amount: 905_000 },
  { month: "Oct", amount: 650_000 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { equipment, repairRequests, users } = useDashboardData();
  const stats = getAdminStats(equipment, repairRequests);
  const recentRequests = [...repairRequests]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5);

  const maxCost = Math.max(...MONTHLY_COST_TREND.map((m) => m.amount));

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.id}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.reportedAt) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Admin Dashboard" description="System-wide overview of equipment, repairs, and approvals." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Equipment" value={stats.totalEquipment} />
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Open Faults" value={stats.openFaults} tone="warning" />
        <StatCard label="Repairs In Progress" value={stats.repairsInProgress} />
        <StatCard label="Pending Supervisor Approval" value={stats.pendingSupervisorApprovals} tone="warning" />
        <StatCard label="Pending MD Approval" value={stats.pendingMdApprovals} tone="warning" />
        <StatCard label="Pending Parts" value={stats.pendingParts} tone="danger" />
        <StatCard label="Completed Repairs" value={stats.completedRepairs} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Maintenance cost trend (last 6 months)</h2>
            <span className="text-sm font-semibold text-ink">{formatNaira(stats.totalMaintenanceCost)} total</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-4">
            {MONTHLY_COST_TREND.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-brand-blue/80"
                    style={{ height: `${(m.amount / maxCost) * 100}%` }}
                    title={formatNaira(m.amount)}
                  />
                </div>
                <span className="text-xs font-medium text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">Total Maintenance Cost</h2>
          <p className="mt-3 text-3xl font-extrabold text-ink">{formatNaira(stats.totalMaintenanceCost)}</p>
          <p className="mt-1 text-sm text-muted">Across {stats.totalEquipment} equipment records</p>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Recent repair requests</h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard/repair-requests")}
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            View all
          </button>
        </div>
        <DataTable
          columns={columns}
          rows={recentRequests}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
        />
      </div>
    </div>
  );
}
