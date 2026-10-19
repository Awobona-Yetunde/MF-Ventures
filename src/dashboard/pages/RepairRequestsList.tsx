import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, DataTable, StatusBadge, PriorityBadge, FilterGroup, FilterChip } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getRequestsReportedBy, formatDate } from "@/dashboard/data/selectors";
import type { Priority, RepairRequest, RepairStatus } from "@/dashboard/types";

const STATUS_OPTIONS: Array<RepairStatus | "All"> = [
  "All",
  "Pending Supervisor Approval",
  "Pending MD Approval",
  "Repair In Progress",
  "Pending Parts",
  "Repair Completed",
  "Rejected / Returned",
];

const PRIORITY_OPTIONS: Array<Priority | "All"> = ["All", "Critical", "High", "Medium", "Low"];

export default function RepairRequestsList() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, repairRequests } = useDashboardData();
  const [status, setStatus] = useState<RepairStatus | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");

  // Mechanics get a "Limited" view per the spec's permissions table — their
  // own reports only. Every other role sees the full list.
  const visibleRequests = user?.role === "mechanic" ? getRequestsReportedBy(repairRequests, user.id) : repairRequests;

  const filtered = useMemo(() => {
    return visibleRequests
      .filter((rr) => {
        const matchesStatus = status === "All" || rr.status === status;
        const matchesPriority = priority === "All" || rr.priority === priority;
        return matchesStatus && matchesPriority;
      })
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  }, [visibleRequests, status, priority]);

  if (!user) return null;

  const columns: Column<RepairRequest>[] = [
    { header: "Request ID", cell: (rr) => <span className="font-semibold">{rr.id}</span> },
    { header: "Equipment", cell: (rr) => getEquipmentById(equipment, rr.equipmentId)?.name ?? "—" },
    { header: "Fault Type", cell: (rr) => rr.faultType },
    { header: "Priority", cell: (rr) => <PriorityBadge priority={rr.priority} /> },
    { header: "Status", cell: (rr) => <StatusBadge status={rr.status} /> },
    { header: "Reported", cell: (rr) => formatDate(rr.reportedAt) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repair Requests"
        description={
          user.role === "mechanic" ? "Every fault you've reported, from submission to closure." : "Every fault report, from submission to closure."
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
              {s}
            </FilterChip>
          ))}
        </FilterGroup>
        <FilterGroup label="Priority">
          {PRIORITY_OPTIONS.map((p) => (
            <FilterChip key={p} active={priority === p} onClick={() => setPriority(p)}>
              {p}
            </FilterChip>
          ))}
        </FilterGroup>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(rr) => rr.id}
        onRowClick={(rr) => navigate(`/dashboard/repair-requests/${rr.id}`)}
        emptyMessage="No repair requests match these filters."
      />
    </div>
  );
}
