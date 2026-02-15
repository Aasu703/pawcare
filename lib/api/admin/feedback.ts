import { API } from "../endpoints";
import axios from "../axios";

export const getAllFeedback = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.FEEDBACK.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch feedback');
    }
};

export const getFeedbackByProvider = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.FEEDBACK.GET_BY_PROVIDER(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch feedback');
    }
};

export const deleteFeedback = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.FEEDBACK.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete feedback');
    }
};


