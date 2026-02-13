import { API } from "../endpoints";
import axios from "../axios";

export const getAllProviderServices = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.PROVIDER.SERVICE.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch provider services');
    }
};

export const getProviderServiceById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.PROVIDER.SERVICE.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch provider service');
    }
};

export const approveProviderService = async (id: string) => {
    try {
        const response = await axios.put(API.ADMIN.PROVIDER.SERVICE.APPROVE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to approve provider service');
    }
};

export const rejectProviderService = async (id: string) => {
    try {
        const response = await axios.put(API.ADMIN.PROVIDER.SERVICE.REJECT(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to reject provider service');
    }
};