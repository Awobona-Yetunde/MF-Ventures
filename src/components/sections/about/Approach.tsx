import type { ReactNode } from "react";
import { Eyebrow, Section } from "@/components/ui";

interface Step {
  icon: ReactNode;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: <BulbIcon />,
    title: "Understand",
    description: "We start by understanding the requirement, specifications, and operational context.",
  },
  {
    icon: <GearIcon />,
    title: "Plan",
    description: "We consider the resources, materials, and support needed to address the requirement.",
  },
  {
    icon: <LinkIcon />,
    title: "Coordinate",
    description:
      "We bring the relevant requirements together and keep communication moving throughout the process.",
  },
  {
    icon: <CheckIcon />,
    title: "Deliver",
    description: "We work toward moving the requirement through the necessary stages and toward completion.",
  },
];

export function Approach() {
  return (
    <Section tone="surface">
      <Eyebrow>Our Approach</Eyebrow>
      <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-ink md:text-4xl">
        From requirement to delivery, we keep the process moving.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        We follow a clear and practical approach to help ensure your requirements are understood, the right
        resources are brought together, and the process stays on track — from start to finish.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              {step.icon}
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.45 1 .9 1.1 1.7h5c.1-.8.5-1.25 1.1-1.7A6 6 0 0012 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V19a2 2 0 11-4 0v-.2a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H5a2 2 0 110-4h.2a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H11a1.6 1.6 0 001-1.5V5a2 2 0 114 0v.2a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V11a1.6 1.6 0 001.5 1h.2a2 2 0 110 4h-.2a1.6 1.6 0 00-1.5 1z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 15l6-6m-5-2l1.5-1.5a3.5 3.5 0 115 5L15 12m-6 1.5L7.5 15a3.5 3.5 0 105 5L14 18.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
