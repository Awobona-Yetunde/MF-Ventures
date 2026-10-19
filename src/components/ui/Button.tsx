import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline-light" | "danger";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonAsLink extends BaseProps {
  to: string;
  /** Opens in a new tab. Always paired with rel="noopener noreferrer" for security. */
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonAsButton extends BaseProps {
  to?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",
  secondary: "bg-white text-ink hover:bg-surface-alt",
  "outline-light": "border border-white/70 text-white hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3.5 text-base rounded-md",
};

/**
 * Shared CTA button. Renders a <Link> when `to` is provided (internal
 * navigation via React Router), or a native <button> otherwise. External
 * links always get rel="noopener noreferrer" so a linked page can never
 * get a handle back to this window (tabnabbing protection).
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.to) {
    if (props.external) {
      return (
        <a href={props.to} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
