import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, StatusBadge, PriorityBadge, EmptyState, ApprovalPanel, RepairActionForm } from "@/dashboard/components";
import { useDashboardData, useDashboardSession, getErrorMessage } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getIdleDays, getRepairRequestById, getUserDisplayName, formatDate, formatDateTime, formatNaira } from "@/dashboard/data/selectors";
import { FAULT_TYPE_LABEL, APPROVAL_DECISION_LABEL, APPROVAL_DECISION_STYLE } from "@/dashboard/data/labels";
import { downloadRepairReportPdf } from "@/dashboard/lib/repairReportPdf";
import type { ApprovalDecision, ApprovalRecord, ApprovalStage, User } from "@/dashboard/types";

export default function RepairRequestDetail() {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useDashboardSession();
  const {
    equipment,
    repairRequests,
    users,
    loadRepairRequestDetail,
    decideSupervisor,
    decideMd,
    addRepairAction,
    setPendingParts,
    resumeRepair,
    startRepair,
    completeRepair,
    closeRepair,
    cancelRepairRequest,
    assignMechanic,
  } = useDashboardData();

  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedMechanicId, setSelectedMechanicId] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  // The list views only ever hand us the "basic" shape of a repair request
  // (no approvals, repair actions, attachments, or audit trail) — this page
  // needs the full detail, so it fetches it itself every time it's opened,
  // rather than only after some mutation happens to trigger a refetch.
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    loadRepairRequestDetail(requestId)
      .catch((err) => {
        if (!cancelled) setDetailError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestId, loadRepairRequestDetail]);

  const request = requestId ? getRepairRequestById(repairRequests, requestId) : undefined;

  const mechanics = useMemo(() => users.filter((u) => u.role === "mechanic"), [users]);

  if (!user) return null;
  if (!request) {
    if (detailLoading) return <EmptyState message="Loading repair request…" />;
    return <EmptyState message={detailError ?? "Repair request not found."} />;
  }

  const equipmentItem = getEquipmentById(equipment, request.equipmentId);
  // Only trust these once the detail fetch above has actually completed —
  // until then an empty array could just mean "not loaded yet", not "none".
  const repairActions = detailLoading ? undefined : request.repairActions ?? [];
  const approvals = detailLoading ? undefined : request.approvals ?? [];
  const totalCost = request.totalRepairCost ?? (repairActions ?? []).reduce((sum, a) => sum + a.totalCost, 0);

  const supervisorApproval = latestApprovalForStage(approvals ?? [], "supervisor");
  const mdApproval = latestApprovalForStage(approvals ?? [], "md");
  const idleDays = getIdleDays(request);

  // Who may act, and what, at this request's current stage. The real
  // approval queue is routed server-side (by site / role), so this is an
  // optimistic UI gate only — the backend is the final authority and will
  // reject a decision this user isn't actually allowed to make.
  const canDecideAsSupervisor =
    user.role === "supervisor" && request.status === "pending_supervisor_approval" && request.reportedById !== user.id;

  const canDecideAsMd = user.role === "md" && request.status === "pending_md_approval";

  const isAssignedMechanic = request.assignedMechanicId === user.id;
  const canAssignMechanic =
    (user.role === "supervisor" || user.role === "admin") &&
    !["repair_in_progress", "pending_parts", "repair_completed", "closed", "cancelled", "rejected_returned"].includes(
      request.status,
    );

  const canStartRepair =
    (user.role === "admin" || (user.role === "mechanic" && isAssignedMechanic)) && request.status === "approved";

  const canLogRepairAction = (user.role === "admin" || (user.role === "mechanic" && isAssignedMechanic)) && (
    request.status === "repair_in_progress" || request.status === "pending_parts"
  );

  const canCloseRepair = (user.role === "admin" || user.role === "supervisor" || user.role === "md") && request.status === "repair_completed";

  const canCancel =
    (user.role === "admin" || request.reportedById === user.id) &&
    ["draft", "submitted", "pending_supervisor_approval", "pending_md_approval", "supervisor_approved", "approved"].includes(
      request.status,
    );

  const canDownloadReport =
    (user.role === "supervisor" || user.role === "md" || user.role === "admin") &&
    (request.status === "repair_completed" || request.status === "closed") &&
    !detailLoading;

  async function runAction(fn: () => Promise<void>) {
    setActionBusy(true);
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionBusy(false);
    }
  }

  function handleSupervisorDecision(decision: ApprovalDecision, comment: string) {
    return decideSupervisor(request!.id, decision, comment);
  }

  function handleMdDecision(decision: ApprovalDecision, comment: string) {
    return decideMd(request!.id, decision, comment);
  }

  function handleAssignMechanic() {
    if (!selectedMechanicId) return;
    runAction(() => assignMechanic(request!.id, selectedMechanicId));
  }

  function handleCompleteRepair() {
    runAction(async () => {
      await completeRepair(request!.id, finalNotes.trim() || undefined);
      setFinalNotes("");
    });
  }

  function handleCancel() {
    runAction(async () => {
      await cancelRepairRequest(request!.id, cancelReason.trim() || undefined);
      setCancelReason("");
      setShowCancelForm(false);
    });
  }

  return (
    <div className="space-y-8">
      <Link to="/dashboard/repair-requests" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
        ← Back to Repair Requests
      </Link>

      <PageHeader
        title={request.requestNumber}
        description={equipmentItem ? `${equipmentItem.name} · ${equipmentItem.assignedSite ?? "No site on file"}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <PriorityBadge priority={request.priority} />
            <StatusBadge status={request.status} />
            {canDownloadReport && (
              <Button
                variant="secondary"
                size="md"
                className="border border-ink/10"
                onClick={() => downloadRepairReportPdf(request, equipmentItem, users)}
              >
                Download Repair Report
              </Button>
            )}
          </div>
        }
      />

      {actionError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{actionError}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Fault details */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Fault Details">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <Field label="Fault Type" value={FAULT_TYPE_LABEL[request.faultType]} />
              <Field label="Reported" value={formatDateTime(request.faultDatetime)} />
              <Field label="Reported By" value={getUserDisplayName(users, request.reportedById)} />
              <Field label="Fault Detected By" value={request.faultDetectedBy ?? "—"} />
              <Field label="Assigned Mechanic" value={getUserDisplayName(users, request.assignedMechanicId)} />
              {equipmentItem && (
                <>
                  <Field label="Registration Number" value={equipmentItem.registrationNumber} />
                  <Field label="Serial Number" value={equipmentItem.serialNumber ?? "—"} />
                </>
              )}
            </dl>
            <div className="mt-4">
              <dt className="text-xs font-medium tracking-wide text-muted uppercase">Fault Description</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{request.faultDescription}</dd>
            </div>
            <div className="mt-4">
              <dt className="text-xs font-medium tracking-wide text-muted uppercase">Repair Recommendation</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{request.repairRecommendation ?? "—"}</dd>
            </div>

            {canAssignMechanic && (
              <div className="mt-5 rounded-md border border-dashed border-black/10 p-4">
                <p className="text-sm font-semibold text-ink">
                  {request.assignedMechanicId ? "Reassign mechanic" : "Assign a mechanic"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={selectedMechanicId}
                    onChange={(e) => setSelectedMechanicId(e.target.value)}
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
                  >
                    <option value="">Select a mechanic…</option>
                    {mechanics.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                  <Button size="md" onClick={handleAssignMechanic} disabled={!selectedMechanicId || actionBusy}>
                    {actionBusy ? "Assigning…" : "Assign"}
                  </Button>
                </div>
              </div>
            )}

            {canCancel && (
              <div className="mt-5">
                {!showCancelForm ? (
                  <Button variant="secondary" size="md" className="border border-ink/10" onClick={() => setShowCancelForm(true)}>
                    Cancel Request
                  </Button>
                ) : (
                  <div className="rounded-md border border-dashed border-black/10 p-4">
                    <p className="text-sm font-semibold text-ink">Cancel this request</p>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={2}
                      placeholder="Reason (optional)"
                      className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-brand-blue focus:outline-none"
                    />
                    <div className="mt-3 flex gap-2">
                      <Button variant="danger" size="md" onClick={handleCancel} disabled={actionBusy}>
                        {actionBusy ? "Cancelling…" : "Confirm Cancellation"}
                      </Button>
                      <Button variant="secondary" size="md" className="border border-ink/10" onClick={() => setShowCancelForm(false)}>
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card title="Approval Trail">
            {approvals === undefined ? (
              <p className="text-sm text-muted">Loading approval history…</p>
            ) : (
              <div className="space-y-4">
                <ApprovalStep label="Supervisor Approval" record={supervisorApproval} users={users} />
                <ApprovalStep label="MD Final Approval" record={mdApproval} users={users} />
              </div>
            )}

            {canDecideAsSupervisor && (
              <div className="mt-5">
                <ApprovalPanel stage="supervisor" onDecide={handleSupervisorDecision} />
              </div>
            )}
            {canDecideAsMd && (
              <div className="mt-5">
                <ApprovalPanel stage="md" onDecide={handleMdDecision} />
              </div>
            )}
          </Card>

          <Card title="Repair Action Log">
            {repairActions === undefined ? (
              <p className="text-sm text-muted">Loading repair actions…</p>
            ) : repairActions.length === 0 ? (
              <p className="text-sm text-muted">No repair actions have been logged yet.</p>
            ) : (
              <div className="space-y-4">
                {repairActions.map((action) => (
                  <div key={action.id} className="rounded-md border border-black/5 bg-surface/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">{action.actionTaken}</p>
                      <p className="text-xs text-muted">{formatDate(action.actionDate)}</p>
                    </div>
                    {action.partsMaterialsUsed && (
                      <p className="mt-1 text-sm text-muted">
                        {action.partsMaterialsUsed} {action.quantity ? `× ${action.quantity}` : ""}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted">Performed by {getUserDisplayName(users, action.performedById)}</span>
                      <span className="font-semibold text-ink">{formatNaira(action.totalCost)}</span>
                    </div>
                    {action.notes && <p className="mt-1 text-sm text-muted">{action.notes}</p>}
                  </div>
                ))}
              </div>
            )}

            {canStartRepair && (
              <div className="mt-5">
                <Button size="md" onClick={() => runAction(() => startRepair(request!.id))} disabled={actionBusy}>
                  {actionBusy ? "Starting…" : "Start Repair"}
                </Button>
              </div>
            )}

            {canLogRepairAction && (
              <div className="mt-5 space-y-4">
                <RepairActionForm onSubmit={(input) => addRepairAction(request!.id, input)} />

                <div className="flex flex-wrap gap-2">
                  {request.status === "repair_in_progress" && (
                    <Button
                      variant="secondary"
                      size="md"
                      className="border border-ink/10"
                      onClick={() => runAction(() => setPendingParts(request!.id))}
                      disabled={actionBusy}
                    >
                      Mark Waiting on Parts
                    </Button>
                  )}
                  {request.status === "pending_parts" && (
                    <Button
                      variant="secondary"
                      size="md"
                      className="border border-ink/10"
                      onClick={() => runAction(() => resumeRepair(request!.id))}
                      disabled={actionBusy}
                    >
                      Resume Repair
                    </Button>
                  )}
                </div>

                <div className="rounded-md border border-dashed border-black/10 p-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">Final Notes (optional)</span>
                    <textarea
                      value={finalNotes}
                      onChange={(e) => setFinalNotes(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
                    />
                  </label>
                  <Button
                    size="md"
                    className="mt-3"
                    disabled={(repairActions ?? []).length === 0 || actionBusy}
                    onClick={handleCompleteRepair}
                  >
                    {actionBusy ? "Saving…" : "Mark Repair Completed"}
                  </Button>
                  {(repairActions ?? []).length === 0 && (
                    <p className="mt-2 text-xs text-muted">Log at least one repair action before marking this completed.</p>
                  )}
                </div>
              </div>
            )}

            {canCloseRepair && (
              <div className="mt-5">
                <Button size="md" onClick={() => runAction(() => closeRepair(request!.id))} disabled={actionBusy}>
                  {actionBusy ? "Closing…" : "Close Repair Request"}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar: costs + equipment link */}
        <div className="space-y-6">
          <Card title="Costs">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Estimated cost</span>
              <span className="font-semibold text-ink">{request.estimatedCost ? formatNaira(request.estimatedCost) : "—"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted">Actual cost to date</span>
              <span className="font-semibold text-ink">{formatNaira(totalCost)}</span>
            </div>
            <div className="mt-4 border-t border-black/5 pt-4 text-xs text-muted">
              All costs on this request stay linked to {request.requestNumber} for traceability.
            </div>
          </Card>

          <Card title="Equipment">
            {equipmentItem ? (
              <>
                <p className="text-sm font-semibold text-ink">{equipmentItem.name}</p>
                <p className="mt-1 text-sm text-muted">{equipmentItem.currentLocation ?? "No location on file"}</p>
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

          {(request.status === "repair_completed" || request.status === "closed") && (
            <Card title="Completion">
              <p className="text-sm text-ink">{request.status === "closed" ? "Repair verified, completed and closed." : "Repair completed."}</p>
              <p className="mt-1 text-sm text-muted">Last updated {formatDateTime(request.updatedAt)}</p>
              {idleDays !== null && (
                <p className="mt-3 border-t border-black/5 pt-3 text-sm text-ink">
                  Equipment was idle for <span className="font-semibold">{idleDays} day{idleDays === 1 ? "" : "s"}</span> — from the
                  fault being reported until the repair was completed.
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function latestApprovalForStage(approvals: ApprovalRecord[], stage: ApprovalStage): ApprovalRecord | null {
  const matches = approvals.filter((a) => a.stage === stage);
  if (matches.length === 0) return null;
  return [...matches].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).at(-1) ?? null;
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

function ApprovalStep({ label, record, users }: { label: string; record: ApprovalRecord | null; users: User[] }) {
  if (!record) {
    return (
      <div className="rounded-md border border-dashed border-black/10 p-4">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-sm text-muted">Awaiting decision.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-black/5 bg-surface/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <span className={`text-sm font-semibold ${APPROVAL_DECISION_STYLE[record.decision]}`}>
          {APPROVAL_DECISION_LABEL[record.decision]}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {getUserDisplayName(users, record.decidedById)} · {formatDateTime(record.createdAt)}
      </p>
      {record.comment && <p className="mt-2 text-sm text-ink">"{record.comment}"</p>}
    </div>
  );
}
