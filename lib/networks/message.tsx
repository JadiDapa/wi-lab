import { CreateMessageType, MessageType } from "../types/message";
import { axiosInstance } from "./axiosInstance";

// ✅ Get all messages (debug/admin use only)
export async function getAllMessages() {
  const { data } = await axiosInstance.get<MessageType[]>("/messages");
  return data;
}

// ✅ Get single message by ID
export async function getMessageById(id: string) {
  const { data } = await axiosInstance.get<MessageType>(`/messages/${id}`);
  return data;
}

// ✅ Get messages for a conversation
export async function getMessagesByConversationId(conversationId: string) {
  const { data } = await axiosInstance.get<MessageType[]>(
    `/messages/conversations/${conversationId}`,
  );
  return data;
}

export async function createMessage(values: CreateMessageType) {
  const formData = new FormData();

  formData.append("senderId", values.senderId);
  formData.append("conversationId", values.conversationId);
  formData.append("content", values.content || "");

  if (values.contentType !== undefined) {
    formData.append("contentType", values.contentType.toString());
  }

  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }

  const { data } = await axiosInstance.post("/messages", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

// ✅ Update (edit) message
export async function updateMessage(
  id: string,
  values: Partial<CreateMessageType>,
) {
  const formData = new FormData();

  if (values.senderId) formData.append("senderId", values.senderId);

  if (values.content) formData.append("content", values.content);
  if (values.attachment) formData.append("attachment", values.attachment);

  const { data } = await axiosInstance.put(`/messages/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// ✅ Soft delete message
export async function deleteMessage(id: string) {
  const { data } = await axiosInstance.delete(`/messages/${id}`);
  return data;
}
