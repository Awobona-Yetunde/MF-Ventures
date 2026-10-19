import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HERO_ROUTES } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function Layout() {
  const { pathname } = useLocation();
  // Hero routes handle their own top spacing (the photo bleeds behind the
  // floating header); every other page needs clearance since the header
  // is fixed and no longer takes up flow space.
  const hasHero = HERO_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn("flex-1", !hasHero && "pt-20")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
