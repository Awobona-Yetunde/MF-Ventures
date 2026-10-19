import { cn } from "@/lib/cn";
import { Card, Eyebrow, Section } from "@/components/ui";

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

// Visual layout from the design: col 1 stacks reasons 1 & 3, col 2 stacks
// reasons 2 & 4, col 3 is the highlighted reason spanning the full height
// of the other two columns combined.
const COLUMN_ONE = [REASONS[0], REASONS[2]];
const COLUMN_TWO = [REASONS[1], REASONS[3]];
const HIGHLIGHT = REASONS[4];

export function WhyChooseUs() {
  return (
    <Section tone="light">
      <Eyebrow>Why Choose Us</Eyebrow>
      <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-ink md:text-4xl">
        We combine engineering support, procurement and project coordination to help keep requirements moving.
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="flex flex-col gap-5">
          {COLUMN_ONE.map((reason) => (
            <ReasonCard key={reason.number} reason={reason} />
          ))}
        </div>
        <div className="flex flex-col gap-5">
          {COLUMN_TWO.map((reason) => (
            <ReasonCard key={reason.number} reason={reason} />
          ))}
        </div>
        <ReasonCard reason={HIGHLIGHT} className="flex-1 md:flex md:flex-col md:justify-center" />
      </div>
    </Section>
  );
}

function ReasonCard({ reason, className }: { reason: Reason; className?: string }) {
  return (
    <Card tone={reason.highlight ? "navy" : "light"} className={cn(className)}>
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
