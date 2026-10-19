export interface NavLink {
  label: string;
  href: string;
}

/** Single source of truth for primary navigation, shared by the header and footer. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/** Routes whose first section is a full-bleed hero photo — the header floats
 * transparently over these until the page scrolls. */
export const HERO_ROUTES = ["/", "/about", "/contact"];

export const SERVICE_LINKS: NavLink[] = [
  { label: "Mechanical Solutions & Engineering", href: "/services/mechanical-engineering" },
  { label: "Civil Engineering & Infrastructure", href: "/services/civil-infrastructure" },
  { label: "Oil & Gas Procurement Support", href: "/services/procurement-support" },
  { label: "General Contracts & Trading", href: "/services/contracts-trading" },
];
