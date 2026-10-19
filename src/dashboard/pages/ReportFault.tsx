import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader } from "@/dashboard/components";
import {
  useDashboardData,
  useDashboardSession,
} from "@/dashboard/state/DashboardProvider";
import type { FaultType, Priority } from "@/dashboard/types";

const FAULT_TYPES: FaultType[] = [
  "Corrective Maintenance",
  "Preventive Maintenance",
  "Emergency Repair",
];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

function nowForInput(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function ReportFault() {
  const navigate = useNavigate();
  const { user } = useDashboardSession();
  const { equipment, submitFaultReport } = useDashboardData();

  const [equipmentId, setEquipmentId] = useState(equipment[0]?.id ?? "");
  const [faultType, setFaultType] = useState<FaultType>(
    "Corrective Maintenance",
  );
  const [priority, setPriority] = useState<Priority>("Medium");
  const [reportedAt, setReportedAt] = useState(nowForInput());
  const [description, setDescription] = useState("");
  const [detectedBy, setDetectedBy] = useState(user?.name ?? "");
  const [recommendation, setRecommendation] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedEquipment = equipment.find((eq) => eq.id === equipmentId);

  if (!user) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    if (!equipmentId) {
      setError("Select the equipment this fault affects.");
      return;
    }
    if (!description.trim()) {
      setError("Describe the fault before submitting.");
      return;
    }
    if (!recommendation.trim()) {
      setError("Add a repair recommendation for the supervisor to review.");
      return;
    }

    setError(null);

    const request = submitFaultReport(
      {
        equipmentId,
        faultType,
        priority,
        faultDescription: description.trim(),
        faultDetectedBy: detectedBy,
        repairRecommendation: recommendation.trim(),
        reportedAt: new Date(reportedAt).toISOString(),
        estimatedCost: estimatedCost.trim() ? Number(estimatedCost) : undefined,
      },
      user,
    );

    navigate(`/dashboard/repair-requests/${request.id}`, {
      state: { justSubmitted: true },
    });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Report Equipment Fault"
        description="Submit a new fault report for supervisor review."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-lg border border-black/5 bg-white p-6 shadow-sm"
      >
        <Field label="Equipment">
          <select
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            className={selectClass}
          >
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} · {eq.site}
              </option>
            ))}
          </select>
        </Field>

        {selectedEquipment && (
          <div className="grid grid-cols-2 gap-4 rounded-md bg-surface/60 p-4 sm:grid-cols-4">
            <ReadOnly
              label="Registration No."
              value={selectedEquipment.registrationNumber}
            />
            <ReadOnly
              label="Serial No."
              value={selectedEquipment.serialNumber}
            />
            <ReadOnly label="Model No." value={selectedEquipment.modelNumber} />
            <ReadOnly
              label="Location / Site"
              value={`${selectedEquipment.location}`}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Date / Time of Fault">
            <input
              type="datetime-local"
              value={reportedAt}
              onChange={(e) => setReportedAt(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Fault Type">
            <select
              value={faultType}
              onChange={(e) => setFaultType(e.target.value as FaultType)}
              className={selectClass}
            >
              {FAULT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={selectClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fault Reported By">
            <input
              type="text"
              value={user.name}
              disabled
              className={`${inputClass} bg-surface text-muted`}
            />
          </Field>

          <Field label="Fault Detected By">
            <input
              type="text"
              value={detectedBy}
              onChange={(e) => setDetectedBy(e.target.value)}
              placeholder={user.name}
              className={inputClass}
            />
          </Field>

          <Field label="Photo / Video Attachment">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) =>
                setAttachmentName(e.target.files?.[0]?.name ?? null)
              }
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            {attachmentName && (
              <p className="mt-1 text-xs text-muted">
                Attached: {attachmentName} (stored once file uploads are
                connected)
              </p>
            )}
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

        <Field label="Repair Recommendation">
          <textarea
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            rows={3}
            placeholder="What repair do you recommend?"
            className={inputClass}
          />
        </Field>

        <Field label="Estimated Repair Cost (₦)">
          <input
            type="number"
            min="0"
            step="100"
            inputMode="numeric"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Optional — your best guess, for approval review"
            className={inputClass}
          />
        </Field>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="border border-ink/10"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Submit for Approval
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
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
