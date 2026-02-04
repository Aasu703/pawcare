"use server";

import { getAuthToken } from "@/lib/cookie";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

// Server-side functions that use Next.js cookies for authentication
export const getAllProvidersServer = async () => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PROVIDER.GET_ALL,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Get all providers error:', err);
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to fetch providers"
        };
    }
};

export const getProviderByIdServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PROVIDER.GET_BY_ID(id),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to fetch provider"
        };
    }
};

export const createProviderServer = async (providerData: FormData) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Convert FormData to JSON object
        const jsonData: any = {};
        providerData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const response = await axios.post(
            API.ADMIN.PROVIDER.CREATE,
            jsonData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to create provider"
        };
    }
};

export const updateProviderServer = async (id: string, providerData: FormData) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Convert FormData to JSON object
        const jsonData: any = {};
        providerData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const response = await axios.put(
            API.ADMIN.PROVIDER.UPDATE(id),
            jsonData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to update provider"
        };
    }
};

export const deleteProviderServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.delete(
            API.ADMIN.PROVIDER.DELETE(id),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to delete provider"
        };
    }
};
