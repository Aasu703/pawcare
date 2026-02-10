import axios from "../axios";
import { API } from "../endpoints";
import { Order, CreateOrderRequest, UpdateOrderRequest } from "@/lib/types/order";

export async function createOrder(data: CreateOrderRequest): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.post(API.ORDER.CREATE, data);
    return { success: true, message: response.data.message || "Order created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create order" };
  }
}

export async function getMyOrders(): Promise<{ success: boolean; message: string; data?: Order[] }> {
  try {
    const response = await axios.get(API.ORDER.GET_MY);
    return { success: true, message: "Orders fetched", data: response.data.data?.orders || response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(id: string): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.get(API.ORDER.GET_BY_ID(id));
    return { success: true, message: "Order fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch order" };
  }
}

export async function updateOrder(id: string, data: UpdateOrderRequest): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const response = await axios.put(API.ORDER.UPDATE(id), data);
    return { success: true, message: response.data.message || "Order updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update order" };
  }
}

export async function deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ORDER.DELETE(id));
    return { success: true, message: response.data.message || "Order cancelled" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to cancel order" };
  }
}
