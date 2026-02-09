import { API } from "../endpoints";
import axios from "../axios";

export const getAllReviews = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.REVIEW.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch reviews');
    }
};

export const getReviewById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.REVIEW.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch review');
    }
};

export const deleteReview = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.REVIEW.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete review');
    }
};
