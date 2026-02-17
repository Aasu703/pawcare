import axios from "../axios";
import { API } from "../endpoints";
export async function getAllServices(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_ALL);
    const raw = response.data?.data;

    // Public service list is paginated from backend: { services, total, page, ... }
    // but keep backward compatibility for plain-array responses.
    let data: any[] = [];
    if (Array.isArray(raw)) {
      data = raw.map(item => item?._doc || item);
    } else if (Array.isArray(raw?.services)) {
      data = raw.services.map((item: any) => item?._doc || item);
    } else if (raw && Array.isArray(raw?.data)) {
      data = raw.data.map((item: any) => item?._doc || item);
    }

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

    let processedData: any[] = [];
    if (Array.isArray(raw)) {
      processedData = raw.map(item => item?._doc || item);
    } else if (Array.isArray(raw?.services)) {
      processedData = raw.services.map((item: any) => item?._doc || item);
    } else if (raw && Array.isArray(raw?.data)) {
      processedData = raw.data.map((item: any) => item?._doc || item);
    }

    return { success: true, message: "Services fetched", data: processedData };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch services" };
  }
}


