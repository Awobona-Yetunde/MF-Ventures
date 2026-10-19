import { PageHeader, DataTable, StatCard } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, isOpenRequest, formatNaira } from "@/dashboard/data/selectors";
import type { RepairAction } from "@/dashboard/types";

interface CostRow extends RepairAction {
  requestId: string;
  equipmentName: string;
}

export default function CostsParts() {
  const { equipment, repairRequests } = useDashboardData();

  const rows: CostRow[] = repairRequests.flatMap((rr) =>
    rr.repairActions.map((action) => ({
      ...action,
      requestId: rr.id,
      equipmentName: getEquipmentById(equipment, rr.equipmentId)?.name ?? "—",
    })),
  );

  const totalLogged = rows.reduce((sum, r) => sum + r.totalCost, 0);
  const totalEstimated = repairRequests
    .filter((rr) => isOpenRequest(rr.status))
    .reduce((sum, rr) => sum + (rr.estimatedCost ?? 0), 0);

  const columns: Column<CostRow>[] = [
    { header: "Request ID", cell: (r) => <span className="font-semibold">{r.requestId}</span> },
    { header: "Equipment", cell: (r) => r.equipmentName },
    { header: "Action", cell: (r) => r.action },
    { header: "Parts Used", cell: (r) => r.partsUsed ?? "—" },
    { header: "Performed By", cell: (r) => r.performedBy },
    { header: "Date", cell: (r) => r.date },
    { header: "Total Cost", cell: (r) => <span className="font-semibold">{formatNaira(r.totalCost)}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Costs / Parts" description="Every logged repair cost, traceable to its Repair Request ID." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total Logged Cost" value={formatNaira(totalLogged)} />
        <StatCard label="Total Estimated (Open Requests)" value={formatNaira(totalEstimated)} tone="warning" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        emptyMessage="No repair costs have been logged yet."
      />
    </div>
  );
}
