"use server";

import { getProviderBookings, updateBookingStatus } from "@/lib/api/provider/booking";
import { revalidatePath } from "next/cache";

export async function handleGetProviderBookings() {
  try {
    return await getProviderBookings();
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to fetch bookings" };
  }
}

export async function handleUpdateBookingStatus(id: string, status: string) {
  try {
    const result = await updateBookingStatus(id, status);
    if (result.success) revalidatePath("/provider/bookings");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update booking status" };
  }
}
