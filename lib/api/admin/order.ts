import axios from "../axios";
import { API } from "../endpoints";
export async function getAllOrders(page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { orders: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.ADMIN.ORDER.GET_ALL, { params: { page, limit } });
    return { success: boolean, message: "Orders fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(data: any): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.get(API.ADMIN.ORDER.GET_BY_ID(id));
    return { success: boolean, message: "Order fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch order" };
  }
}

export async function updateOrder(id: any, data: any): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.put(API.ADMIN.ORDER.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Order updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update order" };
  }
}

export async function deleteOrder(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ADMIN.ORDER.DELETE(id));
    return { success: boolean, message: response.data.message || "Order deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete order" };
  }
}


