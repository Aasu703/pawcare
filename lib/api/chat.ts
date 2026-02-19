import axios from "./axios";
import { API } from "./endpoints";

type ChatRole = "user" | "provider";

export type ChatConversation = {
  participantId: string;
  participantRole: ChatRole;
  participantName: string;
  participantImage?: string;
  participantSubtitle?: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId: string;
  lastMessageSenderRole: ChatRole;
};

export type ChatContact = {
  participantId: string;
  participantRole: ChatRole;
  name: string;
  imageUrl?: string;
  subtitle?: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  senderRole: ChatRole;
  receiverId: string;
  receiverRole: ChatRole;
  createdAt?: string;
  updatedAt?: string;
};

function toErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    const message = response?.data?.message;
    if (typeof message === "string" && message.trim().length > 0) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function getChatConversations(
  page: number = 1,
  limit: number = 20,
): Promise<{ success: boolean; message: string; data?: { conversations: ChatConversation[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.CHAT.GET_CONVERSATIONS, { params: { page, limit } });
    return { success: true, message: "Conversations fetched", data: response.data.data };
  } catch (error: unknown) {
    return { success: false, message: toErrorMessage(error, "Failed to fetch conversations") };
  }
}

export async function getChatContacts(): Promise<{ success: boolean; message: string; data?: ChatContact[] }> {
  try {
    const response = await axios.get(API.CHAT.GET_CONTACTS);
    return { success: true, message: "Contacts fetched", data: response.data.data };
  } catch (error: unknown) {
    return { success: false, message: toErrorMessage(error, "Failed to fetch chat contacts") };
  }
}

export async function getChatMessages(
  participantId: string,
  participantRole: ChatRole = "provider",
  page: number = 1,
  limit: number = 100,
): Promise<{ success: boolean; message: string; data?: { messages: ChatMessage[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.CHAT.GET_MESSAGES(participantId), {
      params: { participantRole, page, limit },
    });
    return { success: true, message: "Messages fetched", data: response.data.data };
  } catch (error: unknown) {
    return { success: false, message: toErrorMessage(error, "Failed to fetch conversation messages") };
  }
}

export async function sendChatMessage(
  participantId: string,
  content: string,
  participantRole: ChatRole = "provider",
): Promise<{ success: boolean; message: string; data?: ChatMessage }> {
  try {
    const response = await axios.post(API.CHAT.SEND_MESSAGE(participantId), {
      content,
      participantRole,
    });
    return { success: true, message: response.data.message || "Message sent", data: response.data.data };
  } catch (error: unknown) {
    return { success: false, message: toErrorMessage(error, "Failed to send message") };
  }
}
