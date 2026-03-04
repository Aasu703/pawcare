"use server";

import { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, getBookingsByUser } from "@/lib/api/user/booking";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export async function handleCreateBooking(data: any) {
  return withActionGuard(async () => {
    const response = await createBooking(data);
    if (response?.success) {
      revalidatePath("/user/bookings");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to create booking",
      successMessage: "Booking created successfully!",
    });
  }, {
    fallbackMessage: "An error occurred",
    logLabel: "Create booking error",
  });
}

export async function handleGetAllBookings() {
  return withActionGuard(async () => {
    const response = await getAllBookings();
    return mapApiResult(response, {
      errorMessage: "Failed to fetch bookings",
    });
  }, {
    fallbackMessage: "Failed to fetch bookings",
    logLabel: "Get all bookings error",
  });
}

export async function handleGetBookingById(id: string) {
  return withActionGuard(async () => {
    const response = await getBookingById(id);
    return mapApiResult(response, {
      errorMessage: "Failed to fetch booking",
    });
  }, {
    fallbackMessage: "Failed to fetch booking",
    logLabel: "Get booking by id error",
  });
}

export async function handleUpdateBooking(id: string, data: any) {
  return withActionGuard(async () => {
    const response = await updateBooking(id, data);
    if (response?.success) {
      revalidatePath("/user/bookings");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to update booking",
      successMessage: "Booking updated!",
    });
  }, {
    fallbackMessage: "Failed to update booking",
    logLabel: "Update booking error",
  });
}

export async function handleDeleteBooking(id: string) {
  return withActionGuard(async () => {
    const response = await deleteBooking(id);
    if (response?.success) {
      revalidatePath("/user/bookings");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to delete booking",
      successMessage: "Booking cancelled",
    });
  }, {
    fallbackMessage: "Failed to delete booking",
    logLabel: "Delete booking error",
  });
}

export async function handleGetBookingsByUser(userId: string) {
  return withActionGuard(async () => {
    const response = await getBookingsByUser(userId);
    return mapApiResult(response, {
      errorMessage: "Failed to fetch bookings",
    });
  }, {
    fallbackMessage: "Failed to fetch bookings",
    logLabel: "Get bookings by user error",
  });
}

