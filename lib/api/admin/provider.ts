import { API } from "../endpoints";
import axios from "../axios";

export const createProvider = async (providerData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.PROVIDER.CREATE,
            providerData,
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

export const getProviderById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.PROVIDER.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch provider');
    }
}

export const updateProvider = async (id: string, providerData: any) => {
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

export const deleteProvider = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.PROVIDER.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to delete provider');
    }
}
