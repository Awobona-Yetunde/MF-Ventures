import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { EQUIPMENT, REPAIR_REQUESTS, USERS } from "@/dashboard/data/mockData";
import { NOTIFICATIONS } from "@/dashboard/data/notifications";
import { generateNextRequestId, getSupervisorForSite } from "@/dashboard/data/selectors";
import type {
  ApprovalDecision,
  Equipment,
  EquipmentInput,
  FaultReportInput,
  Notification,
  RepairAction,
  RepairActionInput,
  RepairRequest,
  Role,
  User,
} from "@/dashboard/types";

const SESSION_STORAGE_KEY = "mfv-dashboard-session-user-id";

function nowIso(): string {
  return new Date().toISOString();
}

function nextActionId(existing: RepairAction[]): string {
  return `ra-${existing.length + 1}-${Date.now().toString(36)}`;
}

interface AddUserInput {
  name: string;
  email: string;
  role: Role;
  site: string;
}

interface AddUserResult {
  user: User;
  inviteLink: string;
}

interface DashboardContextValue {
  // Session — stands in for real auth until a backend exists. A real
  // implementation swaps `login`/`logout` for API calls and keeps the same
  // shape, so nothing downstream (route guards, nav, Topbar) has to change.
  currentUser: User | null;
  login: (email: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;

  // Reference data
  equipment: Equipment[];
  repairRequests: RepairRequest[];
  notifications: Notification[];
  users: User[];

  // Mutations — every write stays in memory for this browser tab only,
  // matching the rest of this dashboard until there's an API to persist to.
  submitFaultReport: (input: FaultReportInput, reporter: User) => RepairRequest;
  decideSupervisor: (requestId: string, decision: ApprovalDecision, comment: string, supervisor: User) => void;
  decideMd: (requestId: string, decision: ApprovalDecision, comment: string, md: User) => void;
  addRepairAction: (requestId: string, input: RepairActionInput, performedBy: User) => void;
  setPendingParts: (requestId: string) => void;
  resumeRepair: (requestId: string) => void;
  markCompleted: (requestId: string) => void;
  markNotificationRead: (id: string) => void;
  addUser: (input: AddUserInput) => AddUserResult | { error: string };
  addEquipment: (input: EquipmentInput) => Equipment | { error: string };
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(USERS);
  const [equipment, setEquipment] = useState<Equipment[]>(EQUIPMENT);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>(REPAIR_REQUESTS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);

  const notify = useCallback((recipientUserId: string, message: string, relatedRequestId?: string) => {
    if (!recipientUserId) return;
    setNotifications((prev) => [
      { id: `n-${Date.now().toString(36)}-${recipientUserId}`, message, timestamp: nowIso(), read: false, recipientUserId, relatedRequestId },
      ...prev,
    ]);
  }, []);

  const login = useCallback(
    (email: string): { ok: true } | { ok: false; error: string } => {
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) {
        return { ok: false, error: "No account found for that email." };
      }
      if (match.status !== "Active") {
        return { ok: false, error: "This account hasn't completed setup yet. Check your invite email." };
      }
      setCurrentUserId(match.id);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, match.id);
      } catch {
        // Private browsing / storage disabled — session just won't survive a refresh.
      }
      return { ok: true };
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage was never written to.
    }
  }, []);

  const submitFaultReport = useCallback(
    (input: FaultReportInput, reporter: User): RepairRequest => {
      const equipmentItem = equipment.find((eq) => eq.id === input.equipmentId);
      const supervisor = equipmentItem ? getSupervisorForSite(users, equipmentItem.site) : undefined;

      const newRequest: RepairRequest = {
        id: generateNextRequestId(repairRequests),
        equipmentId: input.equipmentId,
        faultType: input.faultType,
        priority: input.priority,
        status: "Pending Supervisor Approval",
        faultDescription: input.faultDescription,
        faultReportedBy: reporter.name,
        faultDetectedBy: input.faultDetectedBy.trim() || reporter.name,
        repairRecommendation: input.repairRecommendation,
        reportedAt: input.reportedAt,
        reportedByUserId: reporter.id,
        assignedSupervisorId: supervisor?.id ?? "",
        supervisorApproval: null,
        mdApproval: null,
        repairActions: [],
        estimatedCost: input.estimatedCost,
        completedAt: null,
      };

      setRepairRequests((prev) => [newRequest, ...prev]);

      if (supervisor) {
        notify(supervisor.id, `New fault reported: ${newRequest.id} is awaiting your approval.`, newRequest.id);
      }

      return newRequest;
    },
    [equipment, repairRequests, users, notify],
  );

  const decideSupervisor = useCallback(
    (requestId: string, decision: ApprovalDecision, comment: string, supervisor: User) => {
      setRepairRequests((prev) =>
        prev.map((rr) => {
          if (rr.id !== requestId) return rr;
          return {
            ...rr,
            status: decision === "Approved" ? "Pending MD Approval" : "Rejected / Returned",
            supervisorApproval: {
              userId: supervisor.id,
              userName: supervisor.name,
              role: "supervisor",
              decision,
              comment,
              timestamp: nowIso(),
            },
          };
        }),
      );

      const request = repairRequests.find((rr) => rr.id === requestId);
      if (!request) return;

      if (decision === "Approved") {
        const md = users.find((u) => u.role === "md");
        if (md) {
          const urgency = request.priority === "Critical" ? " — marked Critical." : ".";
          notify(md.id, `${requestId} is awaiting your final approval${urgency}`, requestId);
        }
      } else {
        notify(
          request.reportedByUserId,
          decision === "Rejected / Returned"
            ? `Your report ${requestId} was returned by ${supervisor.name}: "${comment}"`
            : `Supervisor ${supervisor.name} requested more information on ${requestId}: "${comment}"`,
          requestId,
        );
      }
    },
    [repairRequests, users, notify],
  );

  const decideMd = useCallback(
    (requestId: string, decision: ApprovalDecision, comment: string, md: User) => {
      setRepairRequests((prev) =>
        prev.map((rr) => {
          if (rr.id !== requestId) return rr;
          return {
            ...rr,
            status: decision === "Approved" ? "Repair In Progress" : "Rejected / Returned",
            mdApproval: {
              userId: md.id,
              userName: md.name,
              role: "md",
              decision,
              comment,
              timestamp: nowIso(),
            },
          };
        }),
      );

      const request = repairRequests.find((rr) => rr.id === requestId);
      if (!request) return;

      if (decision === "Approved") {
        setEquipment((prev) =>
          prev.map((eq) =>
            eq.id === request.equipmentId && eq.status !== "Out of Service" ? { ...eq, status: "Under Maintenance" } : eq,
          ),
        );
        notify(request.reportedByUserId, `${requestId} has final approval — you're clear to begin the repair.`, requestId);
      } else {
        notify(
          request.reportedByUserId,
          decision === "Rejected / Returned"
            ? `Your report ${requestId} was returned by ${md.name}: "${comment}"`
            : `MD ${md.name} requested more information on ${requestId}: "${comment}"`,
          requestId,
        );
      }
    },
    [repairRequests, notify],
  );

  const addRepairAction = useCallback(
    (requestId: string, input: RepairActionInput, performedBy: User) => {
      const partsCost = input.quantity && input.unitCost ? input.quantity * input.unitCost : 0;
      const totalCost = partsCost + (input.labourCost ?? 0);

      const action: Omit<RepairAction, "id"> = {
        date: input.date,
        action: input.action,
        partsUsed: input.partsUsed,
        quantity: input.quantity,
        unitCost: input.unitCost,
        labourCost: input.labourCost,
        totalCost,
        performedBy: performedBy.name,
        notes: input.notes,
      };

      setRepairRequests((prev) =>
        prev.map((rr) => {
          if (rr.id !== requestId) return rr;
          return { ...rr, repairActions: [...rr.repairActions, { ...action, id: nextActionId(rr.repairActions) }] };
        }),
      );

      const request = repairRequests.find((rr) => rr.id === requestId);
      if (request && totalCost > 0) {
        setEquipment((prev) =>
          prev.map((eq) =>
            eq.id === request.equipmentId ? { ...eq, totalMaintenanceCost: eq.totalMaintenanceCost + totalCost } : eq,
          ),
        );
      }
    },
    [repairRequests],
  );

  const setPendingParts = useCallback((requestId: string) => {
    setRepairRequests((prev) =>
      prev.map((rr) => (rr.id === requestId && rr.status === "Repair In Progress" ? { ...rr, status: "Pending Parts" } : rr)),
    );
  }, []);

  const resumeRepair = useCallback((requestId: string) => {
    setRepairRequests((prev) =>
      prev.map((rr) => (rr.id === requestId && rr.status === "Pending Parts" ? { ...rr, status: "Repair In Progress" } : rr)),
    );
  }, []);

  const markCompleted = useCallback(
    (requestId: string) => {
      const completedAt = nowIso();
      setRepairRequests((prev) =>
        prev.map((rr) => (rr.id === requestId ? { ...rr, status: "Repair Completed", completedAt } : rr)),
      );

      const request = repairRequests.find((rr) => rr.id === requestId);
      if (!request) return;

      setEquipment((prev) =>
        prev.map((eq) =>
          eq.id === request.equipmentId
            ? { ...eq, status: "Operational", lastMaintenanceDate: completedAt.slice(0, 10) }
            : eq,
        ),
      );

      const recipients = new Set<string>([request.assignedSupervisorId, ...users.filter((u) => u.role === "admin").map((u) => u.id)]);
      recipients.forEach((id) => notify(id, `${requestId} has been marked completed.`, requestId));
    },
    [repairRequests, users, notify],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const addUser = useCallback(
    (input: AddUserInput): AddUserResult | { error: string } => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();

      if (!name || !email) return { error: "Name and email are required." };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
      if (users.some((u) => u.email.toLowerCase() === email)) return { error: "A user with this email already exists." };

      const newUser: User = {
        id: `u-${crypto.randomUUID().slice(0, 8)}`,
        name,
        email,
        role: input.role,
        site: input.site,
        avatarInitials: name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
        status: "Invited",
      };

      // TODO(backend): the server creates the account, issues a real one-time
      // token, and emails the invite link — a password is never generated or
      // seen by an admin, even here.
      const inviteLink = `https://mfventures.com/dashboard/accept-invite?token=${crypto.randomUUID().split("-")[0]}`;

      setUsers((prev) => [...prev, newUser]);
      return { user: newUser, inviteLink };
    },
    [users],
  );

  const addEquipment = useCallback((input: EquipmentInput): Equipment | { error: string } => {
    const name = input.name.trim();
    const site = input.site.trim();

    if (!name) return { error: "Equipment name is required." };
    if (!site) return { error: "Location / Site is required." };

    const newEquipment: Equipment = {
      id: `eq-${crypto.randomUUID().slice(0, 8)}`,
      name,
      // Not collected by this quick-add form — editable later once the
      // Equipment profile supports it; everything else here is required
      // for the record to behave like the rest of the fleet (routing,
      // cost tracking, status).
      type: "General Equipment",
      registrationNumber: input.registrationNumber.trim() || "N/A",
      serialNumber: input.serialNumber.trim() || "N/A",
      modelNumber: input.modelNumber.trim() || "N/A",
      location: site,
      site,
      status: "Operational",
      lastMaintenanceDate: null,
      nextMaintenanceDate: null,
      totalMaintenanceCost: 0,
    };

    setEquipment((prev) => [...prev, newEquipment]);
    return newEquipment;
  }, []);

  const value = useMemo<DashboardContextValue>(
    () => ({
      currentUser,
      login,
      logout,
      equipment,
      repairRequests,
      notifications,
      users,
      submitFaultReport,
      decideSupervisor,
      decideMd,
      addRepairAction,
      setPendingParts,
      resumeRepair,
      markCompleted,
      markNotificationRead,
      addUser,
      addEquipment,
    }),
    [
      currentUser,
      login,
      logout,
      equipment,
      repairRequests,
      notifications,
      users,
      submitFaultReport,
      decideSupervisor,
      decideMd,
      addRepairAction,
      setPendingParts,
      resumeRepair,
      markCompleted,
      markNotificationRead,
      addUser,
      addEquipment,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

function useDashboardContext(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("Dashboard hooks must be used within a DashboardProvider.");
  return ctx;
}

export function useDashboardSession() {
  const { currentUser, login, logout } = useDashboardContext();
  return { user: currentUser, login, logout };
}

export function useDashboardData() {
  const {
    equipment,
    repairRequests,
    notifications,
    users,
    submitFaultReport,
    decideSupervisor,
    decideMd,
    addRepairAction,
    setPendingParts,
    resumeRepair,
    markCompleted,
    markNotificationRead,
    addUser,
    addEquipment,
  } = useDashboardContext();

  return {
    equipment,
    repairRequests,
    notifications,
    users,
    submitFaultReport,
    decideSupervisor,
    decideMd,
    addRepairAction,
    setPendingParts,
    resumeRepair,
    markCompleted,
    markNotificationRead,
    addUser,
    addEquipment,
  };
}