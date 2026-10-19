import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/dashboard/components";
import { Button } from "@/components/ui";
import { useDashboardSession } from "@/dashboard/state/DashboardProvider";

const ROLE_LABEL = {
  mechanic: "Mechanic",
  supervisor: "Supervisor",
  md: "Managing Director",
  admin: "Administrator",
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useDashboardSession();
  if (!user) return null;

  function handleSignOut() {
    logout();
    navigate("/dashboard/login");
  }

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Settings" description="Account and system preferences." />

      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Profile</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Full Name" value={user.name} />
          <ReadOnlyField label="Email" value={user.email} />
          <ReadOnlyField label="Role" value={ROLE_LABEL[user.role]} />
          <ReadOnlyField label="Site" value={user.site} />
        </div>
      </section>

      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Notifications</h2>
        <div className="mt-4 space-y-3">
          <ToggleRow label="In-app notifications" description="New faults, approvals, and status changes." defaultChecked />
          <ToggleRow label="Critical fault alerts" description="Immediate notice for Critical-priority faults." defaultChecked />
          <ToggleRow label="Email notifications" description="Coming soon — not yet connected." disabled />
        </div>
      </section>

      {user.role === "admin" && (
        <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">System</h2>
          <p className="mt-2 text-sm text-muted">
            User and role management, equipment categories, and site configuration live here once the system is
            connected to a backend.
          </p>
          <Button variant="secondary" className="mt-4 border border-ink/10">
            Manage System Configuration
          </Button>
        </section>
      )}

      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Account</h2>
        <p className="mt-2 text-sm text-muted">Sign out of this device.</p>
        <Button variant="danger" className="mt-4" onClick={handleSignOut}>
          Sign Out
        </Button>
      </section>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
  disabled,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="mt-1 h-5 w-9 shrink-0 appearance-none rounded-full bg-black/10 transition-colors checked:bg-brand-blue disabled:opacity-40"
      />
    </label>
  );
}
