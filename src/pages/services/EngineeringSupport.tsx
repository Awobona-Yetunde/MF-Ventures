import type { ReactNode } from "react";
import { Button, Card, Eyebrow, Reveal, Section } from "@/components/ui";
import heroPhoto from "@/assets/images/service-engineering.png";

interface Capability {
  icon: ReactNode;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: <WrenchIcon />,
    title: "Mechanical Engineering",
    description:
      "Mechanical installation, maintenance, overhaul, pumps, cranes, lifting systems, heavy equipment and mechanical support.",
  },
  {
    icon: <BoltIcon />,
    title: "Electrical Engineering",
    description:
      "Electrical installation, maintenance, panels, generators, turbines, power systems and industrial electrical support.",
  },
  {
    icon: <BuildingIcon />,
    title: "Civil & Infrastructure",
    description:
      "Civil construction, port works, infrastructure, industrial facilities, site development and general civil works.",
  },
  {
    icon: <AnchorIcon />,
    title: "Marine Engineering",
    description:
      "Vessel fitting, vessel maintenance support, marine equipment, lifting operations and marine engineering services.",
  },
  {
    icon: <GaugeIcon />,
    title: "Industrial Operations",
    description:
      "Pipeline support and monitoring, equipment inspection, industrial equipment operations and operational maintenance support.",
  },
  {
    icon: <TruckIcon />,
    title: "Equipment Leasing",
    description:
      "Access to heavy equipment for construction, lifting, industrial and operational requirements.",
  },
];

const LEASED_EQUIPMENT = [
  "Mobile Cranes",
  "Forklifts",
  "Telehandlers",
  "Trucks",
  "Generators",
  "Pumps",
  "Lifting Equipment",
];

export default function EngineeringSupport() {
  return (
    <>
      <Hero />
      <Capabilities />
      <EquipmentLeasing />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[480px] overflow-hidden bg-navy-950 md:min-h-[560px]">
      <img
        src={heroPhoto}
        alt="MF Ventures engineering team at work"
        className="animate-hero-kenburns absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/80 to-navy-950" />

      {/* Ambient glow accents — purely decorative, clipped by the section's overflow-hidden. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-20 -left-16 h-72 w-72 rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="animate-float-slow absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl [animation-delay:2.5s]" />
      </div>

      <div className="relative mx-auto flex min-h-[480px] w-full max-w-(--container-page) flex-col justify-center px-6 pt-20 md:min-h-[560px] lg:px-8">
        <p className="animate-fade-up text-xs font-semibold tracking-[0.2em] text-white/60 uppercase opacity-0 [animation-delay:100ms]">
          Services / Engineering Support
        </p>
        <h1 className="animate-fade-up mt-4 max-w-2xl text-4xl leading-tight font-extrabold text-white opacity-0 [animation-delay:250ms] md:text-5xl">
          Technical support built for the realities of the field.
        </h1>
        <p className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-white/75 opacity-0 [animation-delay:450ms]">
          From mechanical and electrical work to civil, marine and industrial
          operations, we bring the technical capability and heavy equipment
          needed to keep operations and projects moving.
        </p>
        <div className="animate-fade-up mt-8 opacity-0 [animation-delay:650ms]">
          <Button to="/contact" variant="primary" size="lg">
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <Section tone="light">
      <Reveal>
        <Eyebrow>What We Offer</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-ink md:text-4xl">
          Engineering capabilities
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Our technical services are organised by discipline, making it easy for
          clients to find the exact support they need.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((item, index) => (
          <Reveal key={item.title} delay={index * 100}>
            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EquipmentLeasing() {
  return (
    <Section tone="surface">
      <Reveal>
        <div className="grid grid-cols-1 items-center gap-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>Equipment Leasing</Eyebrow>
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
              Heavy equipment when you need it.
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
              Flexible access to equipment for projects and operational
              requirements, without the overhead of owning and maintaining a
              fleet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {LEASED_EQUIPMENT.map((item) => (
              <span
                key={item}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition-colors duration-200 hover:border-brand-blue hover:bg-brand-blue/5 hover:text-brand-blue"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function WrenchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 21v-9a1 1 0 011-1h4a1 1 0 011 1v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h0M8 12h0M8 16h0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AnchorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3a2 2 0 100 4 2 2 0 000-4z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 7v14M6 15a6 6 0 0012 0M4 11h4m8 0h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 15a8 8 0 1116 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 15l4-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 15h0"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7h10v9H3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13 11h4l3 3v2h-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
