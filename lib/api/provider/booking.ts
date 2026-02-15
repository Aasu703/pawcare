import axios from "../axios";
import { API } from "../endpoints";
export async function getProviderBookings(): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PROVIDER.BOOKING.GET_MY);
    return { success: true, message: "Bookings fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch bookings" };
  }
}

export async function getProviderBookingById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.PROVIDER.BOOKING.GET_BY_ID(data));
    return { success: true, message: "Booking fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch booking" };
  }
}

export async function updateBookingStatus(id: any, status: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.PROVIDER.BOOKING.UPDATE_STATUS(id), { status });
    return { success: true, message: response.data.message || `Booking ${status}`, data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update booking status" };
  }
}


