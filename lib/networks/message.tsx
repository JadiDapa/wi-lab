import { CreateMessageType,  MessageType } from "../types/message";
import { axiosInstance } from "./axiosInstance";

export async function getAllMessages() {
  const { data } = await axiosInstance.get<MessageType[]>("/messages");
  return data;
}

export async function getMessageById(id: string) {
  const { data } = await axiosInstance.get<MessageType>("/messages/" + id);
  return data;
}

export async function createMessage(values: CreateMessageType) {
  const formData = new FormData()

  formData.append("senderId", values.senderId);
  formData.append("recipientId", values.recipientId);
  formData.append("content", values.content as string);
  formData.append("contentType", String(values.contentType));
  formData.append("attachment", values.attachment as File);

  const { data } = await axiosInstance.post("/messages", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateMessage(id: string, values: CreateMessageType) {
  const formData = new FormData();

  formData.append("senderId", values.senderId);
  formData.append("recipientId", values.recipientId);
  formData.append("content", values.content as string);
  formData.append("contentType", String(values.contentType));
  formData.append("attachment", values.attachment as File);

  const { data } = await axiosInstance.put("/messages/" + id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deleteMessage(id: string) {
  const { data } = await axiosInstance.delete("/messages/" + id);
  return data;
}
