import { API } from "../endpoints";
import axios from "../axios";

export const getAllInventory = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.INVENTORY.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch inventory');
    }
};

export const getInventoryByProvider = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.INVENTORY.GET_BY_PROVIDER(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch inventory');
    }
};

export const deleteInventory = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.INVENTORY.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete inventory item');
    }
};


