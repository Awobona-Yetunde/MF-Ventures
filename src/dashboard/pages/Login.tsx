import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useDashboardSession } from "@/dashboard/state/DashboardProvider";
import logo from "@/assets/images/logo-mfventures.png";

/**
 * There's no backend yet, so this checks the email against the mocked user
 * directory and ignores the password entirely — swap handleSubmit for a real
 * auth call once an API exists. The demo shortcuts below exist only so the
 * four roles can be previewed without a password system; remove that panel
 * once real sign-in is wired up.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useDashboardSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="MF Ventures" className="h-9 w-auto" />
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <h1 className="text-xl font-extrabold text-ink">Sign in to your dashboard</h1>
          <p className="mt-1 text-sm text-muted">Equipment Maintenance & Approval System</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mfventures.com"
                className="w-full rounded-md border border-black/10 bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-black/10 bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-black/10 bg-white/60 p-4">
          <button
            type="button"
            onClick={() => setShowDemoAccounts((open) => !open)}
            className="text-xs font-semibold tracking-wide text-muted uppercase hover:text-ink"
          >
            Preview build — demo accounts {showDemoAccounts ? "▲" : "▼"}
          </button>
          {showDemoAccounts && (
            <div className="mt-3 space-y-1.5 text-sm">
              <p className="text-muted">No password system yet — click an email to fill it in, then Sign In.</p>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => setEmail(account.email)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-surface"
                >
                  <span className="font-medium text-ink">{account.role}</span>
                  <span className="text-muted">{account.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Having trouble signing in? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

const DEMO_ACCOUNTS = [
  { role: "Mechanic", email: "chidi.okafor@mfventures.com" },
  { role: "Supervisor", email: "grace.nwosu@mfventures.com" },
  { role: "Managing Director", email: "fred.george@mfventures.com" },
  { role: "Admin", email: "tunde.bakare@mfventures.com" },
];
