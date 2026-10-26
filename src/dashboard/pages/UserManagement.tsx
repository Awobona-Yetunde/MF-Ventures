import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PageHeader, DataTable } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { Button, Modal } from "@/components/ui";
import { useDashboardData, getErrorMessage } from "@/dashboard/state/DashboardProvider";
import { ROLE_LABEL } from "@/dashboard/data/labels";
import { getInitials } from "@/dashboard/data/selectors";
import type { Role, User } from "@/dashboard/types";

const ROLE_BADGE: Record<Role, string> = {
  mechanic: "bg-blue-50 text-blue-700",
  supervisor: "bg-amber-50 text-amber-700",
  md: "bg-brand-blue/10 text-brand-blue",
  admin: "bg-emerald-50 text-emerald-700",
};

const ROLE_OPTIONS: Role[] = ["mechanic", "supervisor", "md", "admin"];

interface NewUserForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  site: string;
}

const EMPTY_FORM: NewUserForm = { fullName: "", email: "", phoneNumber: "", role: "mechanic", site: "" };

/** Generates a random 14-character password satisfying the backend's 8–128 char requirement. */
function generateTemporaryPassword(): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => charset[n % charset.length]).join("");
}

export default function UserManagement() {
  const { users, usersLoading, refreshUsers, addUser } = useDashboardData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastCreated, setLastCreated] = useState<{ user: User; password: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Each visit to this page fetches the current list itself, rather than
  // only relying on the one fetch that ran right after login.
  useEffect(() => {
    setLoadError(null);
    refreshUsers().catch((err) => setLoadError(getErrorMessage(err)));
  }, [refreshUsers]);

  const columns: Column<User>[] = [
    {
      header: "Name",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue">
            {getInitials(u.fullName)}
          </span>
          <span className="font-semibold">{u.fullName}</span>
        </div>
      ),
    },
    { header: "Email", cell: (u) => u.email },
    {
      header: "Role",
      cell: (u) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>{ROLE_LABEL[u.role]}</span>
      ),
    },
    { header: "Site", cell: (u) => u.site ?? "—" },
    {
      header: "Status",
      cell: (u) =>
        u.isActive ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
        ) : (
          <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">Deactivated</span>
        ),
    },
  ];

  function openAddModal() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsAddOpen(true);
  }

  async function handleCreateUser() {
    if (!form.fullName.trim() || !form.email.trim()) {
      setFormError("Full name and email are required.");
      return;
    }
    setSubmitting(true);
    const password = generateTemporaryPassword();
    const result = await addUser({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim() || undefined,
      site: form.site.trim() || undefined,
      role: form.role,
      password,
    });
    setSubmitting(false);

    if ("error" in result) {
      setFormError(result.error);
      return;
    }
    setLastCreated({ user: result, password });
    setIsAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage staff accounts and role-based access."
        actions={
          <Button size="md" onClick={openAddModal}>
            + Add User
          </Button>
        }
      />

      {lastCreated ? (
        <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Account created for {lastCreated.user.fullName} ({ROLE_LABEL[lastCreated.user.role]})
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Share this temporary password with <span className="font-medium">{lastCreated.user.email}</span> directly —
              there is no invite email or password-change flow yet, so they will sign in with it as-is. Ask them to keep it
              somewhere safe.
            </p>
            <code className="mt-2 block truncate rounded bg-white px-3 py-1.5 text-xs text-ink">{lastCreated.password}</code>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              size="md"
              className="border border-emerald-300"
              onClick={() => navigator.clipboard?.writeText(lastCreated.password)}
            >
              Copy Password
            </Button>
            <Button variant="secondary" size="md" className="border border-emerald-300" onClick={() => setLastCreated(null)}>
              Dismiss
            </Button>
          </div>
        </div>
      ) : null}

      {loadError && (
        <div className="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{loadError}</span>
          <Button
            variant="secondary"
            size="md"
            className="border border-red-300"
            onClick={() => {
              setLoadError(null);
              refreshUsers().catch((err) => setLoadError(getErrorMessage(err)));
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {usersLoading && users.length === 0 ? (
        <p className="text-sm text-muted">Loading users…</p>
      ) : (
        <DataTable columns={columns} rows={users} getRowKey={(u) => u.id} emptyMessage="No users to show." />
      )}

      <Modal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add User"
        description="Creates the account with a randomly generated temporary password, shown to you once after creation to pass on to the new user."
      >
        <div className="space-y-4">
          <Field label="Full Name">
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
              placeholder="e.g. Ifeoma Chukwu"
              autoComplete="off"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
              placeholder="name@mfventures.com"
              autoComplete="off"
            />
          </Field>

          <Field label="Phone Number (optional)">
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
              placeholder="e.g. 08012345678"
              autoComplete="off"
            />
          </Field>

          <Field label="Role">
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABEL[role]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Site (optional)">
            <input
              type="text"
              value={form.site}
              onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
              placeholder="e.g. Lagos, Warri, Port Harcourt"
            />
          </Field>

          {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" className="border border-ink/10" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button size="md" onClick={handleCreateUser} disabled={submitting}>
              {submitting ? "Creating…" : "Create User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}
