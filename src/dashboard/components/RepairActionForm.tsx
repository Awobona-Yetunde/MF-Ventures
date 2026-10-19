import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui";
import type { RepairActionInput } from "@/dashboard/types";

const TODAY = new Date().toISOString().slice(0, 10);

const EMPTY_FORM = {
  date: TODAY,
  action: "",
  partsUsed: "",
  quantity: "",
  unitCost: "",
  labourCost: "",
  notes: "",
};

interface RepairActionFormProps {
  onSubmit: (input: RepairActionInput) => void;
}

/** Logs one repair action / cost entry against the current request. */
export function RepairActionForm({ onSubmit }: RepairActionFormProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.action.trim()) {
      setError("Describe the action taken.");
      return;
    }

    setError(null);
    onSubmit({
      date: form.date,
      action: form.action.trim(),
      partsUsed: form.partsUsed.trim() || undefined,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      unitCost: form.unitCost ? Number(form.unitCost) : undefined,
      labourCost: form.labourCost ? Number(form.labourCost) : undefined,
      notes: form.notes.trim() || undefined,
    });
    setForm(EMPTY_FORM);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-dashed border-black/10 p-4">
      <p className="text-sm font-semibold text-ink">Log a repair action</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="Date" type="date" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
        <TextField label="Action Taken" value={form.action} onChange={(v) => setForm((f) => ({ ...f, action: v }))} placeholder="e.g. Replaced hydraulic seals" />
        <TextField label="Parts / Materials Used" value={form.partsUsed} onChange={(v) => setForm((f) => ({ ...f, partsUsed: v }))} placeholder="Optional" />
        <TextField label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm((f) => ({ ...f, quantity: v }))} placeholder="Optional" />
        <TextField label="Unit Cost (₦)" type="number" value={form.unitCost} onChange={(v) => setForm((f) => ({ ...f, unitCost: v }))} placeholder="Optional" />
        <TextField label="Labour Cost (₦)" type="number" value={form.labourCost} onChange={(v) => setForm((f) => ({ ...f, labourCost: v }))} placeholder="Optional" />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">Notes</span>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
        />
      </label>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <Button type="submit" size="md">
        Save Repair Action
      </Button>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
      />
    </label>
  );
}
