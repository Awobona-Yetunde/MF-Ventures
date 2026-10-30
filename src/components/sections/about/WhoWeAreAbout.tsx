import type { ReactNode } from "react";
import { Eyebrow, Section } from "@/components/ui";

interface Accreditation {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

const ACCREDITATIONS: Accreditation[] = [
  {
    icon: <ShieldIcon />,
    title: "ISO 9001 Certified",
    description:
      "Quality Management. A commitment to maintaining consistent processes and delivering services that meet established quality requirements.",
    href: "/certificates/mf-ventures-iso-9001-2015.pdf",
  },
  {
    icon: <ShieldIcon />,
    title: "CAC Registered",
    description:
      "We are officially registered with Nigeria's Corporate Affairs Commission.",
  },
  {
    icon: <CheckBadgeIcon />,
    title: "COREN Registered",
    description:
      "We meet applicable engineering registration requirements in Nigeria.",
  },
];

export function WhoWeAreAbout() {
  return (
    <Section tone="surface">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Who We Are</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            Built on experience, focus on what's next
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            For over 15 years, MF Ventures Services Ltd Group has been
            developing its role within the engineering, procurement, and oil and
            gas industry space. What began with a focus on meeting specific
            industry requirements has grown into a broader approach to
            supporting the technical, material, and operational needs that keep
            projects and operations moving.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            We understand that behind every successful project is a network of
            people, resources, equipment, materials, and decisions that need to
            come together at the right time. Our role is to provide support
            across these moving parts, helping clients navigate their
            requirements with a practical and organised approach. Our work spans
            engineering support, procurement and supply, and project
            coordination.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-ink uppercase">
            Our Accreditations
          </h3>
          <div className="mt-5 space-y-4">
            {ACCREDITATIONS.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:text-brand-blue hover:underline"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function ShieldIcon() {
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
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
