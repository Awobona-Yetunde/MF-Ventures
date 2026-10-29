import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui";
import { HERO_ROUTES, NAV_LINKS, SERVICE_LINKS } from "@/lib/nav";
import logo from "@/assets/images/logo-mfventures.png";
import { cn } from "@/lib/cn";

const SCROLL_THRESHOLD = 32;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const closeMenu = () => {
    setIsOpen(false);
    setMobileServicesOpen(false);
  };

  const canFloat = HERO_ROUTES.includes(pathname);
  const isTransparent = canFloat && !scrolled && !isOpen;

  useEffect(() => {
    if (!canFloat) return;

    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [canFloat]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300",
        isTransparent
          ? "bg-gradient-to-b from-black/45 via-black/15 to-transparent"
          : "border-b border-black/5 bg-white/95 backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-(--container-page) items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="MF Ventures home">
          <img
            src={logo}
            alt="MF Ventures"
            className={cn("h-8 w-auto transition-all", isTransparent && "brightness-0 invert")}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.href === "/services" ? (
              <ServicesNavItem key={link.href} label={link.label} href={link.href} isTransparent={isTransparent} />
            ) : (
              <RouterNavLink
                key={link.href}
                to={link.href}
                // "/" is a prefix of every route, so without `end` the Home
                // link would stay "active" on every page.
                end={link.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative pb-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:scale-x-0 after:rounded-full after:transition-transform after:content-['']",
                    isTransparent
                      ? "text-white/90 hover:text-white after:bg-white"
                      : "text-ink/80 hover:text-brand-blue after:bg-brand-blue",
                    isActive && cn("font-semibold after:scale-x-100", isTransparent ? "text-white" : "text-brand-blue"),
                  )
                }
              >
                {link.label}
              </RouterNavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            to="/dashboard/login"
            variant={isTransparent ? "outline-light" : "secondary"}
            size="md"
            className={isTransparent ? undefined : "border border-ink/10"}
          >
            Login
          </Button>
          <Button to="/contact" variant="primary" size="md">
            Request a Quote
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden",
            isTransparent ? "text-white" : "text-ink",
          )}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsOpen((open) => !open)}
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {isOpen && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-black/5 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) =>
              link.href === "/services" ? (
                <div key={link.href}>
                  <div className="flex items-center justify-between rounded-md px-3 py-2.5">
                    <RouterNavLink
                      to={link.href}
                      end
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn("flex-1 text-sm font-medium text-ink/80", isActive && "font-semibold text-brand-blue")
                      }
                    >
                      {link.label}
                    </RouterNavLink>
                    <button
                      type="button"
                      aria-label={mobileServicesOpen ? "Collapse services" : "Expand services"}
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      className="flex h-8 w-8 items-center justify-center text-ink/60"
                    >
                      <ChevronIcon className={cn("transition-transform duration-200", mobileServicesOpen && "rotate-180")} />
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-black/10 pl-4">
                      {SERVICE_LINKS.map((service) => (
                        <Link
                          key={service.href}
                          to={service.href}
                          onClick={closeMenu}
                          className="rounded-md px-3 py-2 text-sm text-ink/70 hover:text-brand-blue"
                        >
                          {service.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <RouterNavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium text-ink/80",
                      isActive && "bg-surface font-semibold text-brand-blue",
                    )
                  }
                >
                  {link.label}
                </RouterNavLink>
              ),
            )}
            <div className="mt-3 flex flex-col gap-2" onClickCapture={closeMenu}>
              <Button to="/dashboard/login" variant="secondary" className="w-full border border-ink/10">
                Login
              </Button>
              <Button to="/contact" variant="primary" className="w-full">
                Request a Quote
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

/** The "Service" nav item: a normal link that also reveals a dropdown of every service on hover or focus. */
function ServicesNavItem({ label, href, isTransparent }: { label: string; href: string; isTransparent: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <RouterNavLink
        to={href}
        end
        className={({ isActive }) =>
          cn(
            "relative flex items-center gap-1.5 pb-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:scale-x-0 after:rounded-full after:transition-transform after:content-['']",
            isTransparent
              ? "text-white/90 hover:text-white after:bg-white"
              : "text-ink/80 hover:text-brand-blue after:bg-brand-blue",
            isActive && cn("font-semibold after:scale-x-100", isTransparent ? "text-white" : "text-brand-blue"),
          )
        }
      >
        {label}
        <ChevronIcon className={cn("transition-transform duration-200", open && "rotate-180")} />
      </RouterNavLink>

      <div
        className={cn(
          "absolute top-full left-1/2 w-80 -translate-x-1/2 pt-3 transition-all duration-200 ease-out",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-xl border border-black/5 bg-white py-2 shadow-xl ring-1 ring-black/5">
          {SERVICE_LINKS.map((service) => (
            <Link
              key={service.href}
              to={service.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-surface hover:text-brand-blue"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                <ServiceIcon />
              </span>
              {service.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
