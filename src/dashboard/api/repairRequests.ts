import { request } from "./client";
import type {
  ApprovalRecord,
  ApprovalStage,
  Attachment,
  AuditLogEntry,
  FaultReportInput,
  FaultType,
  Priority,
  RepairAction,
  RepairRequest,
  RepairRequestUpdateInput,
  RepairStatus,
  Role,
} from "@/dashboard/types";

const MAX_PAGE_SIZE = 200;

export interface RepairRequestOutDto {
  id: string;
  request_number: string;
  equipment_id: string;
  reported_by_id: string;
  assigned_mechanic_id: string | null;
  fault_detected_by: string | null;
  fault_datetime: string;
  fault_type: FaultType;
  priority: Priority;
  fault_description: string;
  repair_recommendation: string | null;
  status: RepairStatus;
  estimated_cost: number | null;
  created_at: string;
  updated_at: string;
}

interface AttachmentOutDto {
  id: string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  uploaded_by_id: string;
  created_at: string;
}

interface ApprovalRecordOutDto {
  id: string;
  repair_request_id: string;
  stage: ApprovalStage;
  decided_by_id: string;
  decision: ApprovalRecord["decision"];
  comment: string | null;
  created_at: string;
  decided_by_role: Role;
}

interface AuditLogOutDto {
  id: string;
  repair_request_id: string | null;
  actor_id: string;
  action: string;
  from_status: string | null;
  to_status: string | null;
  detail: string | null;
  created_at: string;
}

export interface RepairActionOutDto {
  id: string;
  repair_request_id: string;
  action_date: string;
  action_taken: string;
  parts_materials_used: string | null;
  quantity: number | null;
  unit_cost: number | null;
  labour_cost: number | null;
  total_cost: number;
  performed_by_id: string;
  notes: string | null;
  invoice_attachment_id: string | null;
  created_at: string;
}

interface RepairRequestDetailOutDto extends RepairRequestOutDto {
  attachments?: AttachmentOutDto[];
  repair_actions?: RepairActionOutDto[];
  approvals?: ApprovalRecordOutDto[];
  audit_trail?: AuditLogOutDto[];
  total_repair_cost?: number;
}

export function mapRepairRequest(dto: RepairRequestOutDto): RepairRequest {
  return {
    id: dto.id,
    requestNumber: dto.request_number,
    equipmentId: dto.equipment_id,
    reportedById: dto.reported_by_id,
    assignedMechanicId: dto.assigned_mechanic_id,
    faultDetectedBy: dto.fault_detected_by,
    faultDatetime: dto.fault_datetime,
    faultType: dto.fault_type,
    priority: dto.priority,
    faultDescription: dto.fault_description,
    repairRecommendation: dto.repair_recommendation,
    status: dto.status,
    estimatedCost: dto.estimated_cost,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapAttachment(dto: AttachmentOutDto): Attachment {
  return {
    id: dto.id,
    originalFilename: dto.original_filename,
    contentType: dto.content_type,
    sizeBytes: dto.size_bytes,
    uploadedById: dto.uploaded_by_id,
    createdAt: dto.created_at,
  };
}

export function mapApprovalRecord(dto: ApprovalRecordOutDto): ApprovalRecord {
  return {
    id: dto.id,
    repairRequestId: dto.repair_request_id,
    stage: dto.stage,
    decidedById: dto.decided_by_id,
    decision: dto.decision,
    comment: dto.comment,
    createdAt: dto.created_at,
    decidedByRole: dto.decided_by_role,
  };
}

export function mapAuditLogEntry(dto: AuditLogOutDto): AuditLogEntry {
  return {
    id: dto.id,
    repairRequestId: dto.repair_request_id,
    actorId: dto.actor_id,
    action: dto.action,
    fromStatus: dto.from_status,
    toStatus: dto.to_status,
    detail: dto.detail,
    createdAt: dto.created_at,
  };
}

export function mapRepairAction(dto: RepairActionOutDto): RepairAction {
  return {
    id: dto.id,
    repairRequestId: dto.repair_request_id,
    actionDate: dto.action_date,
    actionTaken: dto.action_taken,
    partsMaterialsUsed: dto.parts_materials_used,
    quantity: dto.quantity,
    unitCost: dto.unit_cost,
    labourCost: dto.labour_cost,
    totalCost: dto.total_cost,
    performedById: dto.performed_by_id,
    notes: dto.notes,
    invoiceAttachmentId: dto.invoice_attachment_id,
    createdAt: dto.created_at,
  };
}

function mapRepairRequestDetail(dto: RepairRequestDetailOutDto): RepairRequest {
  return {
    ...mapRepairRequest(dto),
    attachments: dto.attachments?.map(mapAttachment) ?? [],
    repairActions: dto.repair_actions?.map(mapRepairAction) ?? [],
    approvals: dto.approvals?.map(mapApprovalRecord) ?? [],
    auditTrail: dto.audit_trail?.map(mapAuditLogEntry) ?? [],
    totalRepairCost: dto.total_repair_cost ?? 0,
  };
}

export interface RepairRequestFilters {
  statusFilter?: RepairStatus;
  priority?: Priority;
  equipmentId?: string;
  mine?: boolean;
}

export async function listRepairRequests(filters: RepairRequestFilters = {}): Promise<RepairRequest[]> {
  const dtos = await request<RepairRequestOutDto[]>("/api/v1/repair-requests", {
    query: {
      status_filter: filters.statusFilter,
      priority: filters.priority,
      equipment_id: filters.equipmentId,
      mine: filters.mine,
      page: 1,
      page_size: MAX_PAGE_SIZE,
    },
  });
  return dtos.map(mapRepairRequest);
}

export async function getRepairRequest(requestId: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>(`/api/v1/repair-requests/${requestId}`);
  return mapRepairRequestDetail(dto);
}

export async function createRepairRequest(input: FaultReportInput): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>("/api/v1/repair-requests", {
    method: "POST",
    body: {
      equipment_id: input.equipmentId,
      fault_datetime: input.faultDatetime,
      fault_type: input.faultType,
      priority: input.priority,
      fault_description: input.faultDescription,
      fault_detected_by: input.faultDetectedBy || null,
      repair_recommendation: input.repairRecommendation || null,
      estimated_cost: input.estimatedCost ?? null,
      submit_immediately: input.submitImmediately,
    },
  });
  return mapRepairRequestDetail(dto);
}

export async function updateRepairRequest(requestId: string, input: RepairRequestUpdateInput): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>(`/api/v1/repair-requests/${requestId}`, {
    method: "PATCH",
    body: {
      fault_datetime: input.faultDatetime,
      fault_type: input.faultType,
      priority: input.priority,
      fault_description: input.faultDescription,
      fault_detected_by: input.faultDetectedBy,
      repair_recommendation: input.repairRecommendation,
      estimated_cost: input.estimatedCost,
    },
  });
  return mapRepairRequestDetail(dto);
}

export async function submitRepairRequest(requestId: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>(`/api/v1/repair-requests/${requestId}/submit`, { method: "POST" });
  return mapRepairRequestDetail(dto);
}

export async function assignMechanic(requestId: string, mechanicId: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>(`/api/v1/repair-requests/${requestId}/assign-mechanic`, {
    method: "POST",
    body: { mechanic_id: mechanicId },
  });
  return mapRepairRequestDetail(dto);
}

export async function setEstimatedCost(requestId: string, estimatedCost: number): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>(`/api/v1/repair-requests/${requestId}/estimated-cost`, {
    method: "POST",
    body: { estimated_cost: estimatedCost },
  });
  return mapRepairRequestDetail(dto);
}

export async function cancelRepairRequest(requestId: string, reason?: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestDetailOutDto>(`/api/v1/repair-requests/${requestId}/cancel`, {
    method: "POST",
    query: { reason },
  });
  return mapRepairRequestDetail(dto);
}

export async function listAuditTrail(requestId: string): Promise<AuditLogEntry[]> {
  const dtos = await request<AuditLogOutDto[]>(`/api/v1/repair-requests/${requestId}/audit-trail`);
  return dtos.map(mapAuditLogEntry);
}

export async function listAttachments(requestId: string): Promise<Attachment[]> {
  const dtos = await request<AttachmentOutDto[]>(`/api/v1/repair-requests/${requestId}/attachments`);
  return dtos.map(mapAttachment);
}
