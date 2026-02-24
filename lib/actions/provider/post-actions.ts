"use server";

import { withActionGuard } from "@/lib/actions/_shared";
import { createProviderPost, getMyProviderPosts, updateProviderPost, deleteProviderPost } from "@/lib/api/provider/post";
import { revalidatePath } from "next/cache";

export async function handleCreateProviderPost(data: any) {
  return withActionGuard(async () => {
    const result = await createProviderPost(data);
    if (result.success) revalidatePath("/provider/posts");
    return result;
  }, {
    fallbackMessage: "Failed to create post",
    logLabel: "Create provider post error",
  });
}

export async function handleGetMyProviderPosts() {
  return withActionGuard(async () => getMyProviderPosts(), {
    fallbackMessage: "Failed to fetch posts",
    logLabel: "Get provider posts error",
  });
}

export async function handleUpdateProviderPost(id: string, data: any) {
  return withActionGuard(async () => {
    const result = await updateProviderPost(id, data);
    if (result.success) revalidatePath("/provider/posts");
    return result;
  }, {
    fallbackMessage: "Failed to update post",
    logLabel: "Update provider post error",
  });
}

export async function handleDeleteProviderPost(id: string) {
  return withActionGuard(async () => {
    const result = await deleteProviderPost(id);
    if (result.success) revalidatePath("/provider/posts");
    return result;
  }, {
    fallbackMessage: "Failed to delete post",
    logLabel: "Delete provider post error",
  });
}

