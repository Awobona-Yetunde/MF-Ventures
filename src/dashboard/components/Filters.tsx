import type { ReactNode } from "react";

/** Groups a labelled row of filter chips — status, priority, site, etc. */
export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-brand-blue text-white" : "bg-white text-ink/70 ring-1 ring-black/10 hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}
