import axios from "../axios";
import { API } from "../endpoints";
export async function createProviderPost(data: any): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.post(API.PROVIDER.POST.CREATE, data);
    return { success: boolean, message: response.data.message || "Post created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create post" };
  }
}

export async function getMyProviderPosts(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.POST.GET_MY);
    return { success: boolean, message: "Posts fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch posts" };
  }
}

export async function updateProviderPost(id: any, data: any): Promise<{ success: boolean; message: string; data?: Post }> {
  try {
    const response = await axios.put(API.PROVIDER.POST.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Post updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update post" };
  }
}

export async function deleteProviderPost(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.POST.DELETE(id));
    return { success: boolean, message: response.data.message || "Post deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete post" };
  }
}


