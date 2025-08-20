import { CreateNotificationType, NotificationType } from "../types/notification";
import { axiosInstance } from "./axiosInstance";

export async function getAllNotifications() {
  const { data } = await axiosInstance.get<NotificationType[]>("/notifications");
  return data;
}

export async function getNotificationById(id: string) {
  const { data } = await axiosInstance.get<NotificationType>("/notifications/" + id);
  return data;
}

export async function createNotification(values: CreateNotificationType) {
  const { data } = await axiosInstance.post("/notifications", values);
  return data;
}

export async function updateNotification(id: string, values: CreateNotificationType) {
  const { data } = await axiosInstance.put("/notifications/" + id, values);
  return data;
}

export async function deleteNotification(id: string) {
  const { data } = await axiosInstance.delete("/notifications/" + id);
  return data;
}
