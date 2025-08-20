
export interface CreateNotificationType {
  userId: string,
  title: string;
  content?: string;
  notificationType: NotificationType;
  read?: boolean;
}

export interface UserType extends CreateNotificationType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  ASSIGNMENT,
  MESSAGES,
  ANNOUNCEMENT,
  MODULE_UPDATE,
  OTHER
}

