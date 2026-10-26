import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, DataTable, StatusBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession, getErrorMessage } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, formatDate, formatNaira } from "@/dashboard/data/selectors";
import { FAULT_TYPE_LABEL } from "@/dashboard/data/labels";
import { downloadRepairReportPdf } from "@/dashboard/lib/repairReportPdf";
import type { RepairRequest } from "@/dashboard/types";

export default function RepairHistory() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, users, repairRequests, repairRequestsLoading, refreshRepairRequests, loadRepairRequestDetail } = useDashboardData();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    setLoadError(null);
    refreshRepairRequests().catch((err) => setLoadError(getErrorMessage(err)));
  }, [refreshRepairRequests]);

  const canDownload = user?.role === "supervisor" || user?.role === "md" || user?.role === "admin";

  // The backend doesn't record a separate "completed at" timestamp, so the
  // most recent update to a completed/closed request is used as the
  // completion date — this is the closest accurate proxy available.
  const completed = useMemo(
    () =>
      repairRequests
        .filter((rr) => rr.status === "repair_completed" || rr.status === "closed")
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [repairRequests],
  );

  async function handleDownload(rr: RepairRequest) {
    setDownloadError(null);
    setDownloadingId(rr.id);
    try {
      // The list only carries the basic shape — fetch the full detail
      // (approvals, repair actions) before building the report.
      const detail = await loadRepairRequestDetail(rr.id);
      downloadRepairReportPdf(detail, getEquipmentById(equipment, detail.equipmentId), users);
    } catch (err) {
      setDownloadError(getErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  }

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault Type", cell: (rr) => FAULT_TYPE_LABEL[rr.faultType] },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Completed", cell: (rr) => formatDate(rr.updatedAt) },
    { header: "Estimated Cost", cell: (rr) => (rr.estimatedCost ? formatNaira(rr.estimatedCost) : "—") },
    ...(canDownload
      ? [
          {
            header: "Report",
            cell: (rr: RepairRequest) => (
              <span onClick={(e: MouseEvent) => e.stopPropagation()} className="inline-block">
                <Button
                  variant="secondary"
                  size="md"
                  className="border border-ink/10"
                  disabled={downloadingId === rr.id}
                  onClick={() => handleDownload(rr)}
                >
                  {downloadingId === rr.id ? "Preparing…" : "Download PDF"}
                </Button>
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Repair History" description="Completed and closed repairs across all equipment." />

      {loadError && (
        <div className="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{loadError}</span>
          <Button
            variant="secondary"
            size="md"
            className="border border-red-300"
            onClick={() => {
              setLoadError(null);
              refreshRepairRequests().catch((err) => setLoadError(getErrorMessage(err)));
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {downloadError && <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{downloadError}</div>}

      {repairRequestsLoading && repairRequests.length === 0 ? (
        <p className="text-sm text-muted">Loading repair history…</p>
      ) : (
        <DataTable
          columns={columns}
          rows={completed}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="No completed repairs yet."
        />
      )}
    </div>
  );
}
