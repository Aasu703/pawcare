import { API } from "../endpoints";
import axios from "../axios";

export const getAllServices = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.SERVICE.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch services');
    }
};

export const getServiceById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.SERVICE.GET_BY_ID(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch service');
    }
};

export const deleteService = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.SERVICE.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete service');
    }
};


