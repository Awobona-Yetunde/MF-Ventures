import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, DataTable, StatusBadge, PriorityBadge, FilterGroup, FilterChip, EmptyState } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession, getErrorMessage } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getRequestsReportedBy, formatDate } from "@/dashboard/data/selectors";
import { FAULT_TYPE_LABEL, PRIORITY_LABEL, REPAIR_STATUS_LABEL } from "@/dashboard/data/labels";
import type { Priority, RepairRequest, RepairStatus } from "@/dashboard/types";

const STATUS_OPTIONS: Array<RepairStatus | "All"> = [
  "All",
  "pending_supervisor_approval",
  "pending_md_approval",
  "repair_in_progress",
  "pending_parts",
  "rejected_returned",
];

const PRIORITY_OPTIONS: Array<Priority | "All"> = ["All", "critical", "high", "medium", "low"];

export default function RepairRequestsList() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests, repairRequestsLoading, refreshRepairRequests } = useDashboardData();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<RepairStatus | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");

  // Each visit to this page fetches the current list itself, rather than
  // only relying on the one fetch that ran right after login.
  useEffect(() => {
    setLoadError(null);
    refreshRepairRequests().catch((err) => setLoadError(getErrorMessage(err)));
  }, [refreshRepairRequests]);

  // Mechanics get a "Limited" view per the spec's permissions table — their
  // own reports only. Every other role sees the full list. Completed and
  // closed requests move to Repair History once they're done, so they're
  // excluded here for everyone.
  const activeRequests = repairRequests.filter((rr) => rr.status !== "repair_completed" && rr.status !== "closed");
  const visibleRequests = user?.role === "mechanic" ? getRequestsReportedBy(activeRequests, user.id) : activeRequests;

  const filtered = useMemo(() => {
    return visibleRequests
      .filter((rr) => {
        const matchesStatus = status === "All" || rr.status === status;
        const matchesPriority = priority === "All" || rr.priority === priority;
        return matchesStatus && matchesPriority;
      })
      .sort((a, b) => new Date(b.faultDatetime).getTime() - new Date(a.faultDatetime).getTime());
  }, [visibleRequests, status, priority]);

  if (!user) return null;

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault Type", cell: (rr) => FAULT_TYPE_LABEL[rr.faultType] },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.faultDatetime) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repair Requests"
        description={
          user.role === "mechanic"
            ? "Every open fault you've reported. Completed repairs move to Repair History."
            : "Every open fault report. Completed repairs move to Repair History."
        }
        actions={
          (user.role === "mechanic" || user.role === "admin") && (
            <Button size="md" onClick={() => navigate("/dashboard/report-fault")}>
              + Report Fault
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <FilterGroup label="Status">
          {STATUS_OPTIONS.map((s) => (
            <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
              {s === "All" ? "All" : REPAIR_STATUS_LABEL[s]}
            </FilterChip>
          ))}
        </FilterGroup>
        <FilterGroup label="Priority">
          {PRIORITY_OPTIONS.map((p) => (
            <FilterChip key={p} active={priority === p} onClick={() => setPriority(p)}>
              {p === "All" ? "All" : PRIORITY_LABEL[p]}
            </FilterChip>
          ))}
        </FilterGroup>
      </div>

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

      {repairRequestsLoading && repairRequests.length === 0 ? (
        <EmptyState message="Loading repair requests…" />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="No repair requests match these filters."
        />
      )}
    </div>
  );
}
