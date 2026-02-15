import axios from "../axios";
import { API } from "../endpoints";

// Provider Auth
export async function providerRegister(data: any): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
  try {
    const response = await axios.post(API.PROVIDER.REGISTER, data);
    return response.data;
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Registration failed" };
  }
}

export async function providerLogin(data: { email: string; password: string }): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
  try {
    const response = await axios.post(API.PROVIDER.LOGIN, data);
    return response.data;
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Login failed" };
  }
}

// Provider Services
export async function createProviderService(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.SERVICE.CREATE, data);
    return { success: boolean, message: response.data.message || "Service created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create service" };
  }
}

export async function getProviderServices(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.SERVICE.GET_ALL);
    const raw = response.data?.data;
    const data = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return { success: boolean, message: "Services fetched", data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch services" };
  }
}

export async function getProviderServiceById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PROVIDER.SERVICE.GET_BY_ID(id));
    return { success: boolean, message: "Service fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch service" };
  }
}

export async function updateProviderService(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.SERVICE.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Service updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update service" };
  }
}

export async function deleteProviderService(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.SERVICE.DELETE(id));
    return { success: boolean, message: response.data.message || "Service deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete service" };
  }
}

// Provider Inventory
export async function createInventory(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.INVENTORY.CREATE, data);
    return { success: boolean, message: response.data.message || "Inventory item created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create inventory item" };
  }
}

export async function getInventoryByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.INVENTORY.GET_BY_PROVIDER(providerId));
    return { success: boolean, message: "Inventory fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch inventory" };
  }
}

export async function updateInventory(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.INVENTORY.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Inventory updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update inventory" };
  }
}

export async function deleteInventory(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.INVENTORY.DELETE(id));
    return { success: boolean, message: response.data.message || "Inventory item deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete inventory item" };
  }
}

// Provider Feedback
export async function createFeedback(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.PROVIDER.FEEDBACK.CREATE, data);
    return { success: boolean, message: response.data.message || "Feedback submitted", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to submit feedback" };
  }
}

export async function getFeedbackByProvider(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.FEEDBACK.GET_BY_PROVIDER(providerId));
    return { success: boolean, message: "Feedback fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch feedback" };
  }
}

export async function updateFeedback(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.FEEDBACK.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Feedback updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update feedback" };
  }
}

export async function deleteFeedback(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.FEEDBACK.DELETE(id));
    return { success: boolean, message: response.data.message || "Feedback deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete feedback" };
  }
}


