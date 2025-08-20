import { UserType } from "./user";

export interface CreateMessageType {
  senderId: string;
  recipientId: string;
  content?: string;
  contentType?: MessageContentType;
  attachment?: File | string;
  readAt?: string;
  edited?: boolean;
}

export interface MessageType extends CreateMessageType {
  id: string;
  sender: UserType;
  recipient: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageContentType {
  TEXT,
  IMAGE,
  FILE,
  OTHER
}