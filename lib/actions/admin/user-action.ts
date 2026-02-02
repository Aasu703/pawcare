"use server";

import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data: FormData) => {
    try {
        const response = await createUser(data);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User created successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to create user.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while creating the user.",
        };
    }
};

export const handleGetAllUsers = async () => {
    try {
        const response = await getAllUsers();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch users.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching users.",
        };
    }
};

export const handleGetUserById = async (id: string) => {
    try {
        const response = await getUserById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch user.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching user.",
        };
    }
};

export const handleUpdateUser = async (id: string, data: FormData) => {
    try {
        const response = await updateUser(id, data);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User updated successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to update user.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while updating the user.",
        };
    }
};

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUser(id);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User deleted successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to delete user.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while deleting the user.",
        };
    }
};