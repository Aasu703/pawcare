"use server";

import { getAuthToken } from "@/lib/cookie";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

// Server-side functions that use Next.js cookies for authentication
export const getAllPetsServer = async () => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PET.GET_ALL,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Get all pets error:', err);
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Failed to fetch pets"
        );
    }
};

export const getPetByIdServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PET.GET_BY_ID(id),
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
            || "Failed to fetch pet"
        );
    }
};

export const createPetServer = async (petData: FormData) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.post(
            API.ADMIN.PET.CREATE,
            petData,
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
            || "Failed to create pet"
        );
    }
};

export const updatePetServer = async (id: string, petData: FormData) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.put(
            API.ADMIN.PET.UPDATE(id),
            petData,
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
            || "Failed to update pet"
        );
    }
};

export const deletePetServer = async (id: string) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.delete(
            API.ADMIN.PET.DELETE(id),
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
            || "Failed to delete pet"
        );
    }
};
