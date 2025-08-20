import { NotificationType } from "@prisma/client";
import { MessageType } from "./message";
import { ModuleFileType } from "./module-file";

export interface CreateUserType {
  email: string;
  fullName: string;
  role: Role;
  nim? : string;
  nip? : string;
  department? : string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserType extends CreateUserType {
  id: string;
  moduleFiles: ModuleFileType[];
  notifications: NotificationType[];
  sentMessages: MessageType[];
  receivedMessages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  STUDENT,
  LECTURER,
  ADMIN
}