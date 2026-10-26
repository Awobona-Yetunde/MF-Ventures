import { request } from "./client";

// The backend's own OpenAPI spec leaves these three endpoints' response
// shape undeclared (`"schema": {}`) — unlike every other endpoint in this
// API, there's no contract to mirror here. Rather than guess at field names
// and risk silently showing the wrong number, these are typed as opaque JSON
// and rendered generically wherever they're used (see Reports.tsx).
export type ReportPayload = Record<string, unknown>;

export async function getDashboardSummary(): Promise<ReportPayload> {
  return request<ReportPayload>("/api/v1/reports/dashboard");
}

export async function getMaintenanceCostReport(startDate?: string, endDate?: string): Promise<ReportPayload> {
  return request<ReportPayload>("/api/v1/reports/maintenance-cost", {
    query: { start_date: startDate, end_date: endDate },
  });
}

export async function getEquipmentDowntimeReport(): Promise<ReportPayload> {
  return request<ReportPayload>("/api/v1/reports/equipment-downtime");
}
