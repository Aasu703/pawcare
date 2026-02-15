import axios from "../axios";
import { API } from "../endpoints";
export async function getProviderBookings(): Promise<{ success: boolean; message: string; data?: { bookings: any[]; total: number; page: number; totalPages: number } }> {
  try {
    const response = await axios.get(API.PROVIDER.BOOKING.GET_MY);
    return { success: boolean, message: "Bookings fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch bookings" };
  }
}

export async function getProviderBookingById(data: any): Promise<{ success: boolean; message: string; data?: Booking }> {
  try {
    const response = await axios.get(API.PROVIDER.BOOKING.GET_BY_ID(id));
    return { success: boolean, message: "Booking fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch booking" };
  }
}

export async function updateBookingStatus(id: any, status: any): Promise<{ success: boolean; message: string; data?: Booking }> {
  try {
    const response = await axios.put(API.PROVIDER.BOOKING.UPDATE_STATUS(id), { status });
    return { success: boolean, message: response.data.message || `Booking ${status}`, data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update booking status" };
  }
}


