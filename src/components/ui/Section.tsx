import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Tone = "light" | "surface" | "navy";
type Padding = "default" | "sm" | "none";

const toneClasses: Record<Tone, string> = {
  light: "bg-white",
  surface: "bg-surface",
  navy: "bg-navy-950 text-white",
};

// A dedicated variant (rather than letting callers fight the default via
// className) avoids conflicting py-* utilities landing in the same class
// list, where plain string concatenation can't guarantee which one wins.
const paddingClasses: Record<Padding, string> = {
  default: "py-16 md:py-24",
  sm: "py-6 md:py-8",
  none: "",
};

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  padding?: Padding;
  className?: string;
  containerClassName?: string;
  id?: string;
}

/** Consistent vertical rhythm + background wrapper used by every page section. */
export function Section({ children, tone = "light", padding = "default", className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn(paddingClasses[padding], toneClasses[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
