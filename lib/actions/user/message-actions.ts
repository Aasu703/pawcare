"use server";

import { createMessage, getMyMessages, getMessageById, updateMessage, deleteMessage } from "@/lib/api/user/message";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export async function handleCreateMessage(data: any) {
  return withActionGuard(async () => {
    const response = await createMessage(data);
    if (response?.success) {
      revalidatePath("/user/messages");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to create message",
      successMessage: "Message sent!",
    });
  }, {
    fallbackMessage: "Failed to create message",
    logLabel: "Create message error",
  });
}

export async function handleGetMyMessages() {
  return withActionGuard(async () => {
    const response = await getMyMessages();
    return mapApiResult(response, {
      errorMessage: "Failed to fetch messages",
    });
  }, {
    fallbackMessage: "Failed to fetch messages",
    logLabel: "Get my messages error",
  });
}

export async function handleGetMessageById(id: string) {
  return withActionGuard(async () => {
    const response = await getMessageById(id);
    return mapApiResult(response, {
      errorMessage: "Failed to fetch message",
    });
  }, {
    fallbackMessage: "Failed to fetch message",
    logLabel: "Get message by id error",
  });
}

export async function handleUpdateMessage(id: string, data: any) {
  return withActionGuard(async () => {
    const response = await updateMessage(id, data);
    if (response?.success) {
      revalidatePath("/user/messages");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to update message",
      successMessage: "Message updated!",
    });
  }, {
    fallbackMessage: "Failed to update message",
    logLabel: "Update message error",
  });
}

export async function handleDeleteMessage(id: string) {
  return withActionGuard(async () => {
    const response = await deleteMessage(id);
    if (response?.success) {
      revalidatePath("/user/messages");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to delete message",
      successMessage: "Message deleted",
    });
  }, {
    fallbackMessage: "Failed to delete message",
    logLabel: "Delete message error",
  });
}

