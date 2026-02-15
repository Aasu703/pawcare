import { API } from "../endpoints";
import axios from "../axios";

export const getAllBookings = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.BOOKING.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    }
};

export const getBookingById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.BOOKING.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch booking');
    }
};

export const updateBooking = async (id: any, data: any) => {
    try {
        const response = await axios.put(API.ADMIN.BOOKING.UPDATE(id), data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to update booking');
    }
};

export const deleteBooking = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.BOOKING.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete booking');
    }
};


