import { Button } from "./Button";
import { Section } from "./Section";

/** Reusable placeholder for routes that exist in navigation but aren't designed yet. */
export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <Section tone="light" className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase">Coming Soon</p>
      <h1 className="mt-4 text-3xl font-extrabold text-ink md:text-4xl">{title}</h1>
      {description && <p className="mt-4 max-w-md text-base text-muted">{description}</p>}
      <Button to="/" variant="primary" className="mt-8">
        Back to Home
      </Button>
    </Section>
  );
}
