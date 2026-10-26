import { cn } from "@/lib/cn";
import { Card, Eyebrow, Reveal, Section } from "@/components/ui";

interface Reason {
  number: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const REASONS: Reason[] = [
  {
    number: "01",
    title: "When The Details Matter",
    description:
      "Complex industry requirements can involve many moving parts, and small details can affect how smoothly everything comes together. We take the time to understand the requirement, consider the context, and approach each need with care before moving forward.",
  },
  {
    number: "02",
    title: "Clear Communication",
    description:
      "Good work depends on everyone understanding what is required and what comes next. We value clear, straightforward communication throughout the process, helping reduce confusion and keeping expectations aligned from the beginning to the end.",
  },
  {
    number: "03",
    title: "Industry Understanding",
    description:
      "The oil and gas industry comes with technical requirements, operational demands, and environments where precision matters. Our approach is shaped around understanding that context, so requirements are considered with the realities of the industry in mind.",
  },
  {
    number: "04",
    title: "Beyond Service",
    description:
      "Complex industry requirements often depend on the details. Our approach is centred on understanding those details and responding with practical, considered solutions.",
  },
  {
    number: "05",
    title: "Client Focused Solution",
    description:
      "We take the time to understand each client's objectives, project scope, and specific requirements, allowing us to identify suitable services, resources, and practical solutions that align with their needs.",
    highlight: true,
  },
];

// Explicit grid placement (rather than two independently-stacked columns)
// so Reason 01/02 share row 1, 03/04 share row 2, and the grid's default
// stretch behaviour makes every card in a row match the row's tallest card
// — that's what keeps the sizes even regardless of how long each blurb is.
// The highlighted card spans both rows, so its height always matches the
// combined height of the other two columns.
const GRID_PLACEMENT = [
  "md:col-start-1 md:row-start-1",
  "md:col-start-2 md:row-start-1",
  "md:col-start-1 md:row-start-2",
  "md:col-start-2 md:row-start-2",
  "md:col-start-3 md:row-start-1 md:row-span-2",
];

export function WhyChooseUs() {
  return (
    <Section tone="light">
      <Reveal>
        <Eyebrow>Why Choose Us</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-ink md:text-4xl">
          We combine engineering support, procurement and project coordination to help keep requirements moving.
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {REASONS.map((reason, index) => (
          <Reveal key={reason.number} delay={index * 100} className={GRID_PLACEMENT[index]}>
            <ReasonCard reason={reason} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ReasonCard({ reason }: { reason: Reason }) {
  return (
    <Card
      tone={reason.highlight ? "navy" : "light"}
      className={cn(
        "h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        reason.highlight ? "hover:shadow-navy-950/20" : "hover:shadow-black/10",
        reason.highlight && "flex flex-col justify-center",
      )}
    >
      <p className={cn("text-xs font-bold", reason.highlight ? "text-white/60" : "text-brand-blue")}>
        {reason.number}
      </p>
      <h3 className="mt-2 text-sm font-bold tracking-wide uppercase">{reason.title}</h3>
      <p className={cn("mt-3 text-sm leading-relaxed", reason.highlight ? "text-white/75" : "text-muted")}>
        {reason.description}
      </p>
    </Card>
  );
}
