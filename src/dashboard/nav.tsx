import type { ReactNode } from "react";
import type { Role } from "@/dashboard/types";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** Roles that should see this nav item. Admin-only items say so explicitly in the spec. */
  roles: Role[];
}

const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

const icons = {
  dashboard: (
    <svg {...iconProps}>
      <path d="M4 4h7v7H4V4zm9 0h7v4h-7V4zm0 7h7v9h-7v-9zM4 14h7v6H4v-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  equipment: (
    <svg {...iconProps}>
      <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  repairs: (
    <svg {...iconProps}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  approvals: (
    <svg {...iconProps}>
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  history: (
    <svg {...iconProps}>
      <path d="M3 12a9 9 0 109-9 9 9 0 00-9 9zm9-5v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  costs: (
    <svg {...iconProps}>
      <path d="M12 2v20M17 6.5c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  reports: (
    <svg {...iconProps}>
      <path d="M4 19V5a1 1 0 011-1h12l3 3v12a1 1 0 01-1 1H5a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 13v4M12 10v7M16 15v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  users: (
    <svg {...iconProps}>
      <path d="M16 19v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 17.5V19M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM20 19v-1.5a3 3 0 00-2.2-2.9M14.5 4.2a3.5 3.5 0 010 6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  settings: (
    <svg {...iconProps}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V19a2 2 0 11-4 0v-.2a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H5a2 2 0 110-4h.2a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H11a1.6 1.6 0 001-1.5V5a2 2 0 114 0v.2a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V11a1.6 1.6 0 001.5 1h.2a2 2 0 110 4h-.2a1.6 1.6 0 00-1.5 1z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  notifications: (
    <svg {...iconProps}>
      <path d="M18 16v-5a6 6 0 10-12 0v5l-1.5 2h15L18 16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

/** Full nav list; each screen filters to the items its role can see. */
export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: icons.dashboard, roles: ["mechanic", "supervisor", "md", "admin"] },
  { label: "Equipment", href: "/dashboard/equipment", icon: icons.equipment, roles: ["mechanic", "supervisor", "md", "admin"] },
  { label: "Repair Requests", href: "/dashboard/repair-requests", icon: icons.repairs, roles: ["mechanic", "supervisor", "md", "admin"] },
  { label: "Approval Queue", href: "/dashboard/approvals", icon: icons.approvals, roles: ["supervisor", "md"] },
  { label: "Repair History", href: "/dashboard/history", icon: icons.history, roles: ["mechanic", "supervisor", "md", "admin"] },
  { label: "Costs / Parts", href: "/dashboard/costs", icon: icons.costs, roles: ["supervisor", "md", "admin"] },
  { label: "Reports", href: "/dashboard/reports", icon: icons.reports, roles: ["supervisor", "md", "admin"] },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: icons.notifications,
    roles: ["mechanic", "supervisor", "md", "admin"],
  },
  { label: "User Management", href: "/dashboard/users", icon: icons.users, roles: ["admin"] },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: icons.settings,
    roles: ["mechanic", "supervisor", "md", "admin"],
  },
];
