"use server";

import { getDashboardStats } from "@/lib/api/admin/stats";

export const handleGetDashboardStats = async () => {
    try {
        const response = await getDashboardStats();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch dashboard stats.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while fetching dashboard stats.",
        };
    }
};

