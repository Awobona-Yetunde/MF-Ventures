import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { PageHeader, DataTable, StatusBadge } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { formatDate, formatNaira } from "@/dashboard/data/selectors";
import type { Equipment, EquipmentStatus } from "@/dashboard/types";

const STATUS_FILTERS: Array<EquipmentStatus | "All"> = [
  "All",
  "Operational",
  "Under Maintenance",
  "Out of Service",
];

const EMPTY_FORM = {
  name: "",
  registrationNumber: "",
  serialNumber: "",
  modelNumber: "",
  site: "",
};

export default function EquipmentList() {
  const navigate = useNavigate();
  const { equipment, addEquipment } = useDashboardData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EquipmentStatus | "All">("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesStatus = status === "All" || eq.status === status;
      const matchesQuery =
        query.trim().length === 0 ||
        [eq.name, eq.registrationNumber, eq.serialNumber].some((field) =>
          field.toLowerCase().includes(query.trim().toLowerCase()),
        );
      return matchesStatus && matchesQuery;
    });
  }, [equipment, query, status]);

  const columns: Column<Equipment>[] = [
    {
      header: "Equipment",
      cell: (eq) => <span className="font-semibold">{eq.name}</span>,
    },
    { header: "Type", cell: (eq) => eq.type },
    { header: "Registration", cell: (eq) => eq.registrationNumber },
    { header: "Site", cell: (eq) => eq.site },
    { header: "Status", cell: (eq) => <StatusBadge status={eq.status} /> },
    {
      header: "Last Maintenance",
      cell: (eq) => formatDate(eq.lastMaintenanceDate),
    },
    {
      header: "Total Cost",
      cell: (eq) => formatNaira(eq.totalMaintenanceCost),
    },
  ];

  function handleAddEquipment() {
    const result = addEquipment(form);
    if ("error" in result) {
      setFormError(result.error);
      return;
    }
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Register"
        description="All registered equipment across sites."
        actions={
          <Button size="md" onClick={() => setIsAddOpen((open) => !open)}>
            {isAddOpen ? "Cancel" : "+ Add Equipment"}
          </Button>
        }
      />

      {isAddOpen && (
        <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink">Add equipment</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field label="Equipment Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Registration Number">
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, registrationNumber: e.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Serial Number">
              <input
                type="text"
                value={form.serialNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, serialNumber: e.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Model Number">
              <input
                type="text"
                value={form.modelNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, modelNumber: e.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Location / Site">
              <input
                type="text"
                value={form.site}
                onChange={(e) =>
                  setForm((f) => ({ ...f, site: e.target.value }))
                }
                placeholder="e.g. Lagos, Warri, Port Harcourt"
                className={inputClass}
              />
            </Field>
          </div>

          {formError && (
            <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>
          )}

          <Button
            size="lg"
            className="mt-6 w-full justify-center uppercase tracking-wide"
            onClick={handleAddEquipment}
          >
            Add Equipment
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, registration or serial number"
          className="w-full max-w-sm rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                status === s
                  ? "bg-brand-blue text-white"
                  : "bg-white text-ink/70 ring-1 ring-black/10 hover:bg-surface"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(eq) => eq.id}
        onRowClick={(eq) => navigate(`/dashboard/equipment/${eq.id}`)}
        emptyMessage="No equipment matches your search."
      />
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-muted uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
