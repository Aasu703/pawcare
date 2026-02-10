import axios from "../axios";
import { API } from "../endpoints";
import { Order, UpdateOrderRequest } from "@/lib/types/order";

export async function getAllOrders(page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { orders: Order[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.ADMIN.ORDER.GET_ALL, { params: { page, limit } });
    return { success: true, message: "Orders fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(id: string): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.get(API.ADMIN.ORDER.GET_BY_ID(id));
    return { success: true, message: "Order fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch order" };
  }
}

export async function updateOrder(id: string, data: UpdateOrderRequest): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.put(API.ADMIN.ORDER.UPDATE(id), data);
    return { success: true, message: response.data.message || "Order updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update order" };
  }
}

export async function deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ADMIN.ORDER.DELETE(id));
    return { success: true, message: response.data.message || "Order deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete order" };
  }
}
