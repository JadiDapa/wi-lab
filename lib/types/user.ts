import { ConversationType } from "./conversation";
import { MessageType } from "./message";
import { ModuleType } from "./module";
import { ModuleFileType } from "./module-file";
import { NotificationType } from "./notification";

export interface CreateUserType {
  email: string;
  fullName: string;
  role: Role;
  nim?: string; // Student ID
  nip?: string; // Lecturer ID
  department?: string;
  bio?: string;
  avatarUrl?: string;
  teacherId?: string; // for STUDENT role
  nextOpenTime?: Date;
}

export interface UserType extends CreateUserType {
  id: string;
  teacher?: UserType | null; // relation to a teacher (if this user is a student)
  students?: UserType[]; // relation to students (if this user is a teacher)

  modules: ModuleType[];
  moduleFiles: ModuleFileType[];
  notifications: NotificationType[];
  conversations: ConversationType[];

  messages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  ADMIN = "ADMIN",
}
