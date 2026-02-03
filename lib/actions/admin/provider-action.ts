"use server";

import { 
    createProviderServer, 
    getAllProvidersServer, 
    getProviderByIdServer, 
    updateProviderServer, 
    deleteProviderServer 
} from "@/lib/api/admin/provider-server";
import { revalidatePath } from "next/cache";

export const handleCreateProvider = async (data: FormData) => {
    try {
        const response = await createProviderServer(data);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider created successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to create provider.",
        };
    } catch (error: any) {
        console.error('Create provider error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while creating the provider.",
        };
    }
};

export const handleGetAllProviders = async () => {
    try {
        const response = await getAllProvidersServer();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch providers.",
        };
    } catch (error: any) {
        console.error('Get all providers error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching providers.",
        };
    }
};

export const handleGetProviderById = async (id: string) => {
    try {
        const response = await getProviderByIdServer(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch provider.",
        };
    } catch (error: any) {
        console.error('Get provider by id error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching provider.",
        };
    }
};

export const handleUpdateProvider = async (id: string, data: FormData) => {
    try {
        const response = await updateProviderServer(id, data);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider updated successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to update provider.",
        };
    } catch (error: any) {
        console.error('Update provider error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while updating the provider.",
        };
    }
};

export const handleDeleteProvider = async (id: string) => {
    try {
        const response = await deleteProviderServer(id);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider deleted successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to delete provider.",
        };
    } catch (error: any) {
        console.error('Delete provider error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while deleting the provider.",
        };
    }
};
