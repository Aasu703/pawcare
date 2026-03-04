import axios from "../axios";
import { API } from "../endpoints";

const unwrapApiPayload = (payload: any) => {
  // Supports both wrapped ({ success, data }) and direct payload responses.
  return payload?.data ?? payload;
};

const normalizeServiceList = (payload: any): any[] => {
  const raw = unwrapApiPayload(payload);

  let items: any[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (Array.isArray(raw?.services)) {
    items = raw.services;
  } else if (Array.isArray(raw?.items)) {
    items = raw.items;
  } else if (Array.isArray(raw?.data)) {
    items = raw.data;
  }

  return items.map((item) => item?._doc || item);
};

export async function getAllServices(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_ALL);
    const data = normalizeServiceList(response.data);

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
    const raw = unwrapApiPayload(response.data);
    const service = raw?._doc || raw;

    if (!service || typeof service !== "object") {
      return { success: false, message: "Service not found" };
    }

    return { success: true, message: "Service fetched", data: service };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch service" };
  }
}

export async function getServicesByProvider(providerId: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_BY_PROVIDER(providerId));
    const processedData = normalizeServiceList(response.data);

    return { success: true, message: "Services fetched", data: processedData };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch services" };
  }
}


