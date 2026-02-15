"use server";

import {
    getAllProviderServicesServer,
    approveProviderServiceServer,
    rejectProviderServiceServer
} from "@/lib/api/admin/provider-service-server";
import { revalidatePath } from "next/cache";

export const handleGetAllProviderServices = async () => {
    try {
        const response = await getAllProviderServicesServer();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch provider services.",
        };
    } catch (error: any) {
        console.error('Get all provider services error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching provider services.",
        };
    }
};

export const handleApproveProviderService = async (id: string) => {
    try {
        const response = await approveProviderServiceServer(id);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider service approved successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to approve provider service.",
        };
    } catch (error: any) {
        console.error('Approve provider service error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while approving the provider service.",
        };
    }
};

export const handleRejectProviderService = async (id: string) => {
    try {
        const response = await rejectProviderServiceServer(id);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider service rejected successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to reject provider service.",
        };
    } catch (error: any) {
        console.error('Reject provider service error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while rejecting the provider service.",
        };
    }
};
