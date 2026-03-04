"use server";

import { withActionGuard } from "@/lib/actions/_shared";
import { createOrder, getMyOrders, getOrderById, updateOrder, deleteOrder } from "@/lib/api/user/order";
import { revalidatePath } from "next/cache";

export async function handleCreateOrder(data: any) {
  return withActionGuard(async () => {
    const result = await createOrder(data);
    if (result.success) revalidatePath("/user/orders");
    return result;
  }, {
    fallbackMessage: "Failed to create order",
    logLabel: "Create order error",
  });
}

export async function handleGetMyOrders() {
  return withActionGuard(async () => getMyOrders(), {
    fallbackMessage: "Failed to fetch orders",
    logLabel: "Get my orders error",
  });
}

export async function handleGetOrderById(id: string) {
  return withActionGuard(async () => getOrderById(id), {
    fallbackMessage: "Failed to fetch order",
    logLabel: "Get order by id error",
  });
}

export async function handleUpdateOrder(id: string, data: any) {
  return withActionGuard(async () => {
    const result = await updateOrder(id, data);
    if (result.success) revalidatePath("/user/orders");
    return result;
  }, {
    fallbackMessage: "Failed to update order",
    logLabel: "Update order error",
  });
}

export async function handleDeleteOrder(id: string) {
  return withActionGuard(async () => {
    const result = await deleteOrder(id);
    if (result.success) revalidatePath("/user/orders");
    return result;
  }, {
    fallbackMessage: "Failed to cancel order",
    logLabel: "Delete order error",
  });
}

