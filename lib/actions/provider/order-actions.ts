"use server";

import { withActionGuard } from "@/lib/actions/_shared";
import { getProviderOrders, getProviderOrderById, updateProviderOrderStatus } from "@/lib/api/provider/order";
import { revalidatePath } from "next/cache";

export async function handleGetProviderOrders() {
  return withActionGuard(async () => getProviderOrders(), {
    fallbackMessage: "Failed to fetch provider orders",
    logLabel: "Get provider orders error",
  });
}

export async function handleGetProviderOrderById(id: string) {
  return withActionGuard(async () => getProviderOrderById(id), {
    fallbackMessage: "Failed to fetch order",
    logLabel: "Get provider order by id error",
  });
}

export async function handleUpdateProviderOrderStatus(id: string, status: string) {
  return withActionGuard(async () => {
    const result = await updateProviderOrderStatus(id, status);
    if (result.success) revalidatePath("/provider/orders");
    return result;
  }, {
    fallbackMessage: "Failed to update order status",
    logLabel: "Update provider order status error",
  });
}
