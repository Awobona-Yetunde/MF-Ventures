import { useEffect, useState } from "react";
import { PageHeader, StatCard } from "@/dashboard/components";
import { Button } from "@/components/ui";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getErrorMessage } from "@/dashboard/state/DashboardProvider";
import { getDashboardSummary, getEquipmentDowntimeReport, getMaintenanceCostReport } from "@/dashboard/api/reports";
import type { ReportPayload } from "@/dashboard/api/reports";
import { formatNaira, getMonthlyEquipmentActivity } from "@/dashboard/data/selectors";
import { REPAIR_STATUS_LABEL } from "@/dashboard/data/labels";
import type { RepairStatus } from "@/dashboard/types";

const STATUS_GROUPS: RepairStatus[] = [
  "pending_supervisor_approval",
  "pending_md_approval",
  "repair_in_progress",
  "pending_parts",
  "repair_completed",
  "rejected_returned",
];

export default function Reports() {
  const { equipment, repairRequests, refreshEquipment, refreshRepairRequests } = useDashboardData();

  useEffect(() => {
    refreshEquipment().catch(() => {});
    refreshRepairRequests().catch(() => {});
  }, [refreshEquipment, refreshRepairRequests]);

  const [backendReports, setBackendReports] = useState<{
    dashboard: ReportPayload | null;
    maintenanceCost: ReportPayload | null;
    equipmentDowntime: ReportPayload | null;
  }>({ dashboard: null, maintenanceCost: null, equipmentDowntime: null });
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // These three backend endpoints leave their response shape undeclared in
  // the API spec, so the payloads are fetched and rendered generically below
  // rather than mapped into hardcoded fields.
  useEffect(() => {
    let cancelled = false;
    setReportsLoading(true);
    Promise.all([getDashboardSummary(), getMaintenanceCostReport(), getEquipmentDowntimeReport()])
      .then(([dashboard, maintenanceCost, equipmentDowntime]) => {
        if (!cancelled) setBackendReports({ dashboard, maintenanceCost, equipmentDowntime });
      })
      .catch((err) => {
        if (!cancelled) setReportsError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setReportsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCount = repairRequests.filter(
    (rr) => !["repair_completed", "closed", "cancelled"].includes(rr.status),
  ).length;
  const closedCount = repairRequests.length - openCount;

  const costByEquipment = equipment.map((eq) => ({ name: eq.name, cost: eq.totalMaintenanceCost })).sort((a, b) => b.cost - a.cost);
  const maxEquipmentCost = Math.max(1, ...costByEquipment.map((e) => e.cost));

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const monthlyActivity = getMonthlyEquipmentActivity(equipment, repairRequests, now.getFullYear(), now.getMonth());

  function handleExport() {
    const payload = {
      generatedAt: new Date().toISOString(),
      openCount,
      closedCount,
      totalRequests: repairRequests.length,
      maintenanceCostByEquipment: costByEquipment,
      requestsByStatus: Object.fromEntries(STATUS_GROUPS.map((s) => [s, repairRequests.filter((rr) => rr.status === s).length])),
      monthlyActivity: { month: monthLabel, rows: monthlyActivity },
      backendReports,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mf-ventures-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Analytics"
        description="Maintenance activity, costs, and repair performance across the fleet."
        actions={
          <Button variant="secondary" className="border border-ink/10" onClick={handleExport}>
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open vs Completed" value={`${openCount} / ${closedCount}`} />
        <StatCard label="Total Repair Requests" value={repairRequests.length} />
        <StatCard label="Critical / Emergency Faults" value={repairRequests.filter((rr) => rr.priority === "critical").length} tone="danger" />
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Maintenance cost by equipment</h2>
        {costByEquipment.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No equipment on record yet.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {costByEquipment.map((eq) => (
              <div key={eq.name} className="flex items-center gap-4">
                <span className="w-40 shrink-0 truncate text-sm text-ink">{eq.name}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-brand-blue/80" style={{ width: `${(eq.cost / maxEquipmentCost) * 100}%` }} />
                </div>
                <span className="w-28 shrink-0 text-right text-sm font-semibold text-ink">{formatNaira(eq.cost)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Requests by status</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STATUS_GROUPS.map((status) => (
            <div key={status} className="rounded-md bg-surface/60 p-3">
              <p className="text-xs text-muted">{REPAIR_STATUS_LABEL[status]}</p>
              <p className="mt-1 text-lg font-extrabold text-ink">{repairRequests.filter((rr) => rr.status === status).length}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Monthly equipment activity — {monthLabel}</h2>
        <p className="mt-1 text-sm text-muted">
          Active working days are the days in the month minus idle days caused by a fault, measured from when the
          fault was reported to when the repair was completed.
        </p>
        {monthlyActivity.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No equipment on record yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-max text-left text-sm">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="px-3 py-2 font-semibold text-muted">Equipment</th>
                  <th className="px-3 py-2 font-semibold text-muted">Days in Month</th>
                  <th className="px-3 py-2 font-semibold text-muted">Idle Days</th>
                  <th className="px-3 py-2 font-semibold text-muted">Active Working Days</th>
                </tr>
              </thead>
              <tbody>
                {monthlyActivity.map((row) => (
                  <tr key={row.equipmentId} className="border-b border-black/5 last:border-0">
                    <td className="px-3 py-2 font-medium text-ink">{row.equipmentName}</td>
                    <td className="px-3 py-2 text-ink">{row.daysInMonth}</td>
                    <td className="px-3 py-2 text-ink">{row.idleDays}</td>
                    <td className="px-3 py-2 font-semibold text-ink">{row.activeWorkingDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Backend reports</h2>
        <p className="mt-1 text-sm text-muted">Figures returned directly by the reporting API.</p>

        {reportsError && <p className="mt-3 text-sm font-medium text-red-600">{reportsError}</p>}

        {reportsLoading ? (
          <p className="mt-3 text-sm text-muted">Loading…</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ReportBlock title="Dashboard Summary" payload={backendReports.dashboard} />
            <ReportBlock title="Maintenance Cost" payload={backendReports.maintenanceCost} />
            <ReportBlock title="Equipment Downtime" payload={backendReports.equipmentDowntime} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders an untyped report payload as a plain key/value list, since these three endpoints don't declare a response schema to map fields against. */
function ReportBlock({ title, payload }: { title: string; payload: ReportPayload | null }) {
  const entries = payload ? Object.entries(payload) : [];
  return (
    <div className="rounded-md bg-surface/60 p-4">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-muted">No data returned.</p>
      ) : (
        <dl className="mt-2 space-y-1">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-3 text-sm">
              <dt className="truncate text-muted">{key}</dt>
              <dd className="shrink-0 font-semibold text-ink">{formatReportValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function formatReportValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
