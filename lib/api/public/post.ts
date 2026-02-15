import axios from "../axios";
import { API } from "../endpoints";
export async function getAllPosts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { posts: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.POST.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch posts" };
  }
}

export async function getPostById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.POST.GET_BY_ID(data));
    return { success: true, message: "Post fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch post" };
  }
}

export async function getPostsByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.POST.GET_BY_PROVIDER(data));
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch posts" };
  }
}


