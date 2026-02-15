import axios from "../axios";
import { API } from "../endpoints";

// Provider Auth
export async function providerRegister(data: any): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
  try {
    const response = await axios.post(API.PROVIDER.REGISTER, data);
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Registration failed" };
  }
}

export async function providerLogin(data: { email: string; password: string }): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
  try {
    const response = await axios.post(API.PROVIDER.LOGIN, data);
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Login failed" };
  }
}

export async function setProviderType(data: { type: string }): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.SET_TYPE, data);
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to set provider type" };
  }
}

// Provider Services
export async function createProviderService(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.SERVICE.CREATE, data);
    return { success: true, message: response.data.message || "Service created", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to create service" };
  }
}

export async function getProviderServices(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.SERVICE.GET_ALL);
    const raw = response.data?.data;
    const data = Array.isArray(raw) ? raw.map(item => item._doc || item) : raw ? [raw._doc || raw] : [];
    return { success: true, message: "Services fetched", data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch services" };
  }
}

export async function getProviderServiceById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PROVIDER.SERVICE.GET_BY_ID(data));
    return { success: true, message: "Service fetched", data: response.data.data?._doc || response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch service" };
  }
}

export async function updateProviderService(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.SERVICE.UPDATE(id), data);
    return { success: true, message: response.data.message || "Service updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update service" };
  }
}

export async function deleteProviderService(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.SERVICE.DELETE(data));
    return { success: true, message: response.data.message || "Service deleted" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to delete service" };
  }
}

// Provider Inventory
export async function createInventory(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.INVENTORY.CREATE, data);
    return { success: true, message: response.data.message || "Inventory item created", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to create inventory item" };
  }
}

export async function getInventoryByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.INVENTORY.GET_BY_PROVIDER(data));
    return { success: true, message: "Inventory fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch inventory" };
  }
}

export async function updateInventory(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.INVENTORY.UPDATE(id), data);
    return { success: true, message: response.data.message || "Inventory updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update inventory" };
  }
}

export async function deleteInventory(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.INVENTORY.DELETE(data));
    return { success: true, message: response.data.message || "Inventory item deleted" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to delete inventory item" };
  }
}

// Provider Feedback
export async function createFeedback(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.FEEDBACK.CREATE, data);
    return { success: true, message: response.data.message || "Feedback submitted", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to submit feedback" };
  }
}

export async function getFeedbackByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.FEEDBACK.GET_BY_PROVIDER(data));
    return { success: true, message: "Feedback fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch feedback" };
  }
}

export async function updateFeedback(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.FEEDBACK.UPDATE(id), data);
    return { success: true, message: response.data.message || "Feedback updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update feedback" };
  }
}

export async function deleteFeedback(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.FEEDBACK.DELETE(data));
    return { success: true, message: response.data.message || "Feedback deleted" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to delete feedback" };
  }
}


