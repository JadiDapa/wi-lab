import { CreateUserType, UserType } from "../types/user";
import { axiosInstance } from "./axiosInstance";

export async function getAllUsers() {
  const { data } = await axiosInstance.get<UserType[]>("/users");
  return data;
}

export async function getUserById(id: string) {
  const { data } = await axiosInstance.get<UserType>("/users/" + id);
  return data;
}

export async function createUser(values: CreateUserType) {
  const { data } = await axiosInstance.post("/users", values);
  return data;
}

export async function updateUser(id: string, values: CreateUserType) {
  const { data } = await axiosInstance.put("/users/" + id, values);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await axiosInstance.delete("/users/" + id);
  return data;
}
