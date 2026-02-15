import axios from "../axios";
import { API } from "../endpoints";
export async function getAllProducts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { items: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Products fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch products" };
  }
}

export async function getProductById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_ID(data));
    return { success: true, message: "Product fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch product" };
  }
}

export async function getProductsByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_PROVIDER(data));
    return { success: true, message: "Products fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch products" };
  }
}


