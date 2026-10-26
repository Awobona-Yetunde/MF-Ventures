import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader } from "@/dashboard/components";
import { useDashboardData, useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { FAULT_TYPE_LABEL, PRIORITY_LABEL } from "@/dashboard/data/labels";
import type { FaultType, Priority } from "@/dashboard/types";

const FAULT_TYPES: FaultType[] = ["corrective_maintenance", "preventive_maintenance", "emergency_repair"];
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];

function nowForInput(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function ReportFault() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, equipmentLoading, submitFaultReport } = useDashboardData();

  const [equipmentId, setEquipmentId] = useState(equipment[0]?.id ?? "");
  const [faultType, setFaultType] = useState<FaultType>("corrective_maintenance");
  const [priority, setPriority] = useState<Priority>("medium");
  const [faultDatetime, setFaultDatetime] = useState(nowForInput());
  const [description, setDescription] = useState("");
  const [detectedBy, setDetectedBy] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [submitImmediately, setSubmitImmediately] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedEquipment = equipment.find((eq) => eq.id === equipmentId);

  if (!user) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!equipmentId) {
      setError("Select the equipment this fault affects.");
      return;
    }
    if (!description.trim() || description.trim().length < 3) {
      setError("Describe the fault (at least 3 characters) before submitting.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const result = await submitFaultReport({
      equipmentId,
      faultDatetime: new Date(faultDatetime).toISOString(),
      faultType,
      priority,
      faultDescription: description.trim(),
      faultDetectedBy: detectedBy.trim() || undefined,
      repairRecommendation: recommendation.trim() || undefined,
      estimatedCost: estimatedCost.trim() ? Number(estimatedCost) : undefined,
      submitImmediately,
    });

    setSubmitting(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    navigate(`/dashboard/repair-requests/${result.id}`, { state: { justSubmitted: true } });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Report Equipment Fault" description="Submit a new fault report for supervisor review." />

      <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-lg border border-black/5 bg-white p-6 shadow-sm">
        <Field label="Equipment">
          <select value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} className={selectClass} disabled={equipmentLoading}>
            <option value="">{equipmentLoading ? "Loading equipment…" : "Select equipment"}</option>
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
                {eq.assignedSite ? ` · ${eq.assignedSite}` : ""}
              </option>
            ))}
          </select>
        </Field>

        {selectedEquipment && (
          <div className="grid grid-cols-2 gap-4 rounded-md bg-surface/60 p-4 sm:grid-cols-4">
            <ReadOnly label="Registration No." value={selectedEquipment.registrationNumber} />
            <ReadOnly label="Serial No." value={selectedEquipment.serialNumber ?? "—"} />
            <ReadOnly label="Model No." value={selectedEquipment.modelNumber ?? "—"} />
            <ReadOnly label="Location / Site" value={selectedEquipment.currentLocation ?? selectedEquipment.assignedSite ?? "—"} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Date / Time of Fault">
            <input type="datetime-local" value={faultDatetime} onChange={(e) => setFaultDatetime(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Fault Type">
            <select value={faultType} onChange={(e) => setFaultType(e.target.value as FaultType)} className={selectClass}>
              {FAULT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {FAULT_TYPE_LABEL[type]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Priority">
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectClass}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fault Reported By">
            <input type="text" value={user.fullName} disabled className={`${inputClass} bg-surface text-muted`} />
          </Field>

          <Field label="Fault Detected By (optional)">
            <input
              type="text"
              value={detectedBy}
              onChange={(e) => setDetectedBy(e.target.value)}
              placeholder={user.fullName}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Fault Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What's wrong, and what have you observed?"
            className={inputClass}
          />
        </Field>

        <Field label="Repair Recommendation (optional)">
          <textarea
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            rows={3}
            placeholder="What repair do you recommend?"
            className={inputClass}
          />
        </Field>

        <Field label="Estimated Repair Cost (₦) (optional)">
          <input
            type="number"
            min="0"
            step="100"
            inputMode="numeric"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Your best guess, for approval review"
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={submitImmediately} onChange={(e) => setSubmitImmediately(e.target.checked)} className="h-4 w-4" />
          Submit immediately for supervisor approval (leave unchecked to save as a draft instead)
        </label>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" className="border border-ink/10" onClick={() => navigate(-1)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : submitImmediately ? "Submit for Approval" : "Save as Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20";
const selectClass = inputClass;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
