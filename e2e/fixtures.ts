// Canned backend responses shaped exactly like the real OpenAPI schemas
// (snake_case, real enum values) — used to verify the dashboard renders and
// behaves correctly against the real API shapes without needing a live
// server, which this environment cannot reach.

export const MOCK_TOKENS = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  token_type: "bearer",
};

export const SUPERVISOR_USER = {
  id: "11111111-1111-1111-1111-111111111111",
  full_name: "Chidi Okafor",
  email: "chidi.okafor@mfventures.com",
  phone_number: "08012345678",
  site: "Warri",
  role: "supervisor",
  is_active: true,
  created_at: "2025-01-10T08:00:00Z",
};

export const MECHANIC_USER = {
  id: "22222222-2222-2222-2222-222222222222",
  full_name: "Bassey Etim",
  email: "bassey.etim@mfventures.com",
  phone_number: "08087654321",
  site: "Warri",
  role: "mechanic",
  is_active: true,
  created_at: "2025-01-10T08:00:00Z",
};

export const USERS = [SUPERVISOR_USER, MECHANIC_USER];

export const EQUIPMENT_ITEM = {
  id: "33333333-3333-3333-3333-333333333333",
  name: "Hydraulic Crane A1",
  equipment_type: "Crane",
  registration_number: "REG-0042",
  serial_number: "SN-9981",
  model_number: "HC-200",
  capacity_spec: "20 tonnes",
  current_location: "Warri Yard",
  assigned_site: "Warri",
  next_maintenance_date: "2026-12-01",
  status: "operational",
  last_maintenance_date: "2026-06-01",
  total_maintenance_cost: 450000,
  created_at: "2025-02-01T08:00:00Z",
  updated_at: "2026-06-01T08:00:00Z",
};

export const REPAIR_REQUEST = {
  id: "44444444-4444-4444-4444-444444444444",
  request_number: "RR-2026-0001",
  equipment_id: EQUIPMENT_ITEM.id,
  reported_by_id: MECHANIC_USER.id,
  assigned_mechanic_id: null,
  fault_detected_by: "Site inspector",
  fault_datetime: "2026-10-10T09:00:00Z",
  fault_type: "corrective_maintenance",
  priority: "high",
  fault_description: "Hydraulic arm leaking fluid under load.",
  repair_recommendation: "Replace hydraulic seals and inspect hoses.",
  status: "pending_supervisor_approval",
  estimated_cost: 85000,
  created_at: "2026-10-10T09:05:00Z",
  updated_at: "2026-10-10T09:05:00Z",
};

export const NOTIFICATIONS = [
  {
    id: "55555555-5555-5555-5555-555555555555",
    notification_type: "new_fault_report",
    message: "New fault reported on Hydraulic Crane A1",
    is_read: false,
    repair_request_id: REPAIR_REQUEST.id,
    created_at: "2026-10-10T09:05:00Z",
  },
];
