"use server";

import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { getDashboardStats } from "@/lib/api/admin/stats";

export const handleGetDashboardStats = async () => {
    return withActionGuard(async () => {
        const response = await getDashboardStats();

        return mapApiResult(response, {
            errorMessage: "Failed to fetch dashboard stats.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching dashboard stats.",
    });
};

