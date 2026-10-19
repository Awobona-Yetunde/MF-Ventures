import type { ReactNode } from "react";
import { Button, Eyebrow } from "@/components/ui";
import { Section } from "@/components/ui";
import engineeringPhoto from "@/assets/images/service-engineering.png";
import procurementPhoto from "@/assets/images/service-procurement.png";
import projectPhoto from "@/assets/images/service-project.png";

interface ServiceCard {
  image: string;
  icon: ReactNode;
  title: string;
  description: string;
}

const SERVICES: ServiceCard[] = [
  {
    image: engineeringPhoto,
    icon: <GearIcon />,
    title: "Engineering Support",
    description:
      "We provide technical and engineering assistance to support equipment, site operations and project requirements.",
  },
  {
    image: procurementPhoto,
    icon: <SupplyIcon />,
    title: "Procurement & Supply",
    description:
      "We support the sourcing and supply of equipment, materials, and other operational requirements, helping clients find suitable resources and move them through the procurement process efficiently.",
  },
  {
    image: projectPhoto,
    icon: <WrenchIcon />,
    title: "Project Support",
    description:
      "From planning and coordination to on-site support, we help keep project activities organised and aligned with operational requirements. Our support is focused on helping teams move efficiently from project requirements toward execution.",
  },
];

export function WhatWeDo() {
  return (
    <Section tone="navy">
      <Eyebrow light>What We Do</Eyebrow>
      <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-white md:text-4xl">
        Expertise Across the Operation
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
        Engineering, infrastructure, procurement, and technical trading — bringing the right capabilities together
        to meet complex project and business requirements.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCardItem key={service.title} {...service} />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button to="/services" variant="secondary">
          Explore service
        </Button>
      </div>
    </Section>
  );
}

function ServiceCardItem({ image, icon, title, description }: ServiceCard) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-2 text-white">
          {icon}
          <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{description}</p>
      </div>
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V19a2 2 0 11-4 0v-.2a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H5a2 2 0 110-4h.2a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H11a1.6 1.6 0 001-1.5V5a2 2 0 114 0v.2a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V11a1.6 1.6 0 001.5 1h.2a2 2 0 110 4h-.2a1.6 1.6 0 00-1.5 1z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function SupplyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11v10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
