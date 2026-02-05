"use server";

import { getAuthToken } from "@/lib/cookie";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

// Server-side functions that use Next.js cookies for authentication
export const getAllUsersServer = async (page: number = 1, limit: number = 10) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            `${API.ADMIN.USER.GET_ALL}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Get all users error:', err);
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to fetch users"
        };
    }
};

export const getUserByIdServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.USER.GET_BY_ID(id),
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
                || "Failed to fetch user"
        };
    }
};

export const createUserServer = async (userData: FormData) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Check if FormData contains a file
        const hasFile = Array.from(userData.values()).some(value => value instanceof File && value.size > 0);

        let response;
        if (hasFile) {
            // Send as FormData if there's a file
            response = await axios.post(
                API.ADMIN.USER.CREATE,
                userData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Let axios set Content-Type for FormData
                    }
                }
            );
        } else {
            // Convert FormData to JSON object if no file
            const jsonData: any = {};
            userData.forEach((value, key) => {
                if (!(value instanceof File)) {
                    jsonData[key] = value;
                }
            });

            response = await axios.post(
                API.ADMIN.USER.CREATE,
                jsonData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
        
        return response.data;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to create user"
        };
    }
};

export const updateUserServer = async (id: string, userData: FormData) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Check if FormData contains a file
        const hasFile = Array.from(userData.values()).some(value => value instanceof File && value.size > 0);

        let response;
        if (hasFile) {
            // Send as FormData if there's a file
            response = await axios.put(
                API.ADMIN.USER.UPDATE(id),
                userData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        } else {
            // Convert FormData to JSON object if no file
            const jsonData: any = {};
            userData.forEach((value, key) => {
                if (!(value instanceof File)) {
                    jsonData[key] = value;
                }
            });

            response = await axios.put(
                API.ADMIN.USER.UPDATE(id),
                jsonData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
        
        return response.data;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to update user"
        };
    }
};

export const deleteUserServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.delete(
            API.ADMIN.USER.DELETE(id),
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
                || "Failed to delete user"
        };
    }
};
