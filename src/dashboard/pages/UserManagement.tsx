import { useState } from "react";
import type { ReactNode } from "react";
import { PageHeader, DataTable } from "@/dashboard/components";
import type { Column } from "@/dashboard/components";
import { Button, Modal } from "@/components/ui";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import type { Role, User } from "@/dashboard/types";

const ROLE_LABEL: Record<Role, string> = {
  mechanic: "Mechanic",
  supervisor: "Supervisor",
  md: "Managing Director",
  admin: "Administrator",
};

const ROLE_BADGE: Record<Role, string> = {
  mechanic: "bg-blue-50 text-blue-700",
  supervisor: "bg-amber-50 text-amber-700",
  md: "bg-brand-blue/10 text-brand-blue",
  admin: "bg-emerald-50 text-emerald-700",
};

const ROLE_OPTIONS: Role[] = ["mechanic", "supervisor", "md", "admin"];

const SITE_OPTIONS = ["Lagos", "Warri", "Port Harcourt"];

interface NewUserForm {
  name: string;
  email: string;
  role: Role;
  site: string;
}

const EMPTY_FORM: NewUserForm = { name: "", email: "", role: "mechanic", site: SITE_OPTIONS[0] };

export default function UserManagement() {
  const { users, addUser } = useDashboardData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastInvite, setLastInvite] = useState<{ user: User; inviteLink: string } | null>(null);

  const columns: Column<User>[] = [
    {
      header: "Name",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue">
            {u.avatarInitials}
          </span>
          <span className="font-semibold">{u.name}</span>
        </div>
      ),
    },
    { header: "Email", cell: (u) => u.email },
    {
      header: "Role",
      cell: (u) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
          {ROLE_LABEL[u.role]}
        </span>
      ),
    },
    { header: "Site", cell: (u) => u.site },
    {
      header: "Status",
      cell: (u) =>
        u.status === "Active" ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
            Invited — pending setup
          </span>
        ),
    },
  ];

  function openAddModal() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsAddOpen(true);
  }

  function handleSendInvite() {
    const result = addUser(form);
    if ("error" in result) {
      setFormError(result.error);
      return;
    }
    setLastInvite(result);
    setIsAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage staff accounts and role-based access."
        actions={<Button size="md" onClick={openAddModal}>+ Add User</Button>}
      />

      {lastInvite ? (
        <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Invite created for {lastInvite.user.name} ({ROLE_LABEL[lastInvite.user.role]})
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Once this is connected to email, the invite link below is sent to{" "}
              <span className="font-medium">{lastInvite.user.email}</span> automatically. For now, copy and share it
              yourself — the user opens it to set their own password.
            </p>
            <code className="mt-2 block truncate rounded bg-white px-3 py-1.5 text-xs text-ink">
              {lastInvite.inviteLink}
            </code>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              size="md"
              className="border border-emerald-300"
              onClick={() => navigator.clipboard?.writeText(lastInvite.inviteLink)}
            >
              Copy Link
            </Button>
            <Button variant="secondary" size="md" className="border border-emerald-300" onClick={() => setLastInvite(null)}>
              Dismiss
            </Button>
          </div>
        </div>
      ) : null}

      <DataTable columns={columns} rows={users} getRowKey={(u) => u.id} />

      <Modal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add User"
        description="Creates the account and generates an invite link so the person can set their own password. Nobody's password is ever created or seen by an admin."
      >
        <div className="space-y-4">
          <Field label="Full Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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

          <Field label="Site">
            <select
              value={form.site}
              onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand-blue focus:outline-none"
            >
              {SITE_OPTIONS.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </Field>

          {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" className="border border-ink/10" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button size="md" onClick={handleSendInvite}>
              Create &amp; Send Invite
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
