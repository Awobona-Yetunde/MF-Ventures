import { request } from "./client";
import { mapRepairRequest, type RepairRequestOutDto } from "./repairRequests";
import type { Equipment, EquipmentInput, EquipmentStatus, EquipmentUpdateInput } from "@/dashboard/types";

const MAX_PAGE_SIZE = 200;

interface EquipmentOutDto {
  name: string;
  equipment_type: string | null;
  registration_number: string;
  serial_number: string | null;
  model_number: string | null;
  capacity_spec: string | null;
  current_location: string | null;
  assigned_site: string | null;
  next_maintenance_date: string | null;
  id: string;
  status: EquipmentStatus;
  last_maintenance_date: string | null;
  total_maintenance_cost: number;
  created_at: string;
  updated_at: string;
}

interface EquipmentDetailOutDto extends EquipmentOutDto {
  repair_requests?: RepairRequestOutDto[];
}

function mapEquipment(dto: EquipmentOutDto): Equipment {
  return {
    id: dto.id,
    name: dto.name,
    equipmentType: dto.equipment_type,
    registrationNumber: dto.registration_number,
    serialNumber: dto.serial_number,
    modelNumber: dto.model_number,
    capacitySpec: dto.capacity_spec,
    currentLocation: dto.current_location,
    assignedSite: dto.assigned_site,
    status: dto.status,
    lastMaintenanceDate: dto.last_maintenance_date,
    nextMaintenanceDate: dto.next_maintenance_date,
    totalMaintenanceCost: dto.total_maintenance_cost,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function mapEquipmentDetail(dto: EquipmentDetailOutDto): Equipment {
  return {
    ...mapEquipment(dto),
    repairRequests: dto.repair_requests?.map(mapRepairRequest),
  };
}

export async function listEquipment(): Promise<Equipment[]> {
  const dtos = await request<EquipmentOutDto[]>("/api/v1/equipment", { query: { page: 1, page_size: MAX_PAGE_SIZE } });
  return dtos.map(mapEquipment);
}

export async function getEquipment(equipmentId: string): Promise<Equipment> {
  const dto = await request<EquipmentDetailOutDto>(`/api/v1/equipment/${equipmentId}`);
  return mapEquipmentDetail(dto);
}

export async function createEquipment(input: EquipmentInput): Promise<Equipment> {
  const dto = await request<EquipmentOutDto>("/api/v1/equipment", {
    method: "POST",
    body: {
      name: input.name,
      equipment_type: input.equipmentType || null,
      registration_number: input.registrationNumber,
      serial_number: input.serialNumber || null,
      model_number: input.modelNumber || null,
      capacity_spec: input.capacitySpec || null,
      current_location: input.currentLocation || null,
      assigned_site: input.assignedSite || null,
      next_maintenance_date: input.nextMaintenanceDate || null,
    },
  });
  return mapEquipment(dto);
}

export async function updateEquipment(equipmentId: string, input: EquipmentUpdateInput): Promise<Equipment> {
  const dto = await request<EquipmentOutDto>(`/api/v1/equipment/${equipmentId}`, {
    method: "PATCH",
    body: {
      name: input.name,
      equipment_type: input.equipmentType,
      serial_number: input.serialNumber,
      model_number: input.modelNumber,
      capacity_spec: input.capacitySpec,
      current_location: input.currentLocation,
      assigned_site: input.assignedSite,
      status: input.status,
      next_maintenance_date: input.nextMaintenanceDate,
    },
  });
  return mapEquipment(dto);
}
