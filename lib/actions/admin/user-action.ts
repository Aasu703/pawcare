"use server";

import {
    createUserServer,
    getAllUsersServer,
    getUserByIdServer,
    updateUserServer,
    deleteUserServer,
} from "@/lib/api/admin/user-server";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data: FormData) => {
    return withActionGuard(async () => {
        const response = await createUserServer(data);
        if (response.success) {
            revalidatePath("/admin/users");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to create user.",
            successMessage: "User created successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while creating the user.",
        logLabel: "Create user error",
    });
};

export const handleGetAllUsers = async (page: number = 1, limit: number = 10) => {
    return withActionGuard(async () => {
        const response = await getAllUsersServer(page, limit);

        return mapApiResult(response, {
            errorMessage: "Failed to fetch users.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching users.",
        logLabel: "Get all users error",
    });
};

export const handleGetUserById = async (id: string) => {
    return withActionGuard(async () => {
        const response = await getUserByIdServer(id);

        return mapApiResult(response, {
            errorMessage: "Failed to fetch user.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching user.",
        logLabel: "Get user by id error",
    });
};

export const handleUpdateUser = async (id: string, data: FormData) => {
    return withActionGuard(async () => {
        const response = await updateUserServer(id, data);
        if (response.success) {
            revalidatePath("/admin/users");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to update user.",
            successMessage: "User updated successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while updating the user.",
        logLabel: "Update user error",
    });
};

export const handleDeleteUser = async (id: string) => {
    return withActionGuard(async () => {
        const response = await deleteUserServer(id);

        if (response?.success) {
            revalidatePath("/admin/users");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to delete user.",
            successMessage: "User deleted successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while deleting the user.",
        logLabel: "Delete user error",
    });
};
