import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/dashboard/components";
import { Button } from "@/components/ui";
import { useDashboardSession } from "@/dashboard/state/DashboardProvider";
import { ROLE_LABEL } from "@/dashboard/data/labels";

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
      <PageHeader title="Settings" description="Account details." />

      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Profile</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Full Name" value={user.fullName} />
          <ReadOnlyField label="Email" value={user.email} />
          <ReadOnlyField label="Role" value={ROLE_LABEL[user.role]} />
          <ReadOnlyField label="Site" value={user.site ?? "—"} />
        </div>
      </section>

      {user.role === "admin" && (
        <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">System</h2>
          <p className="mt-2 text-sm text-muted">Create and manage staff accounts and role-based access.</p>
          <Button variant="secondary" className="mt-4 border border-ink/10" onClick={() => navigate("/dashboard/users")}>
            Manage Users
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
