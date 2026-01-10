export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}
