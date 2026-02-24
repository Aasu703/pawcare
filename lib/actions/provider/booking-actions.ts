"use server";

import { withActionGuard } from "@/lib/actions/_shared";
import { getProviderBookings, updateBookingStatus } from "@/lib/api/provider/booking";
import { revalidatePath } from "next/cache";

export async function handleGetProviderBookings() {
  return withActionGuard(async () => getProviderBookings(), {
    fallbackMessage: "Failed to fetch bookings",
    logLabel: "Get provider bookings error",
  });
}

export async function handleUpdateBookingStatus(id: string, status: string) {
  return withActionGuard(async () => {
    const result = await updateBookingStatus(id, status);
    if (result.success) revalidatePath("/provider/bookings");
    return result;
  }, {
    fallbackMessage: "Failed to update booking status",
    logLabel: "Update booking status error",
  });
}

