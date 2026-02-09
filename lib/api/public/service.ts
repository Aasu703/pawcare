import axios from "../axios";
import { API } from "../endpoints";
import { Service } from "@/lib/types/service";

export async function getAllServices(): Promise<{ success: boolean; message: string; data?: Service[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_ALL);
    return { success: true, message: "Services fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch services" };
  }
}

export async function getServiceById(id: string): Promise<{ success: boolean; message: string; data?: Service }> {
  try {
    const response = await axios.get(API.SERVICE.GET_BY_ID(id));
    return { success: true, message: "Service fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch service" };
  }
}

export async function getServicesByProvider(providerId: string): Promise<{ success: boolean; message: string; data?: Service[] }> {
  try {
    const response = await axios.get(API.SERVICE.GET_BY_PROVIDER(providerId));
    return { success: true, message: "Services fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch services" };
  }
}
