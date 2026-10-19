import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: string;
  light?: boolean;
  centered?: boolean;
}

/** The small "—— LABEL ——" tag used above every section heading in the design. */
export function Eyebrow({ children, light = false, centered = false }: EyebrowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase",
        centered && "justify-center",
        light ? "text-white" : "text-brand-blue",
      )}
    >
      <span className={cn("h-px w-6", light ? "bg-white/50" : "bg-brand-blue/50")} />
      {children}
      <span className={cn("h-px w-6", light ? "bg-white/50" : "bg-brand-blue/50")} />
    </div>
  );
}
