"use server";

import { getAuthToken } from "@/lib/cookie";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

// Server-side functions that use Next.js cookies for authentication
export const getAllProviderServicesServer = async () => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.ADMIN.PROVIDER.SERVICE.GET_ALL,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Get all provider services error:', err);
        return {
            success: false,
            message: err.response?.data?.message
                || err.message
                || "Failed to fetch provider services"
        };
    }
};

export const approveProviderServiceServer = async (data: any) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.put(
            API.ADMIN.PROVIDER.SERVICE.APPROVE(data),
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Approve provider service error:', err);
        return {
            success: false,
            message: err.response?.data?.message
                || err.message
                || "Failed to approve provider service"
        };
    }
};

export const rejectProviderServiceServer = async (data: any) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.put(
            API.ADMIN.PROVIDER.SERVICE.REJECT(data),
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('Reject provider service error:', err);
        return {
            success: false,
            message: err.response?.data?.message
                || err.message
                || "Failed to reject provider service"
        };
    }
};

