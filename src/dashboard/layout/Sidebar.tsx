import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { DASHBOARD_NAV } from "@/dashboard/nav";
import type { Role } from "@/dashboard/types";
import logo from "@/assets/images/logo-mfventures.png";

interface SidebarProps {
  role: Role;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ role, className, onNavigate }: SidebarProps) {
  const items = DASHBOARD_NAV.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-black/20 bg-navy-950",
        className,
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <img
          src={logo}
          alt="MF Ventures"
          className="h-7 w-auto brightness-0 invert"
        />
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="Dashboard"
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/dashboard"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white",
                isActive && "border-brand-blue bg-white/10 text-white",
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
