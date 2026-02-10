import axios from "../axios";
import { API } from "../endpoints";
import { Post } from "@/lib/types/post";

export async function getAllPosts(page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { posts: Post[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.ADMIN.POST.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}

export async function getPostById(id: string): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.get(API.ADMIN.POST.GET_BY_ID(id));
    return { success: true, message: "Post fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch post" };
  }
}

export async function deletePost(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ADMIN.POST.DELETE(id));
    return { success: true, message: response.data.message || "Post deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete post" };
  }
}
