// Core domain types for the Digital Equipment Maintenance & Approval System.
// Mirrors the structure in the "Fleet Functionality" spec: equipment records,
// repair requests with a two-stage approval chain, repair actions/costs, and
// role-scoped users. All data is mocked for now — these types are what a
// real API response should eventually match.

export type Role = "mechanic" | "supervisor" | "md" | "admin";

export type UserStatus = "Active" | "Invited";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  site: string;
  avatarInitials: string;
  status: UserStatus;
}

export type EquipmentStatus =
  | "Operational"
  | "Under Maintenance"
  | "Out of Service";

/** Fields captured on the "Add Equipment" form (Equipment Register). */
export interface EquipmentInput {
  name: string;
  registrationNumber: string;
  serialNumber: string;
  modelNumber: string;
  site: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  serialNumber: string;
  modelNumber: string;
  capacity?: string;
  location: string;
  site: string;
  status: EquipmentStatus;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  totalMaintenanceCost: number;
}

export type FaultType =
  | "Corrective Maintenance"
  | "Preventive Maintenance"
  | "Emergency Repair";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export type RepairStatus =
  | "Draft"
  | "Submitted"
  | "Pending Supervisor Approval"
  | "Supervisor Approved"
  | "Pending MD Approval"
  | "Approved"
  | "Repair In Progress"
  | "Pending Parts"
  | "Repair Completed"
  | "Closed"
  | "Rejected / Returned"
  | "Cancelled";

export interface ApprovalRecord {
  userId: string;
  userName: string;
  role: Role;
  decision: "Approved" | "Rejected / Returned" | "Request More Information";
  comment: string;
  timestamp: string;
}

export interface RepairAction {
  id: string;
  date: string;
  action: string;
  partsUsed?: string;
  quantity?: number;
  unitCost?: number;
  labourCost?: number;
  totalCost: number;
  performedBy: string;
  notes?: string;
}

export interface RepairRequest {
  id: string; // e.g. RR-2026-0001
  equipmentId: string;
  faultType: FaultType;
  priority: Priority;
  status: RepairStatus;
  faultDescription: string;
  faultReportedBy: string;
  faultDetectedBy: string;
  repairRecommendation: string;
  reportedAt: string;
  /** The mechanic who filed this request — drives "my reports" scoping and who may log repair actions on it. */
  reportedByUserId: string;
  /** The supervisor this request is routed to for first-stage approval. */
  assignedSupervisorId: string;
  supervisorApproval: ApprovalRecord | null;
  mdApproval: ApprovalRecord | null;
  repairActions: RepairAction[];
  estimatedCost?: number;
  completedAt: string | null;
}

/** Fields captured on the "Report Equipment Fault" form (Mechanic Dashboard). */
export interface FaultReportInput {
  equipmentId: string;
  faultType: FaultType;
  priority: Priority;
  faultDescription: string;
  faultDetectedBy: string;
  repairRecommendation: string;
  reportedAt: string;
  estimatedCost?: number;
}

export type ApprovalDecision = ApprovalRecord["decision"];

/** One entry in a repair action log submission (Repair Request Detail, mechanic view). */
export interface RepairActionInput {
  date: string;
  action: string;
  partsUsed?: string;
  quantity?: number;
  unitCost?: number;
  labourCost?: number;
  notes?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  /** Who should see this — matches the routing rules in the spec's Notifications section. */
  recipientUserId: string;
  /** The request this notification is about, if any — lets the bell link straight to it. */
  relatedRequestId?: string;
}
