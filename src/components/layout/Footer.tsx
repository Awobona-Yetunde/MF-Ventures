import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SERVICE_LINKS } from "@/lib/nav";
import logo from "@/assets/images/logo-mfventures.png";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto w-full max-w-(--container-page) px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" aria-label="MF Ventures home">
              <img src={logo} alt="MF Ventures" className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-muted">
              Engineering, procurement, and industrial support for diverse project requirements.
            </p>
          </div>

          <FooterColumn title="Quick Links">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm text-muted transition-colors hover:text-brand-blue">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Our Services">
            {SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm text-muted transition-colors hover:text-brand-blue">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a href="mailto:info@mfventures.com" className="text-sm text-muted transition-colors hover:text-brand-blue">
                Email address
              </a>
            </li>
            <li>
              <a href="tel:+2340000000000" className="text-sm text-muted transition-colors hover:text-brand-blue">
                Phone number
              </a>
            </li>
            <li>
              <span className="text-sm text-muted">Office Address</span>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted transition-colors hover:text-brand-blue">
                Request a quote
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-black/5 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            ©{CURRENT_YEAR} <span className="font-semibold text-ink">MF VENTURES</span>. All rights reserved
          </p>
          <Link to="/privacy-policy" className="hover:text-brand-blue">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}
