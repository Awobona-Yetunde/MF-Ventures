import { request } from "./client";
import type { Notification, NotificationType } from "@/dashboard/types";

const MAX_PAGE_SIZE = 200;

interface NotificationOutDto {
  id: string;
  notification_type: NotificationType;
  message: string;
  is_read: boolean;
  repair_request_id: string | null;
  created_at: string;
}

function mapNotification(dto: NotificationOutDto): Notification {
  return {
    id: dto.id,
    notificationType: dto.notification_type,
    message: dto.message,
    isRead: dto.is_read,
    repairRequestId: dto.repair_request_id,
    createdAt: dto.created_at,
  };
}

/** Scoped to the signed-in user automatically by the backend — there's no recipient field to filter on client-side. */
export async function listNotifications(): Promise<Notification[]> {
  const dtos = await request<NotificationOutDto[]>("/api/v1/notifications", { query: { page: 1, page_size: MAX_PAGE_SIZE } });
  return dtos.map(mapNotification).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(notificationId: string): Promise<Notification> {
  const dto = await request<NotificationOutDto>(`/api/v1/notifications/${notificationId}/read`, { method: "POST" });
  return mapNotification(dto);
}

export async function markAllNotificationsRead(): Promise<void> {
  await request<void>("/api/v1/notifications/read-all", { method: "POST" });
}
