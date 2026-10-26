import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, me as apiMe } from "@/dashboard/api/auth";
import { clearTokens, getRefreshToken } from "@/dashboard/api/tokens";
import { refreshAccessToken, ApiError } from "@/dashboard/api/client";
import { createEquipment, listEquipment } from "@/dashboard/api/equipment";
import {
  cancelRepairRequest as apiCancelRepairRequest,
  createRepairRequest,
  getRepairRequest,
  listRepairRequests,
  assignMechanic as apiAssignMechanic,
  setEstimatedCost as apiSetEstimatedCost,
} from "@/dashboard/api/repairRequests";
import { decideAsMd, decideAsSupervisor, getApprovalQueue } from "@/dashboard/api/approvals";
import {
  addRepairAction as apiAddRepairAction,
  closeRepair as apiCloseRepair,
  completeRepair as apiCompleteRepair,
  resumeRepair as apiResumeRepair,
  setPendingParts as apiSetPendingParts,
  startRepair as apiStartRepair,
} from "@/dashboard/api/repairActions";
import { createUser, listUsers } from "@/dashboard/api/users";
import { listNotifications, markNotificationRead as apiMarkNotificationRead } from "@/dashboard/api/notifications";
import {
  dismissMaintenanceAlert as dismissMaintenanceAlertStorage,
  getDueMaintenanceAlerts,
} from "@/dashboard/data/maintenanceAlerts";
import type { MaintenanceAlert } from "@/dashboard/data/maintenanceAlerts";
import type {
  ApprovalDecision,
  Equipment,
  EquipmentInput,
  FaultReportInput,
  Notification,
  RepairActionInput,
  RepairRequest,
  User,
  UserCreateInput,
} from "@/dashboard/types";

/** Turns any thrown error into a message safe to show the user. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

interface DashboardContextValue {
  // Session
  currentUser: User | null;
  /** True until the silent session-restore check (via the stored refresh token) has resolved, one way or the other. */
  authReady: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;

  // Reference data — fetched once a session exists, refreshed after relevant mutations.
  equipment: Equipment[];
  equipmentLoading: boolean;
  refreshEquipment: () => Promise<void>;

  repairRequests: RepairRequest[];
  repairRequestsLoading: boolean;
  refreshRepairRequests: () => Promise<void>;
  /** Fetches one request's full detail (attachments, actions, approvals, audit trail) and merges it into the shared list. */
  loadRepairRequestDetail: (requestId: string) => Promise<RepairRequest>;

  approvalQueue: RepairRequest[];
  approvalQueueLoading: boolean;
  refreshApprovalQueue: () => Promise<void>;

  notifications: Notification[];
  notificationsLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;

  users: User[];
  usersLoading: boolean;
  refreshUsers: () => Promise<void>;

  // Maintenance-due alerts — computed client-side from equipment.nextMaintenanceDate;
  // the backend has no such notification type. Dismissal is kept per-browser.
  maintenanceAlerts: MaintenanceAlert[];
  dismissMaintenanceAlert: (alert: MaintenanceAlert) => void;

  // Mutations
  addEquipment: (input: EquipmentInput) => Promise<Equipment | { error: string }>;
  addUser: (input: UserCreateInput) => Promise<User | { error: string }>;
  submitFaultReport: (input: FaultReportInput) => Promise<RepairRequest | { error: string }>;
  decideSupervisor: (requestId: string, decision: ApprovalDecision, comment: string) => Promise<void>;
  decideMd: (requestId: string, decision: ApprovalDecision, comment: string) => Promise<void>;
  addRepairAction: (requestId: string, input: RepairActionInput) => Promise<void>;
  setPendingParts: (requestId: string, note?: string) => Promise<void>;
  resumeRepair: (requestId: string) => Promise<void>;
  startRepair: (requestId: string) => Promise<void>;
  completeRepair: (requestId: string, finalNotes?: string) => Promise<void>;
  closeRepair: (requestId: string) => Promise<void>;
  cancelRepairRequest: (requestId: string, reason?: string) => Promise<void>;
  assignMechanic: (requestId: string, mechanicId: string) => Promise<void>;
  setEstimatedCost: (requestId: string, amount: number) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);

  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [repairRequestsLoading, setRepairRequestsLoading] = useState(false);

  const [approvalQueue, setApprovalQueue] = useState<RepairRequest[]>([]);
  const [approvalQueueLoading, setApprovalQueueLoading] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Bumped on every dismissal so the derived alert list below recomputes —
  // the dismissal itself lives in localStorage, which React doesn't watch.
  const [maintenanceAlertsTick, setMaintenanceAlertsTick] = useState(0);

  // On mount, try to silently restore a session from the stored refresh
  // token — this is what lets a page reload keep the user signed in.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (!getRefreshToken()) {
        setAuthReady(true);
        return;
      }
      const refreshed = await refreshAccessToken();
      if (cancelled) return;
      if (!refreshed) {
        clearTokens();
        setAuthReady(true);
        return;
      }
      try {
        const user = await apiMe();
        if (!cancelled) setCurrentUser(user);
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshEquipment = useCallback(async () => {
    setEquipmentLoading(true);
    try {
      setEquipment(await listEquipment());
    } finally {
      setEquipmentLoading(false);
    }
  }, []);

  const refreshRepairRequests = useCallback(async () => {
    setRepairRequestsLoading(true);
    try {
      setRepairRequests(await listRepairRequests());
    } finally {
      setRepairRequestsLoading(false);
    }
  }, []);

  const refreshApprovalQueue = useCallback(async () => {
    setApprovalQueueLoading(true);
    try {
      setApprovalQueue(await getApprovalQueue());
    } finally {
      setApprovalQueueLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      setNotifications(await listNotifications());
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      setUsers(await listUsers());
    } catch (err) {
      // Listing users may be restricted to admins — every other role simply
      // can't resolve "who reported this" to a name and falls back to
      // showing the raw id, rather than breaking the page.
      if (err instanceof ApiError && (err.status === 403 || err.status === 401)) {
        setUsers([]);
      } else {
        throw err;
      }
    } finally {
      setUsersLoading(false);
    }
  }, []);

  /** Fetches one request's full detail and replaces (or inserts) it in the shared list by id. */
  const loadRepairRequestDetail = useCallback(async (requestId: string): Promise<RepairRequest> => {
    const detail = await getRepairRequest(requestId);
    setRepairRequests((prev) => {
      const exists = prev.some((rr) => rr.id === detail.id);
      return exists ? prev.map((rr) => (rr.id === detail.id ? detail : rr)) : [detail, ...prev];
    });
    return detail;
  }, []);

  const maintenanceAlerts = useMemo(
    () => getDueMaintenanceAlerts(equipment),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [equipment, maintenanceAlertsTick],
  );

  const dismissMaintenanceAlert = useCallback((alert: MaintenanceAlert) => {
    dismissMaintenanceAlertStorage(alert);
    setMaintenanceAlertsTick((tick) => tick + 1);
  }, []);

  // Once signed in, load everything the dashboard needs. A fresh login and
  // a restored session both land here via the currentUser change.
  useEffect(() => {
    if (!currentUser) return;
    refreshEquipment();
    refreshRepairRequests();
    refreshUsers();
    refreshNotifications();
  }, [currentUser, refreshEquipment, refreshRepairRequests, refreshUsers, refreshNotifications]);

  const login = useCallback(async (email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> => {
    try {
      const user = await apiLogin(email, password);
      setCurrentUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setCurrentUser(null);
    setEquipment([]);
    setRepairRequests([]);
    setApprovalQueue([]);
    setNotifications([]);
    setUsers([]);
  }, []);

  const addEquipment = useCallback(async (input: EquipmentInput): Promise<Equipment | { error: string }> => {
    try {
      const created = await createEquipment(input);
      setEquipment((prev) => [...prev, created]);
      return created;
    } catch (err) {
      return { error: getErrorMessage(err) };
    }
  }, []);

  const addUser = useCallback(async (input: UserCreateInput): Promise<User | { error: string }> => {
    try {
      const created = await createUser(input);
      setUsers((prev) => [...prev, created]);
      return created;
    } catch (err) {
      return { error: getErrorMessage(err) };
    }
  }, []);

  const submitFaultReport = useCallback(async (input: FaultReportInput): Promise<RepairRequest | { error: string }> => {
    try {
      const created = await createRepairRequest(input);
      setRepairRequests((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      return { error: getErrorMessage(err) };
    }
  }, []);

  const decideSupervisor = useCallback(
    async (requestId: string, decision: ApprovalDecision, comment: string) => {
      await decideAsSupervisor(requestId, decision, comment);
      await Promise.all([loadRepairRequestDetail(requestId), refreshApprovalQueue()]);
    },
    [loadRepairRequestDetail, refreshApprovalQueue],
  );

  const decideMd = useCallback(
    async (requestId: string, decision: ApprovalDecision, comment: string) => {
      await decideAsMd(requestId, decision, comment);
      await Promise.all([loadRepairRequestDetail(requestId), refreshApprovalQueue()]);
    },
    [loadRepairRequestDetail, refreshApprovalQueue],
  );

  const addRepairAction = useCallback(
    async (requestId: string, input: RepairActionInput) => {
      await apiAddRepairAction(requestId, input);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const setPendingParts = useCallback(
    async (requestId: string, note?: string) => {
      await apiSetPendingParts(requestId, note);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const resumeRepair = useCallback(
    async (requestId: string) => {
      await apiResumeRepair(requestId);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const startRepair = useCallback(
    async (requestId: string) => {
      await apiStartRepair(requestId);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const completeRepair = useCallback(
    async (requestId: string, finalNotes?: string) => {
      await apiCompleteRepair(requestId, finalNotes);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const closeRepair = useCallback(
    async (requestId: string) => {
      await apiCloseRepair(requestId);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const cancelRepairRequest = useCallback(
    async (requestId: string, reason?: string) => {
      await apiCancelRepairRequest(requestId, reason);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const assignMechanic = useCallback(
    async (requestId: string, mechanicId: string) => {
      await apiAssignMechanic(requestId, mechanicId);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const setEstimatedCost = useCallback(
    async (requestId: string, amount: number) => {
      await apiSetEstimatedCost(requestId, amount);
      await loadRepairRequestDetail(requestId);
    },
    [loadRepairRequestDetail],
  );

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await apiMarkNotificationRead(id);
    } catch {
      // Best-effort — the bell will show the true state again on next refresh.
    }
  }, []);

  const value = useMemo<DashboardContextValue>(
    () => ({
      currentUser,
      authReady,
      login,
      logout,
      equipment,
      equipmentLoading,
      refreshEquipment,
      repairRequests,
      repairRequestsLoading,
      refreshRepairRequests,
      loadRepairRequestDetail,
      approvalQueue,
      approvalQueueLoading,
      refreshApprovalQueue,
      notifications,
      notificationsLoading,
      refreshNotifications,
      markNotificationRead,
      users,
      usersLoading,
      refreshUsers,
      maintenanceAlerts,
      dismissMaintenanceAlert,
      addEquipment,
      addUser,
      submitFaultReport,
      decideSupervisor,
      decideMd,
      addRepairAction,
      setPendingParts,
      resumeRepair,
      startRepair,
      completeRepair,
      closeRepair,
      cancelRepairRequest,
      assignMechanic,
      setEstimatedCost,
    }),
    [
      currentUser,
      authReady,
      login,
      logout,
      equipment,
      equipmentLoading,
      refreshEquipment,
      repairRequests,
      repairRequestsLoading,
      refreshRepairRequests,
      loadRepairRequestDetail,
      approvalQueue,
      approvalQueueLoading,
      refreshApprovalQueue,
      notifications,
      notificationsLoading,
      refreshNotifications,
      markNotificationRead,
      users,
      usersLoading,
      refreshUsers,
      maintenanceAlerts,
      dismissMaintenanceAlert,
      addEquipment,
      addUser,
      submitFaultReport,
      decideSupervisor,
      decideMd,
      addRepairAction,
      setPendingParts,
      resumeRepair,
      startRepair,
      completeRepair,
      closeRepair,
      cancelRepairRequest,
      assignMechanic,
      setEstimatedCost,
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
  const { currentUser, authReady, login, logout } = useDashboardContext();
  return { user: currentUser, authReady, login, logout };
}

export function useDashboardData() {
  const {
    equipment,
    equipmentLoading,
    refreshEquipment,
    repairRequests,
    repairRequestsLoading,
    refreshRepairRequests,
    loadRepairRequestDetail,
    approvalQueue,
    approvalQueueLoading,
    refreshApprovalQueue,
    notifications,
    notificationsLoading,
    refreshNotifications,
    markNotificationRead,
    users,
    usersLoading,
    refreshUsers,
    maintenanceAlerts,
    dismissMaintenanceAlert,
    addEquipment,
    addUser,
    submitFaultReport,
    decideSupervisor,
    decideMd,
    addRepairAction,
    setPendingParts,
    resumeRepair,
    startRepair,
    completeRepair,
    closeRepair,
    cancelRepairRequest,
    assignMechanic,
    setEstimatedCost,
  } = useDashboardContext();

  return {
    equipment,
    equipmentLoading,
    refreshEquipment,
    repairRequests,
    repairRequestsLoading,
    refreshRepairRequests,
    loadRepairRequestDetail,
    approvalQueue,
    approvalQueueLoading,
    refreshApprovalQueue,
    notifications,
    notificationsLoading,
    refreshNotifications,
    markNotificationRead,
    users,
    usersLoading,
    refreshUsers,
    maintenanceAlerts,
    dismissMaintenanceAlert,
    addEquipment,
    addUser,
    submitFaultReport,
    decideSupervisor,
    decideMd,
    addRepairAction,
    setPendingParts,
    resumeRepair,
    startRepair,
    completeRepair,
    closeRepair,
    cancelRepairRequest,
    assignMechanic,
    setEstimatedCost,
  };
}
