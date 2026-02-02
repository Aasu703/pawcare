"use server";

import { createPet, getAllPets, getPetById, updatePet, deletePet } from "@/lib/api/admin/pet";
import { revalidatePath } from "next/cache";

export const handleCreatePet = async (data: FormData) => {
    try {
        const response = await createPet(data);
        if (response.success) {
            revalidatePath("/admin/pets");
            return { success: true, message: "Pet created successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to create pet.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while creating the pet.",
        };
    }
};

export const handleGetAllPets = async () => {
    try {
        const response = await getAllPets();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch pets.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching pets.",
        };
    }
};

export const handleGetPetById = async (id: string) => {
    try {
        const response = await getPetById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch pet.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching pet.",
        };
    }
};

export const handleUpdatePet = async (id: string, data: FormData) => {
    try {
        const response = await updatePet(id, data);
        if (response.success) {
            revalidatePath("/admin/pets");
            return { success: true, message: "Pet updated successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to update pet.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while updating the pet.",
        };
    }
};

export const handleDeletePet = async (id: string) => {
    try {
        const response = await deletePet(id);
        if (response.success) {
            revalidatePath("/admin/pets");
            return { success: true, message: "Pet deleted successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to delete pet.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while deleting the pet.",
        };
    }
};
