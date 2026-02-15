"use server";

import { createOrder, getMyOrders, getOrderById, updateOrder, deleteOrder } from "@/lib/api/user/order";
import { revalidatePath } from "next/cache";

export async function handleCreateOrder(data: any) {
  try {
    const result = await createOrder(data);
    if (result.success) revalidatePath("/user/orders");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create order" };
  }
}

export async function handleGetMyOrders() {
  try {
    return await getMyOrders();
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch orders" };
  }
}

export async function handleGetOrderById(id: string) {
  try {
    return await getOrderById(id);
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch order" };
  }
}

export async function handleUpdateOrder(id: string, data: any) {
  try {
    const result = await updateOrder(id, data);
    if (result.success) revalidatePath("/user/orders");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update order" };
  }
}

export async function handleDeleteOrder(id: string) {
  try {
    const result = await deleteOrder(id);
    if (result.success) revalidatePath("/user/orders");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to cancel order" };
  }
}

