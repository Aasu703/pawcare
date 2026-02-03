"use server";

import { getAuthToken } from "@/lib/cookie";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

// Server-side functions that use Next.js cookies for authentication
export const getAllUsersServer = async () => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.USER.GET_ALL,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Get all users error:', err);
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Failed to fetch users"
        );
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
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Failed to fetch user"
        );
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

        const response = await axios.post(
            API.ADMIN.USER.CREATE,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type for FormData
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Failed to create user"
        );
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

        const response = await axios.put(
            API.ADMIN.USER.UPDATE(id),
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type for FormData
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Failed to update user"
        );
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
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Failed to delete user"
        );
    }
};
