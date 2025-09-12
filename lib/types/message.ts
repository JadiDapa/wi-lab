import { ConversationType } from "./conversation";
import { UserType } from "./user";

export interface CreateMessageType {
  senderId: string;
  conversationId: string;
  content?: string;
  contentType?: MessageContentType;
  attachment?: File | string;
  readAt?: string;
  edited?: boolean;
  deleted?: boolean;
}

export interface MessageType extends CreateMessageType {
  id: string;
  conversation: ConversationType;
  sender: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageContentType = "TEXT" | "IMAGE" | "FILE" | "OTHER";
