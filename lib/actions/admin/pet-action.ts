"use server";

import {
    createPetServer,
    getAllPetsServer,
    getPetByIdServer,
    updatePetServer,
    deletePetServer,
} from "@/lib/api/admin/pet-server";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export const handleCreatePet = async (data: FormData) => {
    return withActionGuard(async () => {
        const response = await createPetServer(data);
        if (response.success) {
            revalidatePath("/admin/pets");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to create pet.",
            successMessage: "Pet created successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while creating the pet.",
        logLabel: "Create pet error",
    });
};

export const handleGetAllPets = async () => {
    return withActionGuard(async () => {
        const response = await getAllPetsServer();

        return mapApiResult(response, {
            errorMessage: "Failed to fetch pets.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching pets.",
        logLabel: "Get all pets error",
    });
};

export const handleGetPetById = async (id: string) => {
    return withActionGuard(async () => {
        const response = await getPetByIdServer(id);

        return mapApiResult(response, {
            errorMessage: "Failed to fetch pet.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching pet.",
        logLabel: "Get pet by id error",
    });
};

export const handleUpdatePet = async (id: string, data: FormData) => {
    return withActionGuard(async () => {
        const response = await updatePetServer(id, data);
        if (response.success) {
            revalidatePath("/admin/pets");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to update pet.",
            successMessage: "Pet updated successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while updating the pet.",
        logLabel: "Update pet error",
    });
};

export const handleDeletePet = async (id: string) => {
    return withActionGuard(async () => {
        const response = await deletePetServer(id);

        if (response?.success) {
            revalidatePath("/admin/pets");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to delete pet.",
            successMessage: "Pet deleted successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while deleting the pet.",
        logLabel: "Delete pet error",
    });
};

