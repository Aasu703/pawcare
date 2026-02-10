import axios from "../axios";
import { API } from "../endpoints";
import { Post, CreatePostRequest, UpdatePostRequest } from "@/lib/types/post";

export async function createProviderPost(data: CreatePostRequest): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.post(API.PROVIDER.POST.CREATE, data);
    return { success: true, message: response.data.message || "Post created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create post" };
  }
}

export async function getMyProviderPosts(): Promise<{ success: boolean; message: string; data?: Post[] }> {
  try {
    const response = await axios.get(API.PROVIDER.POST.GET_MY);
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}

export async function updateProviderPost(id: string, data: UpdatePostRequest): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.put(API.PROVIDER.POST.UPDATE(id), data);
    return { success: true, message: response.data.message || "Post updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update post" };
  }
}

export async function deleteProviderPost(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.POST.DELETE(id));
    return { success: true, message: response.data.message || "Post deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete post" };
  }
}
