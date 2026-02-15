"use server";

import { 
    createPetServer, 
    getAllPetsServer, 
    getPetByIdServer, 
    updatePetServer, 
    deletePetServer 
} from "@/lib/api/admin/pet-server";
import { revalidatePath } from "next/cache";

export const handleCreatePet = async (data: FormData) => {
    try {
        const response = await createPetServer(data);
        if (response.success) {
            revalidatePath("/admin/pets");
            return { success: true, message: "Pet created successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to create pet.",
        };
    } catch (error: any) {
        console.error('Create pet error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while creating the pet.",
        };
    }
};

export const handleGetAllPets = async () => {
    try {
        const response = await getAllPetsServer();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch pets.",
        };
    } catch (error: any) {
        console.error('Get all pets error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching pets.",
        };
    }
};

export const handleGetPetById = async (id: string) => {
    try {
        const response = await getPetByIdServer(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch pet.",
        };
    } catch (error: any) {
        console.error('Get pet by id error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching pet.",
        };
    }
};

export const handleUpdatePet = async (id: string, data: FormData) => {
    try {
        const response = await updatePetServer(id, data);
        if (response.success) {
            revalidatePath("/admin/pets");
            return { success: true, message: "Pet updated successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to update pet.",
        };
    } catch (error: any) {
        console.error('Update pet error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while updating the pet.",
        };
    }
};



export const handleDeletePet = async (id: string) => {
    try {
        const response = await deletePetServer(id);
        if (response.success) {
            revalidatePath("/admin/pets");
            return { success: true, message: "Pet deleted successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to delete pet.",
        };
    } catch (error: any) {
        console.error('Delete pet error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while deleting the pet.",
        };
    }
};

