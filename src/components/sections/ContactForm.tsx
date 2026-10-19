import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui";

interface FormState {
  name: string;
  email: string;
  phone: string;
  inquiry: string;
  /** Honeypot field: real visitors never see or fill this in. Any value means a bot. */
  company: string;
}

const INITIAL_STATE: FormState = { name: "", email: "", phone: "", inquiry: "", company: "" };

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Shared quote-request form. There is no backend yet, so submission is
 * stubbed out here — swap `handleSubmit`'s TODO for a real API call once
 * an endpoint exists. Kept as a single component so the Home CTA and the
 * dedicated Contact page never drift out of sync.
 */
export function ContactForm({ submitLabel = "Request a Quote" }: { submitLabel?: string }) {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Silently drop anything a bot filled into the honeypot field.
    if (values.company.trim().length > 0) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      // TODO: replace with a real request once the backend/API is available.
      // e.g. await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) })
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setValues(INITIAL_STATE);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      <div className="space-y-5">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Enter your name"
            className={inputClasses}
          />
        </Field>

        <Field label="E-mail" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={160}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Enter your email address"
            className={inputClasses}
          />
        </Field>

        <Field label="Phone number" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Enter your phone number"
            className={inputClasses}
          />
        </Field>

        <Field label="Inquiry" htmlFor="inquiry">
          <textarea
            id="inquiry"
            name="inquiry"
            required
            maxLength={2000}
            rows={4}
            value={values.inquiry}
            onChange={(e) => update("inquiry", e.target.value)}
            placeholder="Tell us what you need"
            className={inputClasses}
          />
        </Field>

        {/* Honeypot: hidden from sighted users and screen readers, bots tend to fill every field. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {status === "success" && <p className="text-sm font-medium text-emerald-600">Thanks — we'll be in touch.</p>}
          {status === "error" && <p className="text-sm font-medium text-red-600">Something went wrong. Try again.</p>}
          <Button type="submit" className="ml-auto" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-md border border-black/10 bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
