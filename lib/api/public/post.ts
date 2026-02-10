import axios from "../axios";
import { API } from "../endpoints";
import { Post } from "@/lib/types/post";

export async function getAllPosts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { posts: Post[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.POST.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}

export async function getPostById(id: string): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.get(API.POST.GET_BY_ID(id));
    return { success: true, message: "Post fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch post" };
  }
}

export async function getPostsByProvider(providerId: string): Promise<{ success: boolean; message: string; data?: Post[] }> {
  try {
    const response = await axios.get(API.POST.GET_BY_PROVIDER(providerId));
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}
