import axios from "../axios";
import { API } from "../endpoints";

export async function createBooking(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.BOOKING.CREATE, data);
    return { success: true, message: response.data.message || "Booking created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create booking" };
  }
}

export async function getAllBookings(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.BOOKING.GET_ALL);
    return { success: true, message: "Bookings fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch bookings" };
  }
}

export async function getBookingById(id: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.BOOKING.GET_BY_ID(id));
    return { success: true, message: "Booking fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch booking" };
  }
}

export async function updateBooking(id: string, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.BOOKING.UPDATE(id), data);
    return { success: true, message: response.data.message || "Booking updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update booking" };
  }
}

export async function deleteBooking(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.BOOKING.DELETE(id));
    return { success: true, message: response.data.message || "Booking deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete booking" };
  }
}

export async function getBookingsByUser(userId: string): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.BOOKING.GET_BY_USER(userId));
    const raw = response.data?.data;
    const data = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return { success: true, message: "Bookings fetched", data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch bookings" };
  }
}


