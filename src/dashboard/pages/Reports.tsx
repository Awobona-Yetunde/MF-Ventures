import { PageHeader, StatCard } from "@/dashboard/components";
import { Button } from "@/components/ui";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { formatNaira } from "@/dashboard/data/selectors";
import type { RepairStatus } from "@/dashboard/types";

const STATUS_GROUPS: RepairStatus[] = [
  "Pending Supervisor Approval",
  "Pending MD Approval",
  "Repair In Progress",
  "Pending Parts",
  "Repair Completed",
  "Rejected / Returned",
];

export default function Reports() {
  const { equipment, repairRequests } = useDashboardData();
  const openCount = repairRequests.filter((rr) => !["Repair Completed", "Closed", "Cancelled"].includes(rr.status)).length;
  const closedCount = repairRequests.length - openCount;

  const costByEquipment = equipment
    .map((eq) => ({ name: eq.name, cost: eq.totalMaintenanceCost }))
    .sort((a, b) => b.cost - a.cost);
  const maxEquipmentCost = Math.max(...costByEquipment.map((e) => e.cost));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Analytics"
        description="Maintenance activity, costs, and repair performance across the fleet."
        actions={
          <Button variant="secondary" className="border border-ink/10">
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open vs Completed" value={`${openCount} / ${closedCount}`} />
        <StatCard label="Monthly Repair Count" value={repairRequests.length} />
        <StatCard
          label="Critical / Emergency Faults"
          value={repairRequests.filter((rr) => rr.priority === "Critical").length}
          tone="danger"
        />
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Maintenance cost by equipment</h2>
        <div className="mt-5 space-y-3">
          {costByEquipment.map((eq) => (
            <div key={eq.name} className="flex items-center gap-4">
              <span className="w-40 shrink-0 truncate text-sm text-ink">{eq.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-brand-blue/80"
                  style={{ width: `${(eq.cost / maxEquipmentCost) * 100}%` }}
                />
              </div>
              <span className="w-28 shrink-0 text-right text-sm font-semibold text-ink">{formatNaira(eq.cost)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Requests by status</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STATUS_GROUPS.map((status) => (
            <div key={status} className="rounded-md bg-surface/60 p-3">
              <p className="text-xs text-muted">{status}</p>
              <p className="mt-1 text-lg font-extrabold text-ink">
                {repairRequests.filter((rr) => rr.status === status).length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
