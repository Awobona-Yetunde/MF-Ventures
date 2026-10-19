import type { Notification } from "@/dashboard/types";

// Seed data only — routed per the spec's Notifications section (new fault →
// assigned Supervisor, Supervisor approval → MD, MD approval → mechanic,
// request for information → submitting mechanic, completion → Supervisor/
// Admin). Notifications created at runtime (an approval, a new report) are
// appended on top of this list by the dashboard data provider.
export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    message: "RR-2026-0002 is awaiting your final approval — marked Critical.",
    timestamp: "2026-10-09T08:05:00+01:00",
    read: false,
    recipientUserId: "u-md-1",
    relatedRequestId: "RR-2026-0002",
  },
  {
    id: "n2",
    message: "Your report RR-2026-0002 was approved by Grace Nwosu and escalated to the MD.",
    timestamp: "2026-10-09T08:05:00+01:00",
    read: false,
    recipientUserId: "u-mech-2",
    relatedRequestId: "RR-2026-0002",
  },
  {
    id: "n3",
    message: "New fault reported: RR-2026-0003 is awaiting your approval.",
    timestamp: "2026-10-11T09:05:00+01:00",
    read: false,
    recipientUserId: "u-sup-1",
    relatedRequestId: "RR-2026-0003",
  },
  {
    id: "n4",
    message: "RR-2026-0005 is approved and waiting on parts from the vendor.",
    timestamp: "2026-10-03T08:35:00+01:00",
    read: false,
    recipientUserId: "u-admin-1",
    relatedRequestId: "RR-2026-0005",
  },
  {
    id: "n5",
    message: "RR-2026-0004 repair completed and verified by Peter Effiong.",
    timestamp: "2026-09-22T16:05:00+01:00",
    read: true,
    recipientUserId: "u-sup-2",
    relatedRequestId: "RR-2026-0004",
  },
  {
    id: "n6",
    message: "Supervisor Grace Nwosu requested more information on RR-2026-0006.",
    timestamp: "2026-10-08T16:20:00+01:00",
    read: false,
    recipientUserId: "u-mech-1",
    relatedRequestId: "RR-2026-0006",
  },
];
