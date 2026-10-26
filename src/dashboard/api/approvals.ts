import { request } from "./client";
import { mapApprovalRecord, mapRepairRequest } from "./repairRequests";
import type { RepairRequestOutDto } from "./repairRequests";
import type { ApprovalDecision, ApprovalRecord, RepairRequest } from "@/dashboard/types";

const MAX_PAGE_SIZE = 200;

interface ApprovalRecordOutDto {
  id: string;
  repair_request_id: string;
  stage: ApprovalRecord["stage"];
  decided_by_id: string;
  decision: ApprovalDecision;
  comment: string | null;
  created_at: string;
  decided_by_role: ApprovalRecord["decidedByRole"];
}

/** Role-aware: a supervisor sees requests pending their decision, an MD sees requests pending the MD decision. The backend decides which, based on who's signed in. */
export async function getApprovalQueue(): Promise<RepairRequest[]> {
  const dtos = await request<RepairRequestOutDto[]>("/api/v1/approval-queue", { query: { page: 1, page_size: MAX_PAGE_SIZE } });
  return dtos.map(mapRepairRequest);
}

export async function decideAsSupervisor(requestId: string, decision: ApprovalDecision, comment: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/supervisor-decision`, {
    method: "POST",
    body: { decision, comment: comment || null },
  });
  return mapRepairRequest(dto);
}

export async function decideAsMd(requestId: string, decision: ApprovalDecision, comment: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/md-decision`, {
    method: "POST",
    body: { decision, comment: comment || null },
  });
  return mapRepairRequest(dto);
}

export async function getApprovalHistory(requestId: string): Promise<ApprovalRecord[]> {
  const dtos = await request<ApprovalRecordOutDto[]>(`/api/v1/repair-requests/${requestId}/approvals`);
  return dtos.map(mapApprovalRecord);
}
