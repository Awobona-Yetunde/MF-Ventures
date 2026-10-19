import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui";
import { HERO_ROUTES, NAV_LINKS } from "@/lib/nav";
import logo from "@/assets/images/logo-mfventures.png";
import { cn } from "@/lib/cn";

const SCROLL_THRESHOLD = 32;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const closeMenu = () => setIsOpen(false);

  const canFloat = HERO_ROUTES.includes(pathname);
  const isTransparent = canFloat && !scrolled && !isOpen;

  // Track scroll position so the header can switch from a transparent
  // overlay (over the hero photo) to a solid bar once the page scrolls.
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
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="MF Ventures home"
        >
          <img
            src={logo}
            alt="MF Ventures"
            className={cn(
              "h-8 w-auto transition-all",
              isTransparent && "brightness-0 invert",
            )}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
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
                  isActive &&
                    cn(
                      "font-semibold after:scale-x-100",
                      isTransparent ? "text-white" : "text-brand-blue",
                    ),
                )
              }
            >
              {link.label}
            </RouterNavLink>
          ))}
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
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-black/5 bg-white md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
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
            ))}
            <div
              className="mt-3 flex flex-col gap-2"
              onClickCapture={closeMenu}
            >
              <Button
                to="/dashboard/login"
                variant="secondary"
                className="w-full border border-ink/10"
              >
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

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6H20M4 12H20M4 18H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
