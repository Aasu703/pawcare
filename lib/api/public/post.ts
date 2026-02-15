import axios from "../axios";
import { API } from "../endpoints";
export async function getAllPosts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { posts: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.POST.GET_ALL, { params: { page, limit } });
    return { success: boolean, message: "Posts fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}

export async function getPostById(data: any): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.get(API.POST.GET_BY_ID(id));
    return { success: boolean, message: "Post fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch post" };
  }
}

export async function getPostsByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.POST.GET_BY_PROVIDER(providerId));
    return { success: boolean, message: "Posts fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}


