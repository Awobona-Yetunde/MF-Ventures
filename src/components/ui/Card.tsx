import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "light" | "navy";

export function Card({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-7",
        tone === "navy" ? "bg-navy-950 text-white" : "bg-white text-ink shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
