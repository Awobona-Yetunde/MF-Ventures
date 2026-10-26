import { request } from "./client";
import { mapRepairAction, mapRepairRequest } from "./repairRequests";
import type { RepairActionOutDto, RepairRequestOutDto } from "./repairRequests";
import type { RepairAction, RepairActionInput, RepairRequest } from "@/dashboard/types";

export async function startRepair(requestId: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/start`, { method: "POST" });
  return mapRepairRequest(dto);
}

export async function setPendingParts(requestId: string, note?: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/pending-parts`, {
    method: "POST",
    query: { note },
  });
  return mapRepairRequest(dto);
}

export async function resumeRepair(requestId: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/resume`, { method: "POST" });
  return mapRepairRequest(dto);
}

export async function completeRepair(requestId: string, finalNotes?: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/complete`, {
    method: "POST",
    body: { final_notes: finalNotes || null },
  });
  return mapRepairRequest(dto);
}

export async function closeRepair(requestId: string): Promise<RepairRequest> {
  const dto = await request<RepairRequestOutDto>(`/api/v1/repair-requests/${requestId}/close`, { method: "POST" });
  return mapRepairRequest(dto);
}

export async function addRepairAction(requestId: string, input: RepairActionInput): Promise<RepairAction> {
  const dto = await request<RepairActionOutDto>(`/api/v1/repair-requests/${requestId}/actions`, {
    method: "POST",
    body: {
      action_date: input.actionDate,
      action_taken: input.actionTaken,
      parts_materials_used: input.partsMaterialsUsed || null,
      quantity: input.quantity ?? null,
      unit_cost: input.unitCost ?? null,
      labour_cost: input.labourCost ?? null,
      notes: input.notes || null,
      invoice_attachment_id: input.invoiceAttachmentId || null,
    },
  });
  return mapRepairAction(dto);
}

export async function listRepairActions(requestId: string): Promise<RepairAction[]> {
  const dtos = await request<RepairActionOutDto[]>(`/api/v1/repair-requests/${requestId}/actions`);
  return dtos.map(mapRepairAction);
}
