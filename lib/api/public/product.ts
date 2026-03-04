import axios from "../axios";
import { API } from "../endpoints";
export async function getAllProducts(page: number = 1, limit: number = 20): Promise<{ success: boolean; message: string; data?: { items: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_ALL, { params: { page, limit } });
    const rawData = response.data?.data;

    let items: any[] = [];
    let total = 0;
    let totalPages = 1;
    let currentPage = page;

    if (Array.isArray(rawData)) {
      items = rawData;
      total = rawData.length;
      totalPages = 1;
    } else if (Array.isArray(rawData?.items)) {
      items = rawData.items;
      total = Number(rawData.total ?? rawData.items.length ?? 0);
      totalPages = Number(rawData.totalPages ?? (Math.ceil(total / Math.max(Number(limit) || 1, 1)) || 1));
      currentPage = Number(rawData.page ?? page);
    } else if (rawData && Array.isArray(rawData?.data)) {
      items = rawData.data;
      total = Number(rawData.total ?? rawData.data.length ?? 0);
      totalPages = Number(rawData.totalPages ?? (Math.ceil(total / Math.max(Number(limit) || 1, 1)) || 1));
      currentPage = Number(rawData.page ?? page);
    }

    const normalizedItems = items.map((item: any) => item?._doc || item);
    return {
      success: true,
      message: "Products fetched",
      data: {
        items: normalizedItems,
        total,
        page: currentPage,
        totalPages,
      },
    };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch products" };
  }
}

export async function getProductById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_ID(data));
    return { success: true, message: "Product fetched", data: response.data.data?._doc || response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch product" };
  }
}

export async function getProductsByProvider(providerId: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PRODUCT.GET_BY_PROVIDER(providerId));
    const raw = response.data?.data;
    const processedData = Array.isArray(raw) ? raw.map(item => item._doc || item) : raw ? [raw._doc || raw] : [];
    return { success: true, message: "Products fetched", data: processedData };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch products" };
  }
}


