"use server";

import {
    createProviderServer,
    getAllProvidersServer,
    getProviderByIdServer,
    updateProviderServer,
    deleteProviderServer,
    getProvidersByStatusServer,
    approveProviderServer,
    rejectProviderServer,
} from "@/lib/api/admin/provider-server";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export const handleCreateProvider = async (data: FormData) => {
    return withActionGuard(async () => {
        const response = await createProviderServer(data);
        if (response.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to create provider.",
            successMessage: "Provider created successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while creating the provider.",
        logLabel: "Create provider error",
    });
};

export const handleGetAllProviders = async () => {
    return withActionGuard(async () => {
        const response = await getAllProvidersServer();

        return mapApiResult(response, {
            errorMessage: "Failed to fetch providers.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching providers.",
        logLabel: "Get all providers error",
    });
};

export const handleGetProviderById = async (id: string) => {
    return withActionGuard(async () => {
        const response = await getProviderByIdServer(id);

        return mapApiResult(response, {
            errorMessage: "Failed to fetch provider.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching provider.",
        logLabel: "Get provider by id error",
    });
};

export const handleUpdateProvider = async (id: string, data: FormData) => {
    return withActionGuard(async () => {
        const response = await updateProviderServer(id, data);
        if (response.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to update provider.",
            successMessage: "Provider updated successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while updating the provider.",
        logLabel: "Update provider error",
    });
};

export const handleDeleteProvider = async (id: string) => {
    return withActionGuard(async () => {
        const response = await deleteProviderServer(id);

        if (response?.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to delete provider.",
            successMessage: "Provider deleted successfully.",
        });
    }, {
        fallbackMessage: "An error occurred while deleting the provider.",
        logLabel: "Delete provider error",
    });
};

export const handleGetProvidersByStatus = async (status: string) => {
    return withActionGuard(async () => {
        const response = await getProvidersByStatusServer(status);

        return mapApiResult(response, {
            errorMessage: "Failed to fetch providers.",
        });
    }, {
        fallbackMessage: "An error occurred while fetching providers.",
    });
};

export const handleApproveProvider = async (id: string) => {
    return withActionGuard(async () => {
        const response = await approveProviderServer(id);

        if (response?.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to approve provider.",
            successMessage: response.message || "Provider approved.",
        });
    }, {
        fallbackMessage: "An error occurred while approving provider.",
    });
};

export const handleRejectProvider = async (id: string) => {
    return withActionGuard(async () => {
        const response = await rejectProviderServer(id);

        if (response?.success) {
            revalidatePath("/admin/providers");
        }

        return mapApiResult(response, {
            errorMessage: "Failed to reject provider.",
            successMessage: response.message || "Provider rejected.",
        });
    }, {
        fallbackMessage: "An error occurred while rejecting provider.",
    });
};

