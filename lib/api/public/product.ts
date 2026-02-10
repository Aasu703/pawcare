import axios from "../axios";
import { API } from "../endpoints";
import { Inventory } from "@/lib/types/provider";

export async function getAllProducts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { items: Inventory[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Products fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch products" };
  }
}

export async function getProductById(id: string): Promise<{ success: boolean; message: string; data?: Inventory }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_ID(id));
    return { success: true, message: "Product fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch product" };
  }
}

export async function getProductsByProvider(providerId: string): Promise<{ success: boolean; message: string; data?: Inventory[] }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_PROVIDER(providerId));
    return { success: true, message: "Products fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch products" };
  }
}
