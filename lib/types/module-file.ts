import { NotificationType } from "@prisma/client";

export interface CreateModuleFileType {
  moduleId: string;
  url: string;
  filename: string;
  uploadedById: string;
}

export interface ModuleFileType extends CreateModuleFileType {
  id: string;
  module: ModuleFileType[];
  uploadedBy: NotificationType[];
  createdAt: Date;
  updatedAt: Date;
}

