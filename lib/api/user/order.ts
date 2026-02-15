import axios from "../axios";
import { API } from "../endpoints";
export async function createOrder(data: any): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.post(API.ORDER.CREATE, data);
    return { success: boolean, message: response.data.message || "Order created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create order" };
  }
}

export async function getMyOrders(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.ORDER.GET_MY);
    return { success: boolean, message: "Orders fetched", data: response.data.data?.orders || response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(data: any): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.get(API.ORDER.GET_BY_ID(id));
    return { success: boolean, message: "Order fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch order" };
  }
}

export async function updateOrder(id: any, data: any): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.put(API.ORDER.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Order updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update order" };
  }
}

export async function deleteOrder(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ORDER.DELETE(id));
    return { success: boolean, message: response.data.message || "Order cancelled" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to cancel order" };
  }
}


