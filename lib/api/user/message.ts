import axios from "../axios";
import { API } from "../endpoints";
import { Message, CreateMessageRequest, UpdateMessageRequest } from "@/lib/types/message";

export async function getAllMessages(page: number = 1, limit: number = 50): Promise<{ success: boolean; message: string; data?: { messages: Message[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.MESSAGE.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Messages fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch messages" };
  }
}

export async function createMessage(data: CreateMessageRequest): Promise<{ success: boolean; message: string; data?: Message }> {
  try {
    const response = await axios.post(API.MESSAGE.CREATE, data);
    return { success: true, message: response.data.message || "Message sent", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to send message" };
  }
}

export async function getMyMessages(): Promise<{ success: boolean; message: string; data?: Message[] }> {
  try {
    const response = await axios.get(API.MESSAGE.GET_MY);
    return { success: true, message: "Messages fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch messages" };
  }
}

export async function getMessageById(id: string): Promise<{ success: boolean; message: string; data?: Message }> {
  try {
    const response = await axios.get(API.MESSAGE.GET_BY_ID(id));
    return { success: true, message: "Message fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch message" };
  }
}

export async function updateMessage(id: string, data: UpdateMessageRequest): Promise<{ success: boolean; message: string; data?: Message }> {
  try {
    const response = await axios.put(API.MESSAGE.UPDATE(id), data);
    return { success: true, message: response.data.message || "Message updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update message" };
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.MESSAGE.DELETE(id));
    return { success: true, message: response.data.message || "Message deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete message" };
  }
}
