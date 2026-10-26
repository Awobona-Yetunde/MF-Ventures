// Core domain types for the Digital Equipment Maintenance & Approval System.
//
// These mirror the real backend's OpenAPI schema field-for-field (same enum
// values, same optionality) with snake_case renamed to camelCase — nothing
// more. Keeping them a direct mirror, rather than reshaping them into
// friendlier names, is deliberate: it means the mapping code in
// src/dashboard/api/*.ts is pure renaming with no translation to get wrong,
// and a response the backend actually sends can never silently not match
// what the UI expects. Human-readable labels for the enum values below live
// in src/dashboard/data/labels.ts, kept separate from the types themselves.

export type Role = "mechanic" | "supervisor" | "md" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  site: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

/** Fields the admin fills in on "Add User" — matches UserCreate exactly. */
export interface UserCreateInput {
  fullName: string;
  email: string;
  phoneNumber?: string;
  site?: string;
  role: Role;
  password: string;
}

/** Fields an admin can change on an existing user — matches UserUpdate. */
export interface UserUpdateInput {
  fullName?: string;
  phoneNumber?: string;
  site?: string;
  isActive?: boolean;
  role?: Role;
}

export type EquipmentStatus = "operational" | "under_maintenance" | "out_of_service";

export interface Equipment {
  id: string;
  name: string;
  equipmentType: string | null;
  registrationNumber: string;
  serialNumber: string | null;
  modelNumber: string | null;
  capacitySpec: string | null;
  currentLocation: string | null;
  assignedSite: string | null;
  status: EquipmentStatus;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  totalMaintenanceCost: number;
  createdAt: string;
  updatedAt: string;
  /** Only present on the single-equipment detail response. */
  repairRequests?: RepairRequest[];
}

/** Fields captured on the "Add Equipment" form — matches EquipmentCreate. */
export interface EquipmentInput {
  name: string;
  registrationNumber: string;
  equipmentType?: string;
  serialNumber?: string;
  modelNumber?: string;
  capacitySpec?: string;
  currentLocation?: string;
  assignedSite?: string;
  /** ISO date (YYYY-MM-DD), not a full datetime. */
  nextMaintenanceDate?: string;
}

/** Fields that can be changed on an existing equipment record — matches EquipmentUpdate. */
export interface EquipmentUpdateInput {
  name?: string;
  equipmentType?: string;
  serialNumber?: string;
  modelNumber?: string;
  capacitySpec?: string;
  currentLocation?: string;
  assignedSite?: string;
  status?: EquipmentStatus;
  nextMaintenanceDate?: string;
}

export type FaultType = "corrective_maintenance" | "preventive_maintenance" | "emergency_repair";
export type Priority = "low" | "medium" | "high" | "critical";

export type RepairStatus =
  | "draft"
  | "submitted"
  | "pending_supervisor_approval"
  | "supervisor_approved"
  | "pending_md_approval"
  | "approved"
  | "repair_in_progress"
  | "pending_parts"
  | "repair_completed"
  | "closed"
  | "rejected_returned"
  | "cancelled";

export type ApprovalStage = "supervisor" | "md";
export type ApprovalDecision = "approve" | "reject_return" | "request_info";

export interface ApprovalRecord {
  id: string;
  repairRequestId: string;
  stage: ApprovalStage;
  decidedById: string;
  decision: ApprovalDecision;
  comment: string | null;
  createdAt: string;
  decidedByRole: Role;
}

export interface Attachment {
  id: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  uploadedById: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  repairRequestId: string | null;
  actorId: string;
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  detail: string | null;
  createdAt: string;
}

export interface RepairAction {
  id: string;
  repairRequestId: string;
  actionDate: string;
  actionTaken: string;
  partsMaterialsUsed: string | null;
  quantity: number | null;
  unitCost: number | null;
  labourCost: number | null;
  totalCost: number;
  performedById: string;
  notes: string | null;
  invoiceAttachmentId: string | null;
  createdAt: string;
}

/** One entry in a repair action log submission — matches RepairActionCreate. */
export interface RepairActionInput {
  actionDate: string;
  actionTaken: string;
  partsMaterialsUsed?: string;
  quantity?: number;
  unitCost?: number;
  labourCost?: number;
  notes?: string;
  invoiceAttachmentId?: string;
}

export interface RepairRequest {
  id: string;
  requestNumber: string;
  equipmentId: string;
  reportedById: string;
  assignedMechanicId: string | null;
  faultDetectedBy: string | null;
  faultDatetime: string;
  faultType: FaultType;
  priority: Priority;
  faultDescription: string;
  repairRecommendation: string | null;
  status: RepairStatus;
  estimatedCost: number | null;
  createdAt: string;
  updatedAt: string;
  /** Only present on the detail response (GET/POST/PATCH of a single request), not on list items. */
  attachments?: Attachment[];
  repairActions?: RepairAction[];
  approvals?: ApprovalRecord[];
  auditTrail?: AuditLogEntry[];
  totalRepairCost?: number;
}

/** Fields captured on the "Report Equipment Fault" form — matches RepairRequestCreate. */
export interface FaultReportInput {
  equipmentId: string;
  faultDatetime: string;
  faultType: FaultType;
  priority: Priority;
  faultDescription: string;
  faultDetectedBy?: string;
  repairRecommendation?: string;
  estimatedCost?: number;
  /** true moves it straight to Pending Supervisor Approval instead of leaving it as a draft. */
  submitImmediately: boolean;
}

/** Only allowed while status === "draft", and only by the reporting mechanic/admin — matches RepairRequestUpdate. */
export interface RepairRequestUpdateInput {
  faultDatetime?: string;
  faultType?: FaultType;
  priority?: Priority;
  faultDescription?: string;
  faultDetectedBy?: string;
  repairRecommendation?: string;
  estimatedCost?: number;
}

export type NotificationType =
  | "new_fault_report"
  | "supervisor_approved"
  | "md_approved"
  | "request_more_info"
  | "repair_completed"
  | "critical_fault"
  | "rejected";

export interface Notification {
  id: string;
  notificationType: NotificationType;
  message: string;
  isRead: boolean;
  repairRequestId: string | null;
  createdAt: string;
}
