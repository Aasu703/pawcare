"use server";
    
import { 
    createUserServer, 
    getAllUsersServer, 
    getUserByIdServer, 
    updateUserServer, 
    deleteUserServer 
} from "@/lib/api/admin/user-server";
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data: FormData) => {
    try {
        const response = await createUserServer(data);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User created successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to create user.",
        };
    } catch (error: any) {
        console.error('Create user error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while creating the user.",
        };
    }
};

export const handleGetAllUsers = async () => {
    try {
        const response = await getAllUsersServer();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch users.",
        };
    } catch (error: any) {
        console.error('Get all users error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching users.",
        };
    }
};

export const handleGetUserById = async (id: string) => {
    try {
        const response = await getUserByIdServer(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch user.",
        };
    } catch (error: any) {
        console.error('Get user by id error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching user.",
        };
    }
};

export const handleUpdateUser = async (id: string, data: FormData) => {
    try {
        const response = await updateUserServer(id, data);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User updated successfully.", data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to update user.",
        };
    } catch (error: any) {
        console.error('Update user error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while updating the user.",
        };
    }
};

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUserServer(id);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User deleted successfully." };
        }
        return {
            success: false,
            message: response.message || "Failed to delete user.",
        };
    } catch (error: any) {
        console.error('Delete user error:', error);
        return {
            success: false,
            message: error.message || "An error occurred while deleting the user.",
        };
    }
};