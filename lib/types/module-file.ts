import { NotificationType } from "@prisma/client";
import { ModuleType } from "./module";

export interface CreateModuleFileType {
  moduleId: string;
  url: string | File;
  filename: string;
  uploadedById: string;
}

export interface ModuleFileType extends CreateModuleFileType {
  id: string;
  module: ModuleType;
  uploadedBy: NotificationType[];
  createdAt: Date;
  updatedAt: Date;
}
