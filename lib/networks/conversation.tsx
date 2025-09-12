import { ConversationType } from "../types/conversation";
import { axiosInstance } from "./axiosInstance";

export async function getAllConversations() {
  const { data } =
    await axiosInstance.get<ConversationType[]>("/conversations");
  return data;
}

export async function getConversationsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<ConversationType[]>(
    "/conversations/accounts/" + accountId,
  );
  return data;
}

export async function getConversationById(id: string) {
  const { data } = await axiosInstance.get<ConversationType>(
    "/conversations/" + id,
  );
  return data;
}

export async function createConversation(values: ConversationType) {
  const { data } = await axiosInstance.post("/conversations", values);
  return data;
}

export async function updateConversation(id: string, values: ConversationType) {
  const { data } = await axiosInstance.put("/conversations/" + id, values);
  return data;
}

export async function deleteConversation(id: string) {
  const { data } = await axiosInstance.delete("/conversations/" + id);
  return data;
}
