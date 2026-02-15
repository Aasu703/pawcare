import axios from "../axios";
import { API } from "../endpoints";
export async function createProviderPost(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.POST.CREATE, data);
    return { success: true, message: response.data.message || "Post created", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to create post" };
  }
}

export async function getMyProviderPosts(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.POST.GET_MY);
    return { success: true, message: "Posts fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch posts" };
  }
}

export async function updateProviderPost(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.POST.UPDATE(id), data);
    return { success: true, message: response.data.message || "Post updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update post" };
  }
}

export async function deleteProviderPost(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.POST.DELETE(data));
    return { success: true, message: response.data.message || "Post deleted" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to delete post" };
  }
}


