import type { ReactNode } from "react";
import { Button, Card, Eyebrow, Reveal, Section } from "@/components/ui";
import heroPhoto from "@/assets/images/service-procurement.png";

interface MaterialCategory {
  icon: ReactNode;
  title: string;
  description: string;
}

const CATEGORIES: MaterialCategory[] = [
  {
    icon: <GearIcon />,
    title: "Mechanical Materials",
    description:
      "Pipes, valves, pumps, bearings, seals, filters and mechanical spares.",
  },
  {
    icon: <BoltIcon />,
    title: "Electrical Materials",
    description:
      "Cables, panels, circuit breakers, transformers and earthing systems.",
  },
  {
    icon: <GaugeIcon />,
    title: "Instrumentation & Control",
    description:
      "Transmitters, flow meters, control valves, PLC and SCADA components.",
  },
  {
    icon: <BuildingIcon />,
    title: "Civil & Construction",
    description:
      "Cement, structural steel, reinforcement, coatings and waterproofing.",
  },
  {
    icon: <DropletIcon />,
    title: "Plumbing Materials",
    description: "Pipes, pumps, tanks, valves and sanitary fittings.",
  },
  {
    icon: <SparkIcon />,
    title: "Welding & Fabrication",
    description:
      "Electrodes, welding machines, industrial gases and abrasives.",
  },
  {
    icon: <WrenchIcon />,
    title: "Industrial Tools & Equipment",
    description: "Power and hand tools, torque equipment, hoists and winches.",
  },
  {
    icon: <HookIcon />,
    title: "Lifting Equipment",
    description: "Wire ropes, slings, shackles, hooks and crane accessories.",
  },
  
];

const OEM_BRANDS = [
  "Caterpillar",
  "Cummins",
  "Perkins",
  "FG Wilson",
  "JCB",
  "Komatsu",
  "Volvo",
  "Siemens",
  "ABB",
  "Schneider Electric",
  "Eaton",
  "Rockwell Automation",
  "Honeywell",
  "Emerson",
  "Endress+Hauser",
  "Yokogawa",
  "WIKA",
  "Parker Hannifin",
  "SKF",
  "Flowserve",
  "KSB",
  "Fisher",
  "Rosemount",
  "Fluke",
  "Dräger",
  "MSA Safety",
];
const MARQUEE_BRANDS = [...OEM_BRANDS, ...OEM_BRANDS];

export default function ProcurementSupport() {
  return (
    <>
      <Hero />
      <Categories />
      <OemPartners />
      <CallToAction />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[480px] overflow-hidden bg-navy-950 md:min-h-[560px]">
      <img
        src={heroPhoto}
        alt="MF Ventures industrial materials and equipment procurement"
        className="animate-hero-kenburns absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/80 to-navy-950" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-20 -left-16 h-72 w-72 rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="animate-float-slow absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl [animation-delay:2.5s]" />
      </div>

      <div className="relative mx-auto flex min-h-[480px] w-full max-w-(--container-page) flex-col justify-center px-6 pt-20 md:min-h-[560px] lg:px-8">
        <p className="animate-fade-up text-xs font-semibold tracking-[0.2em] text-white/60 uppercase opacity-0 [animation-delay:100ms]">
          Services / Procurement Services
        </p>
        <h1 className="animate-fade-up mt-4 max-w-2xl text-4xl leading-tight font-extrabold text-white opacity-0 [animation-delay:250ms] md:text-5xl">
          The right materials, from the right partners, on time.
        </h1>
        <p className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-white/75 opacity-0 [animation-delay:450ms]">
          We source industrial materials, equipment, spare parts and engineering
          consumables for the oil & gas, energy, marine and industrial sectors —
          backed by strategic relationships with OEMs and authorised
          distributors worldwide.
        </p>
        <div className="animate-fade-up mt-8 opacity-0 [animation-delay:650ms]">
          <Button to="/contact" variant="primary" size="lg">
            Request a Quote
          </Button>
        </div>
        <a
          href="/certificates/mf-ventures-iso-9001-2015.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-fade-up mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 opacity-0 transition-colors duration-200 [animation-delay:800ms] hover:text-white"
       >
          <ShieldCheckIcon />
          ISO 9001:2015 Certified — View Certificate
        </a>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <Section tone="light">
      <Reveal>
        <Eyebrow>What We Source</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-ink md:text-4xl">
          Procurement across every material category
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          From mechanical and electrical materials to safety equipment and OEM
          spare parts, our procurement capability spans the categories
          industrial operations depend on.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((item, index) => (
          <Reveal key={item.title} delay={index * 60}>
            <Card className="h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                {item.icon}
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {item.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function OemPartners() {
  return (
    <Section tone="surface" padding="sm">
      <Reveal>
        <p className="text-center text-sm text-muted">
          Strategic relationships with OEMs and authorised distributors
          worldwide
        </p>
      </Reveal>
      <div className="group mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="animate-marquee flex w-max items-center gap-3 group-hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {MARQUEE_BRANDS.map((brand, index) => (
            <span
              key={`${brand}-${index}`}
              className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-ink/70"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

function CallToAction() {
  return (
    <Section tone="light">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-navy-950 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Need materials or equipment sourced?
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">
              Tell us what your project requires and our procurement team will
              handle the sourcing, quality assurance and delivery.
            </p>
          </div>
          <Button
            to="/contact"
            variant="secondary"
            size="lg"
            className="shrink-0"
          >
            Request a Quote
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}

function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V19a2 2 0 11-4 0v-.2a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H5a2 2 0 110-4h.2a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H11a1.6 1.6 0 001-1.5V5a2 2 0 114 0v.2a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V11a1.6 1.6 0 001.5 1h.2a2 2 0 110 4h-.2a1.6 1.6 0 00-1.5 1z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function GaugeIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function BuildingIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function DropletIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 19L19 5M9 5l10 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5 5l3 3M16 16l3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function HookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v10a4 4 0 004 4h0a3 3 0 10-3-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 3h6M10 3v6l-5 9a1.5 1.5 0 001.3 2.2h11.4A1.5 1.5 0 0019 18l-5-9V3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 5a8 8 0 1010 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FanIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 10c0-3 1-7 4-7s3 4 1 6M14 12c3 0 7 1 7 4s-4 3-6 1M12 14c0 3-1 7-4 7s-3-4-1-6M10 12c-3 0-7-1-7-4s4-3 6-1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AnchorIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function SignalIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 19v-4M10 19v-8M15 19V7M20 19V4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8l9-5 9 5-9 5-9-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3 8v8l9 5 9-5V8M12 13v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
