import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, DataTable, StatusBadge, PriorityBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getAdminStats, getEquipmentById, formatNaira, formatDate } from "@/dashboard/data/selectors";
import { EQUIPMENT_STATUS_LABEL } from "@/dashboard/data/labels";
import type { EquipmentStatus, RepairRequest } from "@/dashboard/types";

const EQUIPMENT_STATUSES: EquipmentStatus[] = ["operational", "under_maintenance", "out_of_service"];

const STATUS_BAR_COLOR: Record<EquipmentStatus, string> = {
  operational: "bg-emerald-500",
  under_maintenance: "bg-amber-500",
  out_of_service: "bg-red-500",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { equipment, repairRequests, users, refreshEquipment, refreshRepairRequests, refreshUsers } = useDashboardData();

  // Best-effort refresh on every visit so this screen doesn't rely solely
  // on the one fetch that ran right after login.
  useEffect(() => {
    refreshEquipment().catch(() => {});
    refreshRepairRequests().catch(() => {});
    refreshUsers().catch(() => {});
  }, [refreshEquipment, refreshRepairRequests, refreshUsers]);

  const stats = getAdminStats(equipment, repairRequests);
  const recentRequests = [...repairRequests]
    .sort((a, b) => new Date(b.faultDatetime).getTime() - new Date(a.faultDatetime).getTime())
    .slice(0, 5);

  // Real counts from the equipment register — replaces what used to be a
  // placeholder cost-trend chart with numbers that don't correspond to
  // any actual backend data.
  const statusCounts = useMemo(
    () => EQUIPMENT_STATUSES.map((s) => ({ status: s, count: equipment.filter((eq) => eq.status === s).length })),
    [equipment],
  );
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.faultDatetime) },
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
            <h2 className="text-sm font-semibold text-ink">Equipment by status</h2>
            <span className="text-sm font-semibold text-ink">{equipment.length} total</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-4">
            {statusCounts.map((s) => (
              <div key={s.status} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <div
                    className={`w-full rounded-t-md ${STATUS_BAR_COLOR[s.status]}`}
                    style={{ height: `${(s.count / maxStatusCount) * 100}%` }}
                    title={`${s.count} equipment`}
                  />
                </div>
                <span className="text-xs font-medium text-muted">{EQUIPMENT_STATUS_LABEL[s.status]}</span>
                <span className="text-sm font-semibold text-ink">{s.count}</span>
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
