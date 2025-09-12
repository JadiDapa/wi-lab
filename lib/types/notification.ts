export interface CreateNotificationType {
  userId: string;
  title: string;
  content?: string;
  notificationType: Notification;
  read?: boolean;
}

export interface NotificationType extends CreateNotificationType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Notification {
  ASSIGNMENT,
  MESSAGES,
  ANNOUNCEMENT,
  MODULE_UPDATE,
  OTHER,
}
