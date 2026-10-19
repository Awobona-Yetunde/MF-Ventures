import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui";

interface InfoItem {
  icon: ReactNode;
  title: string;
  lines: string[];
}

const ITEMS: InfoItem[] = [
  {
    icon: <PinIcon />,
    title: "Visit us",
    lines: [
      "Lagos office: AVM Complex Building, wing A, first floor, KM 4 Lekki Epe expressway, Ologolo, Lekki, Lagos",
      "Warri office: 14 Umez Eronini street or MCC Road, Enerhen, Warri, Delta State, Nigeria",
    ],
  },
  {
    icon: <ChatIcon />,
    title: "Chat with us",
    lines: ["+2348063937722, we will respond within 24 hours."],
  },
  {
    icon: <PhoneIcon />,
    title: "Call us",
    lines: ["+2348037947849"],
  },
];

interface ContactInfoProps {
  /** Which background this sits on, so text/icon colors stay readable. */
  tone?: "light" | "navy";
}

export function ContactInfo({ tone = "navy" }: ContactInfoProps) {
  const isNavy = tone === "navy";

  return (
    <div>
      <Eyebrow light={isNavy}>Contact Us</Eyebrow>
      <h2 className={cn("mt-4 text-3xl font-extrabold leading-tight md:text-4xl", isNavy ? "text-white" : "text-ink")}>
        We are here to help
      </h2>
      <p className={cn("mt-4 max-w-md text-base leading-relaxed", isNavy ? "text-white/70" : "text-muted")}>
        Have some question or further assistance? Contact us at Mf ventures for support or discuss your project
      </p>

      <div className="mt-8 space-y-6">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isNavy ? "bg-white/10 text-white" : "bg-brand-blue/10 text-brand-blue",
              )}
            >
              {item.icon}
            </div>
            <div>
              <h3 className={cn("text-sm font-bold", isNavy ? "text-white" : "text-ink")}>{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className={cn("mt-1 text-sm leading-relaxed", isNavy ? "text-white/70" : "text-muted")}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.3 7-12a7 7 0 10-14 0c0 5.7 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a8 8 0 01-11.8 7L3 20l1.3-4A8 8 0 1121 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.5 4.7 6.1 6.1l2-2a1 1 0 011-.25c1.1.37 2.3.57 3.5.57a1 1 0 011 1V19a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2h2.7a1 1 0 011 1c0 1.2.2 2.4.57 3.5a1 1 0 01-.25 1l-2 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
