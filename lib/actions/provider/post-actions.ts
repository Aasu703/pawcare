"use server";

import { createProviderPost, getMyProviderPosts, updateProviderPost, deleteProviderPost } from "@/lib/api/provider/post";
import { revalidatePath } from "next/cache";

export async function handleCreateProviderPost(data: any) {
  try {
    const result = await createProviderPost(data);
    if (result.success) revalidatePath("/provider/posts");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create post" };
  }
}

export async function handleGetMyProviderPosts() {
  try {
    return await getMyProviderPosts();
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch posts" };
  }
}

export async function handleUpdateProviderPost(id: string, data: any) {
  try {
    const result = await updateProviderPost(id, data);
    if (result.success) revalidatePath("/provider/posts");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update post" };
  }
}

export async function handleDeleteProviderPost(id: string) {
  try {
    const result = await deleteProviderPost(id);
    if (result.success) revalidatePath("/provider/posts");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete post" };
  }
}

