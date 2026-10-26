import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, DataTable, StatusBadge, PriorityBadge, FilterGroup, FilterChip, EmptyState } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, formatDate } from "@/dashboard/data/selectors";
import { FAULT_TYPE_LABEL, PRIORITY_LABEL } from "@/dashboard/data/labels";
import type { Priority, RepairRequest } from "@/dashboard/types";

const PRIORITY_OPTIONS: Array<Priority | "All"> = ["All", "critical", "high", "medium", "low"];

export default function ApprovalQueue() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, approvalQueue, approvalQueueLoading, refreshApprovalQueue } = useDashboardData();
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [site, setSite] = useState<string | "All">("All");

  useEffect(() => {
    refreshApprovalQueue();
  }, [refreshApprovalQueue]);

  const sites = useMemo(
    () => Array.from(new Set(equipment.map((eq) => eq.assignedSite).filter((s): s is string => Boolean(s)))),
    [equipment],
  );

  const filtered = useMemo(() => {
    return approvalQueue.filter((rr) => {
      const eq = getEquipmentById(equipment, rr.equipmentId);
      const matchesPriority = priority === "All" || rr.priority === priority;
      const matchesSite = site === "All" || eq?.assignedSite === site;
      return matchesPriority && matchesSite;
    });
  }, [approvalQueue, equipment, priority, site]);

  if (!user) return null;

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.requestNumber}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Site", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.assignedSite ?? "—" },
    { header: "Fault Type", cell: (rr) => FAULT_TYPE_LABEL[rr.faultType] },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.faultDatetime) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Queue"
        description={
          user.role === "md"
            ? "Requests awaiting your final approval."
            : "Requests routed to you for first-stage approval."
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <FilterGroup label="Priority">
          {PRIORITY_OPTIONS.map((p) => (
            <FilterChip key={p} active={priority === p} onClick={() => setPriority(p)}>
              {p === "All" ? "All" : PRIORITY_LABEL[p]}
            </FilterChip>
          ))}
        </FilterGroup>
        <FilterGroup label="Site">
          <FilterChip active={site === "All"} onClick={() => setSite("All")}>
            All
          </FilterChip>
          {sites.map((s) => (
            <FilterChip key={s} active={site === s} onClick={() => setSite(s)}>
              {s}
            </FilterChip>
          ))}
        </FilterGroup>
      </div>

      {approvalQueueLoading && approvalQueue.length === 0 ? (
        <EmptyState message="Loading your approval queue…" />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(rr) => rr.id}
          onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
          emptyMessage="Nothing in your queue right now."
        />
      )}
    </div>
  );
}
