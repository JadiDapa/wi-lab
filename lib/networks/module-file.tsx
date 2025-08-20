import { CreateModuleFileType, ModuleFileType } from "../types/module-file";
import { axiosInstance } from "./axiosInstance";

export async function getAllModuleFiles() {
  const { data } = await axiosInstance.get<ModuleFileType[]>("/module-files");
  return data;
}

export async function getModuleFileById(id: string) {
  const { data } = await axiosInstance.get<ModuleFileType>("/module-files/" + id);
  return data;
}

export async function createModuleFile(values: CreateModuleFileType) {
  const formData = new FormData();

  formData.append("moduleId", values.moduleId);
  formData.append("filename", values.filename);
  formData.append("url", values.url);
  formData.append("uploadedById", values.uploadedById);

  const { data } = await axiosInstance.post("/module-files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateModuleFile(id: string, values: CreateModuleFileType) {
  const formData = new FormData();

  formData.append("moduleId", values.moduleId);
  formData.append("filename", values.filename);
  formData.append("url", values.url);
  formData.append("uploadedById", values.uploadedById);

  const { data } = await axiosInstance.put("/module-files/" + id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deleteModuleFile(id: string) {
  const { data } = await axiosInstance.delete("/module-files/" + id);
  return data;
}
