import axios from "../axios";
import { API } from "../endpoints";
export async function getAllMessages(page: number = 1, limit: number = 50): Promise<{ success: boolean; message: string; data?: { messages: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.MESSAGE.GET_ALL, { params: { page, limit } });
    return { success: boolean, message: "Messages fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch messages" };
  }
}

export async function createMessage(data: any): Promise<{ success: boolean; message: string; data?: Message }> {
  try {
    const response = await axios.post(API.MESSAGE.CREATE, data);
    return { success: boolean, message: response.data.message || "Message sent", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to send message" };
  }
}

export async function getMyMessages(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.MESSAGE.GET_MY);
    return { success: boolean, message: "Messages fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch messages" };
  }
}

export async function getMessageById(data: any): Promise<{ success: boolean; message: string; data?: Message }> {
  try {
    const response = await axios.get(API.MESSAGE.GET_BY_ID(id));
    return { success: boolean, message: "Message fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch message" };
  }
}

export async function updateMessage(id: any, data: any): Promise<{ success: boolean; message: string; data?: Message }> {
  try {
    const response = await axios.put(API.MESSAGE.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Message updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update message" };
  }
}

export async function deleteMessage(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.MESSAGE.DELETE(id));
    return { success: boolean, message: response.data.message || "Message deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete message" };
  }
}


