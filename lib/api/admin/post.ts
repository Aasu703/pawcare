import axios from "../axios";
import { API } from "../endpoints";
export async function getAllPosts(page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { posts: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.ADMIN.POST.GET_ALL, { params: { page, limit } });
    return { success: boolean, message: "Posts fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}

export async function getPostById(data: any): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.get(API.ADMIN.POST.GET_BY_ID(id));
    return { success: boolean, message: "Post fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch post" };
  }
}

export async function deletePost(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ADMIN.POST.DELETE(id));
    return { success: boolean, message: response.data.message || "Post deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete post" };
  }
}


