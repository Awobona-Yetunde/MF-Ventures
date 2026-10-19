import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  light?: boolean;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <div className="mb-4">
          <Eyebrow light={light} centered={centered}>
            {eyebrow}
          </Eyebrow>
        </div>
      )}
      <h2 className={cn("text-3xl leading-tight md:text-4xl", light ? "text-white" : "text-ink")}>{title}</h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/70" : "text-muted")}>{description}</p>
      )}
    </div>
  );
}
