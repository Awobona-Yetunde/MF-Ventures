import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, StatusBadge, PriorityBadge, EmptyState, ApprovalPanel, RepairActionForm } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getRepairRequestById, getUserById, formatDateTime, formatNaira } from "@/dashboard/data/selectors";
import type { ApprovalDecision, ApprovalRecord } from "@/dashboard/types";

export default function RepairRequestDetail() {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useDashboardSession();
  const {
    equipment,
    repairRequests,
    users,
    decideSupervisor,
    decideMd,
    addRepairAction,
    setPendingParts,
    resumeRepair,
    markCompleted,
  } = useDashboardData();

  const request = requestId ? getRepairRequestById(repairRequests, requestId) : undefined;

  if (!user) return null;
  if (!request) {
    return <EmptyState message="Repair request not found." />;
  }

  const equipmentItem = getEquipmentById(equipment, request.equipmentId);
  const totalCost = request.repairActions.reduce((sum, a) => sum + a.totalCost, 0);
  const assignedSupervisor = getUserById(users, request.assignedSupervisorId);

  // Who may act, and what, at this request's current stage.
  const canDecideAsSupervisor =
    user.role === "supervisor" &&
    request.status === "Pending Supervisor Approval" &&
    request.assignedSupervisorId === user.id &&
    request.reportedByUserId !== user.id;

  const canDecideAsMd = user.role === "md" && request.status === "Pending MD Approval";

  const isOwningMechanic = request.reportedByUserId === user.id;
  const canLogRepairAction =
    (user.role === "mechanic" && isOwningMechanic) ||
    user.role === "admin";
  const repairIsActive = request.status === "Repair In Progress" || request.status === "Pending Parts";

  function handleSupervisorDecision(decision: ApprovalDecision, comment: string) {
    decideSupervisor(request!.id, decision, comment, user!);
  }

  function handleMdDecision(decision: ApprovalDecision, comment: string) {
    decideMd(request!.id, decision, comment, user!);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={request.id}
        description={equipmentItem ? `${equipmentItem.name} · ${equipmentItem.site}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <PriorityBadge priority={request.priority} />
            <StatusBadge status={request.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Fault details */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Fault Details">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <Field label="Fault Type" value={request.faultType} />
              <Field label="Reported" value={formatDateTime(request.reportedAt)} />
              <Field label="Fault Reported By" value={request.faultReportedBy} />
              <Field label="Fault Detected By" value={request.faultDetectedBy} />
              {equipmentItem && (
                <>
                  <Field label="Registration Number" value={equipmentItem.registrationNumber} />
                  <Field label="Serial Number" value={equipmentItem.serialNumber} />
                </>
              )}
            </dl>
            <div className="mt-4">
              <dt className="text-xs font-medium tracking-wide text-muted uppercase">Fault Description</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{request.faultDescription}</dd>
            </div>
            <div className="mt-4">
              <dt className="text-xs font-medium tracking-wide text-muted uppercase">Repair Recommendation</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{request.repairRecommendation}</dd>
            </div>
          </Card>

          <Card title="Approval Trail">
            <div className="space-y-4">
              <ApprovalStep label={`Supervisor Approval${assignedSupervisor ? ` · ${assignedSupervisor.name}` : ""}`} record={request.supervisorApproval} />
              <ApprovalStep label="MD Final Approval" record={request.mdApproval} />
            </div>

            {canDecideAsSupervisor && <div className="mt-5">
              <ApprovalPanel stage="Supervisor" onDecide={handleSupervisorDecision} />
            </div>}
            {canDecideAsMd && <div className="mt-5">
              <ApprovalPanel stage="MD" onDecide={handleMdDecision} />
            </div>}
          </Card>

          <Card title="Repair Action Log">
            {request.repairActions.length === 0 ? (
              <p className="text-sm text-muted">No repair actions have been logged yet.</p>
            ) : (
              <div className="space-y-4">
                {request.repairActions.map((action) => (
                  <div key={action.id} className="rounded-md border border-black/5 bg-surface/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">{action.action}</p>
                      <p className="text-xs text-muted">{action.date}</p>
                    </div>
                    {action.partsUsed && (
                      <p className="mt-1 text-sm text-muted">
                        {action.partsUsed} {action.quantity ? `× ${action.quantity}` : ""}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted">Performed by {action.performedBy}</span>
                      <span className="font-semibold text-ink">{formatNaira(action.totalCost)}</span>
                    </div>
                    {action.notes && <p className="mt-1 text-sm text-muted">{action.notes}</p>}
                  </div>
                ))}
              </div>
            )}

            {canLogRepairAction && repairIsActive && (
              <div className="mt-5 space-y-4">
                <RepairActionForm onSubmit={(input) => addRepairAction(request.id, input, user)} />

                <div className="flex flex-wrap gap-2">
                  {request.status === "Repair In Progress" && (
                    <Button variant="secondary" size="md" className="border border-ink/10" onClick={() => setPendingParts(request.id)}>
                      Mark Waiting on Parts
                    </Button>
                  )}
                  {request.status === "Pending Parts" && (
                    <Button variant="secondary" size="md" className="border border-ink/10" onClick={() => resumeRepair(request.id)}>
                      Resume Repair
                    </Button>
                  )}
                  <Button
                    size="md"
                    disabled={request.repairActions.length === 0}
                    onClick={() => markCompleted(request.id)}
                  >
                    Mark Repair Completed
                  </Button>
                </div>
                {request.repairActions.length === 0 && (
                  <p className="text-xs text-muted">Log at least one repair action before marking this completed.</p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar: costs + equipment link */}
        <div className="space-y-6">
          <Card title="Costs">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Estimated cost</span>
              <span className="font-semibold text-ink">
                {request.estimatedCost ? formatNaira(request.estimatedCost) : "—"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted">Actual cost to date</span>
              <span className="font-semibold text-ink">{formatNaira(totalCost)}</span>
            </div>
            <div className="mt-4 border-t border-black/5 pt-4 text-xs text-muted">
              All costs on this request stay linked to {request.id} for traceability.
            </div>
          </Card>

          <Card title="Equipment">
            {equipmentItem ? (
              <>
                <p className="text-sm font-semibold text-ink">{equipmentItem.name}</p>
                <p className="mt-1 text-sm text-muted">{equipmentItem.location}</p>
                <Link
                  to={`/dashboard/equipment/${equipmentItem.id}`}
                  className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
                >
                  View equipment profile →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted">Equipment record unavailable.</p>
            )}
          </Card>

          {request.completedAt && (
            <Card title="Completion">
              <p className="text-sm text-ink">Repair verified and completed.</p>
              <p className="mt-1 text-sm text-muted">{formatDateTime(request.completedAt)}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function ApprovalStep({ label, record }: { label: string; record: ApprovalRecord | null }) {
  if (!record) {
    return (
      <div className="rounded-md border border-dashed border-black/10 p-4">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-sm text-muted">Awaiting decision.</p>
      </div>
    );
  }

  const decisionTone =
    record.decision === "Approved"
      ? "text-emerald-700"
      : record.decision === "Rejected / Returned"
        ? "text-red-700"
        : "text-amber-700";

  return (
    <div className="rounded-md border border-black/5 bg-surface/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <span className={`text-sm font-semibold ${decisionTone}`}>{record.decision}</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {record.userName} · {formatDateTime(record.timestamp)}
      </p>
      {record.comment && <p className="mt-2 text-sm text-ink">"{record.comment}"</p>}
    </div>
  );
}
