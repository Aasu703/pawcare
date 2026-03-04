"use server";

import {
    getAllProviderServicesServer,
    approveProviderServiceServer,
    rejectProviderServiceServer,
} from "@/lib/api/admin/provider-service-server";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export const handleGetAllProviderServices = async () => {
    return withActionGuard(async () => {
        const response = await getAllProviderServicesServer();

        return mapApiResult(response, {
            errorMessage: "Failed to fetch provider services.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching provider services.",
        logLabel: "Get all provider services error",
    });
};

export const handleApproveProviderService = async (id: string) => {
    return withActionGuard(async () => {
        const response = await approveProviderServiceServer(id);

        if (response?.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to approve provider service.",
            successMessage: "Provider service approved successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while approving the provider service.",
        logLabel: "Approve provider service error",
    });
};

export const handleRejectProviderService = async (id: string) => {
    return withActionGuard(async () => {
        const response = await rejectProviderServiceServer(id);

        if (response?.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to reject provider service.",
            successMessage: "Provider service rejected successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while rejecting the provider service.",
        logLabel: "Reject provider service error",
    });
};
