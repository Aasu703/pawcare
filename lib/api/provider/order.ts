import axios from "../axios";
import { API } from "../endpoints";

export async function getProviderOrders(): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PROVIDER.ORDER.GET_MY);
    const data = response.data.data;
    const orders = data?.orders || data?.items || data;
    return { success: true, message: "Orders fetched", data: Array.isArray(orders) ? orders : [] };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch orders" };
  }
}

export async function getProviderOrderById(id: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PROVIDER.ORDER.GET_BY_ID(id));
    return { success: true, message: "Order fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch order" };
  }
}

export async function updateProviderOrderStatus(id: string, status: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.ORDER.UPDATE_STATUS(id), { status });
    return { success: true, message: response.data.message || "Order status updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update order status" };
  }
}
