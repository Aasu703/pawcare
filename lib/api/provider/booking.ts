import axios from "../axios";
import { API } from "../endpoints";
import { Booking } from "@/lib/types/booking";

export async function getProviderBookings(): Promise<{ success: boolean; message: string; data?: { bookings: Booking[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.PROVIDER.BOOKING.GET_MY);
    return { success: true, message: "Bookings fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch bookings" };
  }
}

export async function getProviderBookingById(id: string): Promise<{ success: boolean; message: string; data?: Booking }> {
  try {
    const response = await axios.get(API.PROVIDER.BOOKING.GET_BY_ID(id));
    return { success: true, message: "Booking fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch booking" };
  }
}

export async function updateBookingStatus(id: string, status: string): Promise<{ success: boolean; message: string; data?: Booking }> {
  try {
    const response = await axios.put(API.PROVIDER.BOOKING.UPDATE_STATUS(id), { status });
    return { success: true, message: response.data.message || `Booking ${status}`, data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update booking status" };
  }
}
