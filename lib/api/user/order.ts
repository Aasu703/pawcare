import axios from "../axios";
import { API } from "../endpoints";
export async function createOrder(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.ORDER.CREATE, data);
    return { success: true, message: response.data.message || "Order created", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to create order" };
  }
}

export async function getMyOrders(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.ORDER.GET_MY);
    return { success: true, message: "Orders fetched", data: response.data.data?.orders || response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.ORDER.GET_BY_ID(data));
    return { success: true, message: "Order fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch order" };
  }
}

export async function updateOrder(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.ORDER.UPDATE(id), data);
    return { success: true, message: response.data.message || "Order updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update order" };
  }
}

export async function deleteOrder(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ORDER.DELETE(data));
    return { success: true, message: response.data.message || "Order cancelled" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to cancel order" };
  }
}


