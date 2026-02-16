import axios from "../axios";
import { API } from "../endpoints";
export async function getAllServices(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_ALL);
    const raw = response.data?.data;
    const data = Array.isArray(raw) ? raw.map(item => item._doc || item) : raw ? [raw._doc || raw] : [];
    return { success: true, message: "Services fetched", data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch services" };
  }
}

export async function getServiceById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  if (!data || data === 'undefined') {
    return { success: false, message: "No service id provided" };
  }

  try {
    const response = await axios.get(API.SERVICE.GET_BY_ID(data));
    return { success: true, message: "Service fetched", data: response.data.data?._doc || response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch service" };
  }
}

export async function getServicesByProvider(providerId: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_BY_PROVIDER(providerId));
    const raw = response.data?.data;
    const processedData = Array.isArray(raw) ? raw.map(item => item._doc || item) : raw ? [raw._doc || raw] : [];
    return { success: true, message: "Services fetched", data: processedData };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch services" };
  }
}


