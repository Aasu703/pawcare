import { API } from "../endpoints";
import axios from "../axios";

export const getAllMessages = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.MESSAGE.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch messages');
    }
};

export const getMessageById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.MESSAGE.GET_BY_ID(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch message');
    }
};

export const deleteMessage = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.MESSAGE.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete message');
    }
};


