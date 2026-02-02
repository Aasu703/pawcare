"use server";

import { createProvider, getAllProviders, getProviderById, updateProvider, deleteProvider } from "@/lib/api/admin/provider";
import { revalidatePath } from "next/cache";

export const handleCreateProvider = async (data: FormData) => {
    try {
        const response = await createProvider(data);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider created successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to create provider.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while creating the provider.",
        };
    }
};

export const handleGetAllProviders = async () => {
    try {
        const response = await getAllProviders();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch providers.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching providers.",
        };
    }
};

export const handleGetProviderById = async (id: string) => {
    try {
        const response = await getProviderById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch provider.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching provider.",
        };
    }
};

export const handleUpdateProvider = async (id: string, data: FormData) => {
    try {
        const response = await updateProvider(id, data);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider updated successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to update provider.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while updating the provider.",
        };
    }
};

export const handleDeleteProvider = async (id: string) => {
    try {
        const response = await deleteProvider(id);
        if (response.success) {
            revalidatePath("/admin/providers");
            return { success: true, message: "Provider deleted successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to delete provider.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while deleting the provider.",
        };
    }
};
