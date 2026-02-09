"use server";

import { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, getBookingsByUser } from "@/lib/api/user/booking";
import { CreateBookingRequest, UpdateBookingRequest } from "@/lib/types/booking";
import { revalidatePath } from "next/cache";

export async function handleCreateBooking(data: CreateBookingRequest) {
  try {
    const response = await createBooking(data);
    if (response.success) {
      revalidatePath("/user/bookings");
      return { success: true, message: "Booking created successfully!", data: response.data };
    }
    return { success: false, message: response.message || "Failed to create booking" };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
}

export async function handleGetAllBookings() {
  try {
    const response = await getAllBookings();
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetBookingById(id: string) {
  try {
    const response = await getBookingById(id);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleUpdateBooking(id: string, data: UpdateBookingRequest) {
  try {
    const response = await updateBooking(id, data);
    if (response.success) {
      revalidatePath("/user/bookings");
      return { success: true, message: "Booking updated!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleDeleteBooking(id: string) {
  try {
    const response = await deleteBooking(id);
    if (response.success) {
      revalidatePath("/user/bookings");
      return { success: true, message: "Booking cancelled" };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetBookingsByUser(userId: string) {
  try {
    const response = await getBookingsByUser(userId);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
