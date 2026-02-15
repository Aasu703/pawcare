"use server";

import { getAuthToken } from "@/lib/cookie";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5050";

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
        return {
            success: false,
            message: err.response?.data?.message 
                || err.message 
                || "Failed to fetch pets"
        };
    }
};

export const getPetByIdServer = async (data: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PET.GET_BY_ID(data),
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
                || "Failed to fetch pet"
        };
    }
};

export const createPetServer = async (data: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Handle FormData or plain object: check for file presence
        const hasFile = data && typeof (data as any).values === 'function'
            ? Array.from((data as any).values()).some((value: any) => value instanceof File && value.size > 0)
            : false;

        let response;
        if (hasFile) {
            // Send as FormData if there's a file
            response = await axios.post(
                API.ADMIN.PET.CREATE,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        } else {
            // Convert FormData-like object or plain object to JSON if no file
            const jsonData: any = {};
            if (data && typeof (data as any).forEach === 'function') {
                (data as any).forEach((value: any, key: string) => {
                    if (!(value instanceof File)) jsonData[key] = value;
                });
            } else if (data && typeof data === 'object') {
                Object.keys(data).forEach((key) => {
                    const value = (data as any)[key];
                    if (!(value instanceof File)) jsonData[key] = value;
                });
            }

            response = await axios.post(
                API.ADMIN.PET.CREATE,
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
                || "Failed to create pet"
        };
    }
};

export const updatePetServer = async (id: any, petData: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        // Check if FormData contains a file
        const hasFile = Array.from(petData.values()).some(value => value instanceof File && value.size > 0);

        let response;
        if (hasFile) {
            // Send as FormData if there's a file
            response = await axios.put(
                API.ADMIN.PET.UPDATE(id),
                petData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        } else {
            // Convert FormData to JSON object if no file
            const jsonData: any = {};
            if (typeof (petData as any).forEach === 'function') {
                (petData as any).forEach((value: any, key: string) => {
                    if (!(value instanceof File)) jsonData[key] = value;
                });
            } else if (petData && typeof petData === 'object') {
                Object.keys(petData).forEach((key) => {
                    const value = (petData as any)[key];
                    if (!(value instanceof File)) jsonData[key] = value;
                });
            }

            response = await axios.put(
                API.ADMIN.PET.UPDATE(id),
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
                || "Failed to update pet"
        };
    }
};

export const deletePetServer = async (data: any) => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.delete(
            API.ADMIN.PET.DELETE(data),
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
                || "Failed to delete pet"
        };
    }
};


