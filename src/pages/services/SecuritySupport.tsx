import type { ReactNode } from "react";
import { Button, Card, Eyebrow, Reveal, Section } from "@/components/ui";
import heroPhoto from "@/assets/images/service-project.png";

interface Capability {
  icon: ReactNode;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: <GuardIcon />,
    title: "Security Personnel",
    description: "Site and facility security support.",
  },
  {
    icon: <CameraIcon />,
    title: "Surveillance & CCTV",
    description: "Monitoring and surveillance solutions.",
  },
  {
    icon: <LocationIcon />,
    title: "Vehicle Tracking",
    description: "Asset and vehicle tracking support.",
  },
  {
    icon: <PipelineIcon />,
    title: "Pipeline Monitoring",
    description: "Monitoring of critical infrastructure.",
  },
  {
    icon: <ClockIcon />,
    title: "24/7 Monitoring",
    description: "Continuous operational oversight.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Asset Protection",
    description: "Security support for industrial assets.",
  },
];

export default function SecuritySupport() {
  return (
    <>
      <Hero />
      <Capabilities />
      <CallToAction />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[480px] overflow-hidden bg-navy-950 md:min-h-[560px]">
      <img
        src={heroPhoto}
        alt="MF Ventures security and monitoring support on site"
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
          Services / Security Support
        </p>
        <h1 className="animate-fade-up mt-4 max-w-2xl text-4xl leading-tight font-extrabold text-white opacity-0 [animation-delay:250ms] md:text-5xl">
          Protecting people, equipment and critical infrastructure.
        </h1>
        <p className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-white/75 opacity-0 [animation-delay:450ms]">
          Professional protection and monitoring built around the demands of
          industrial sites — from personnel on the ground to round-the-clock
          surveillance of the assets that keep operations running.
        </p>
        <div className="animate-fade-up mt-8 opacity-0 [animation-delay:650ms]">
          <Button to="/contact" variant="primary" size="lg">
            Request a Service
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
        <Eyebrow>Security & Monitoring</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-ink md:text-4xl">
          Coverage for every layer of the site
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Professional protection and monitoring for people, equipment,
          facilities and critical infrastructure.
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

function CallToAction() {
  return (
    <Section tone="light">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-navy-950 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Need the right support for your project?
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">
              Talk to our team about procurement, engineering, equipment or
              security requirements.
            </p>
          </div>
          <Button
            to="/contact"
            variant="secondary"
            size="lg"
            className="shrink-0"
          >
            Request a Service
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}

function GuardIcon() {
  return (
    <svg
      width="20"
      height="20"
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
        d="M9.5 12l1.8 1.8L15 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 8a1 1 0 011-1h2l1.2-1.6A1 1 0 019 5h6a1 1 0 01.8.4L17 7h2a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 16a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PipelineIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9h18M3 15h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 9v6M17 9v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M11 12h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 7v5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
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
