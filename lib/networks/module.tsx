import { CreateModuleType, ModuleType } from "../types/module";
import { axiosInstance } from "./axiosInstance";

export async function getAllModules() {
  const { data } = await axiosInstance.get<ModuleType[]>("/modules");
  return data;
}

export async function getModuleById(id: string) {
  const { data } = await axiosInstance.get<ModuleType>("/modules/" + id);
  return data;
}

export async function createModule(values: CreateModuleType) {
  const { data } = await axiosInstance.post("/modules", values);
  return data;
}

export async function updateModule(id: string, values: CreateModuleType) {
  const { data } = await axiosInstance.put("/modules/" + id, values);
  return data;
}

export async function deleteModule(id: string) {
  const { data } = await axiosInstance.delete("/modules/" + id);
  return data;
}
