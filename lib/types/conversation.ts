import { MessageType } from "./message";
import { UserType } from "./user";

export interface ConversationType {
  id: string;
  users: UserType[];
  messages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
}
