import { ModuleFileType } from "./module-file";
import { UserType } from "./user";

export interface CreateModuleType {
  title: string;
  slug: string;
  description: string;
  visibility: ModuleVisibility;
  authorId: string;
}

export interface ModuleType extends CreateModuleType {
  id: string;
  author: UserType;
  files: ModuleFileType[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ModuleVisibility {
  OPEN,
  RESTRICTED,
}
