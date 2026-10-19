import { useNavigate } from "react-router-dom";
import { PageHeader, DataTable, StatusBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, formatDate, formatNaira } from "@/dashboard/data/selectors";
import type { RepairRequest } from "@/dashboard/types";

export default function RepairHistory() {
  const navigate = useNavigate();
  const { equipment, repairRequests } = useDashboardData();
  const completed = repairRequests
    .filter((rr) => ["Repair Completed", "Closed"].includes(rr.status))
    .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime());

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.id}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault Type", cell: (rr) => rr.faultType },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Completed", cell: (rr) => formatDate(rr.completedAt) },
    {
      header: "Total Cost",
      cell: (rr) => formatNaira(rr.repairActions.reduce((sum, a) => sum + a.totalCost, 0)),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Repair History" description="Completed and closed repairs across all equipment." />
      <DataTable
        columns={columns}
        rows={completed}
        getRowKey={(rr) => rr.id}
        onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
        emptyMessage="No completed repairs yet."
      />
    </div>
  );
}
