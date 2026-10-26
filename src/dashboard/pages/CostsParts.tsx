import { useEffect, useMemo, useState } from "react";
import { PageHeader, DataTable, StatCard, EmptyState } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getErrorMessage } from "@/dashboard/state/DashboardProvider";
import { listRepairActions } from "@/dashboard/api/repairActions";
import { getEquipmentById, getUserDisplayName, isOpenRequest, formatDate, formatNaira } from "@/dashboard/data/selectors";
import type { RepairAction } from "@/dashboard/types";

interface CostRow extends RepairAction {
  requestNumber: string;
  equipmentName: string;
}

export default function CostsParts() {
  const { equipment, users, repairRequests, repairRequestsLoading } = useDashboardData();
  const [actionsByRequest, setActionsByRequest] = useState<Record<string, RepairAction[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The list endpoint doesn't embed repair actions, so every request's cost
  // log is fetched individually once the request list is in hand.
  useEffect(() => {
    if (repairRequests.length === 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(repairRequests.map((rr) => listRepairActions(rr.id).then((actions) => [rr.id, actions] as const)))
      .then((pairs) => {
        if (cancelled) return;
        setActionsByRequest(Object.fromEntries(pairs));
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repairRequests]);

  const rows: CostRow[] = useMemo(
    () =>
      repairRequests.flatMap((rr) =>
        (actionsByRequest[rr.id] ?? []).map((action) => ({
          ...action,
          requestNumber: rr.requestNumber,
          equipmentName: getEquipmentById(equipment, rr.equipmentId)?.name ?? "—",
        })),
      ),
    [repairRequests, actionsByRequest, equipment],
  );

  const totalLogged = rows.reduce((sum, r) => sum + r.totalCost, 0);
  const totalEstimated = repairRequests
    .filter((rr) => isOpenRequest(rr.status))
    .reduce((sum, rr) => sum + (rr.estimatedCost ?? 0), 0);

  const columns: Column<CostRow>[] = [
    { header: "Request ID", cell: (r) => <span className="font-semibold">{r.requestNumber}</span> },
    { header: "Equipment", cell: (r) => r.equipmentName },
    { header: "Action", cell: (r) => r.actionTaken },
    { header: "Parts Used", cell: (r) => r.partsMaterialsUsed ?? "—" },
    { header: "Performed By", cell: (r) => getUserDisplayName(users, r.performedById) },
    { header: "Date", cell: (r) => formatDate(r.actionDate) },
    { header: "Total Cost", cell: (r) => <span className="font-semibold">{formatNaira(r.totalCost)}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Costs / Parts" description="Every logged repair cost, traceable to its Repair Request ID." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total Logged Cost" value={formatNaira(totalLogged)} />
        <StatCard label="Total Estimated (Open Requests)" value={formatNaira(totalEstimated)} tone="warning" />
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      {(repairRequestsLoading || loading) && rows.length === 0 ? (
        <EmptyState message="Loading repair costs…" />
      ) : (
        <DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} emptyMessage="No repair costs have been logged yet." />
      )}
    </div>
  );
}
