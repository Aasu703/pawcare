"use server";

import { createMessage, getMyMessages, getMessageById, updateMessage, deleteMessage } from "@/lib/api/user/message";
import { CreateMessageRequest, UpdateMessageRequest } from "@/lib/types/message";
import { revalidatePath } from "next/cache";

export async function handleCreateMessage(data: CreateMessageRequest) {
  try {
    const response = await createMessage(data);
    if (response.success) {
      revalidatePath("/user/messages");
      return { success: true, message: "Message sent!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetMyMessages() {
  try {
    const response = await getMyMessages();
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetMessageById(id: string) {
  try {
    const response = await getMessageById(id);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleUpdateMessage(id: string, data: UpdateMessageRequest) {
  try {
    const response = await updateMessage(id, data);
    if (response.success) {
      revalidatePath("/user/messages");
      return { success: true, message: "Message updated!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleDeleteMessage(id: string) {
  try {
    const response = await deleteMessage(id);
    if (response.success) {
      revalidatePath("/user/messages");
      return { success: true, message: "Message deleted" };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
