import axios from "../axios";
import { API } from "../endpoints";
export async function getAllServices(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_ALL);
    const raw = response.data?.data;
    const data = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return { success: boolean, message: "Services fetched", data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch services" };
  }
}

export async function getServiceById(data: any): Promise<{ success: boolean; message: string; data?: Service }> {
  if (!id || id === 'undefined') {
    return { success: boolean, message: "No service id provided" };
  }

  try {
    const response = await axios.get(API.SERVICE.GET_BY_ID(id));
    return { success: boolean, message: "Service fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch service" };
  }
}

export async function getServicesByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_BY_PROVIDER(providerId));
    return { success: boolean, message: "Services fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch services" };
  }
}


