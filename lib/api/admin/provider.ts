import { API } from "../endpoints";
import axios from "../axios";

export const createProvider = async (data: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.PROVIDER.CREATE,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create provider failed');
    }
}

export const getAllProviders = async () => {
    try {
        const response = await axios.get(API.ADMIN.PROVIDER.GET_ALL);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch providers');
    }
}

export const getProviderById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.PROVIDER.GET_BY_ID(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch provider');
    }
}

export const updateProvider = async (id: any, providerData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.PROVIDER.UPDATE(id),
            providerData
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to update provider');
    }
}

export const deleteProvider = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.PROVIDER.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to delete provider');
    }
}


