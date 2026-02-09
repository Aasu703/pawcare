import axios from "../axios";
import { API } from "../endpoints";
import { Service, CreateServiceRequest, UpdateServiceRequest } from "@/lib/types/service";
import { Inventory, CreateInventoryRequest, UpdateInventoryRequest } from "@/lib/types/provider";
import { Feedback, CreateFeedbackRequest, UpdateFeedbackRequest } from "@/lib/types/provider";

// Provider Auth
export async function providerRegister(data: any): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
  try {
    const response = await axios.post(API.PROVIDER.REGISTER, data);
    return response.data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Registration failed" };
  }
}

export async function providerLogin(data: { email: string; password: string }): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
  try {
    const response = await axios.post(API.PROVIDER.LOGIN, data);
    return response.data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Login failed" };
  }
}

// Provider Services
export async function createProviderService(data: CreateServiceRequest): Promise<{ success: boolean; message: string; data?: Service }> {
  try {
    const response = await axios.post(API.PROVIDER.SERVICE.CREATE, data);
    return { success: true, message: response.data.message || "Service created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create service" };
  }
}

export async function getProviderServices(): Promise<{ success: boolean; message: string; data?: Service[] }> {
  try {
    const response = await axios.get(API.PROVIDER.SERVICE.GET_ALL);
    return { success: true, message: "Services fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch services" };
  }
}

export async function getProviderServiceById(id: string): Promise<{ success: boolean; message: string; data?: Service }> {
  try {
    const response = await axios.get(API.PROVIDER.SERVICE.GET_BY_ID(id));
    return { success: true, message: "Service fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch service" };
  }
}

export async function updateProviderService(id: string, data: UpdateServiceRequest): Promise<{ success: boolean; message: string; data?: Service }> {
  try {
    const response = await axios.put(API.PROVIDER.SERVICE.UPDATE(id), data);
    return { success: true, message: response.data.message || "Service updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update service" };
  }
}

export async function deleteProviderService(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.SERVICE.DELETE(id));
    return { success: true, message: response.data.message || "Service deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete service" };
  }
}

// Provider Inventory
export async function createInventory(data: CreateInventoryRequest): Promise<{ success: boolean; message: string; data?: Inventory }> {
  try {
    const response = await axios.post(API.PROVIDER.INVENTORY.CREATE, data);
    return { success: true, message: response.data.message || "Inventory item created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create inventory item" };
  }
}

export async function getInventoryByProvider(providerId: string): Promise<{ success: boolean; message: string; data?: Inventory[] }> {
  try {
    const response = await axios.get(API.PROVIDER.INVENTORY.GET_BY_PROVIDER(providerId));
    return { success: true, message: "Inventory fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch inventory" };
  }
}

export async function updateInventory(id: string, data: UpdateInventoryRequest): Promise<{ success: boolean; message: string; data?: Inventory }> {
  try {
    const response = await axios.put(API.PROVIDER.INVENTORY.UPDATE(id), data);
    return { success: true, message: response.data.message || "Inventory updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update inventory" };
  }
}

export async function deleteInventory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.INVENTORY.DELETE(id));
    return { success: true, message: response.data.message || "Inventory item deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete inventory item" };
  }
}

// Provider Feedback
export async function createFeedback(data: CreateFeedbackRequest): Promise<{ success: boolean; message: string; data?: Feedback }> {
  try {
    const response = await axios.post(API.PROVIDER.FEEDBACK.CREATE, data);
    return { success: true, message: response.data.message || "Feedback submitted", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to submit feedback" };
  }
}

export async function getFeedbackByProvider(providerId: string): Promise<{ success: boolean; message: string; data?: Feedback[] }> {
  try {
    const response = await axios.get(API.PROVIDER.FEEDBACK.GET_BY_PROVIDER(providerId));
    return { success: true, message: "Feedback fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch feedback" };
  }
}

export async function updateFeedback(id: string, data: UpdateFeedbackRequest): Promise<{ success: boolean; message: string; data?: Feedback }> {
  try {
    const response = await axios.put(API.PROVIDER.FEEDBACK.UPDATE(id), data);
    return { success: true, message: response.data.message || "Feedback updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update feedback" };
  }
}

export async function deleteFeedback(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.PROVIDER.FEEDBACK.DELETE(id));
    return { success: true, message: response.data.message || "Feedback deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete feedback" };
  }
}
