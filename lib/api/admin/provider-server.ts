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

export const getProviderByIdServer = async (data: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PROVIDER.GET_BY_ID(data),
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

export const createProviderServer = async (data: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Convert FormData-like or plain object to JSON
        const jsonData: any = {};
        if (typeof (data as any).forEach === 'function') {
            (data as any).forEach((value: any, key: string) => {
                jsonData[key] = value;
            });
        } else if (data && typeof data === 'object') {
            Object.keys(data).forEach((key) => {
                jsonData[key] = (data as any)[key];
            });
        }

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

export const updateProviderServer = async (id: any, providerData: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const jsonData: any = {};
        if (typeof (providerData as any).forEach === 'function') {
            (providerData as any).forEach((value: any, key: string) => {
                jsonData[key] = value;
            });
        } else if (providerData && typeof providerData === 'object') {
            Object.keys(providerData).forEach((key) => {
                jsonData[key] = (providerData as any)[key];
            });
        }

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

export const deleteProviderServer = async (data: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.delete(
            API.ADMIN.PROVIDER.DELETE(data),
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

export const getProvidersByStatusServer = async (status: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "No auth token found" };
        }

        const response = await axios.get(
            API.PROVIDER.GET_BY_STATUS(status),
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
                || "Failed to fetch providers by status"
        };
    }
};

export const approveProviderServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "No auth token found" };
        }

        const response = await axios.put(
            API.PROVIDER.APPROVE(id),
            {},
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
                || "Failed to approve provider"
        };
    }
};

export const rejectProviderServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "No auth token found" };
        }

        const response = await axios.put(
            API.PROVIDER.REJECT(id),
            {},
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
                || "Failed to reject provider"
        };
    }
};


