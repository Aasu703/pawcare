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

export const getFeedbackByProvider = async (providerId: string) => {
    try {
        const response = await axios.get(API.ADMIN.FEEDBACK.GET_BY_PROVIDER(providerId));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch feedback');
    }
};

export const deleteFeedback = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.FEEDBACK.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete feedback');
    }
};
