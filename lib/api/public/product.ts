import axios from "../axios";
import { API } from "../endpoints";
export async function getAllProducts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { items: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_ALL, { params: { page, limit } });
    return { success: boolean, message: "Products fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch products" };
  }
}

export async function getProductById(data: any): Promise<{ success: boolean; message: string; data?: Inventory }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_ID(id));
    return { success: boolean, message: "Product fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch product" };
  }
}

export async function getProductsByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_PROVIDER(providerId));
    return { success: boolean, message: "Products fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch products" };
  }
}


