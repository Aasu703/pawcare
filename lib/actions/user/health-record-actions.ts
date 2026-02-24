"use server";

import { createHealthRecord, getHealthRecordsByPet, getHealthRecordById, updateHealthRecord, deleteHealthRecord, createAttachment, getAttachmentsByHealthRecord, deleteAttachment } from "@/lib/api/user/health-record";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export async function handleCreateHealthRecord(data: any) {
  return withActionGuard(async () => {
    const response = await createHealthRecord(data);
    if (response?.success) {
      revalidatePath(`/user/pet/${data.petId}/health`);
    }

    return mapApiResult(response, {
      errorMessage: "Failed to create health record",
      successMessage: "Health record created!",
    });
  }, {
    fallbackMessage: "Failed to create health record",
    logLabel: "Create health record error",
  });
}

export async function handleGetHealthRecordsByPet(petId: string) {
  return withActionGuard(async () => {
    const response = await getHealthRecordsByPet(petId);
    return mapApiResult(response, {
      errorMessage: "Failed to fetch health records",
    });
  }, {
    fallbackMessage: "Failed to fetch health records",
    logLabel: "Get health records by pet error",
  });
}

export async function handleGetHealthRecordById(id: string) {
  return withActionGuard(async () => {
    const response = await getHealthRecordById(id);
    return mapApiResult(response, {
      errorMessage: "Failed to fetch health record",
    });
  }, {
    fallbackMessage: "Failed to fetch health record",
    logLabel: "Get health record by id error",
  });
}

export async function handleUpdateHealthRecord(id: string, data: any) {
  return withActionGuard(async () => {
    const response = await updateHealthRecord(id, data);

    return mapApiResult(response, {
      errorMessage: "Failed to update health record",
      successMessage: response?.success ? "Health record updated!" : undefined,
    });
  }, {
    fallbackMessage: "Failed to update health record",
    logLabel: "Update health record error",
  });
}

export async function handleDeleteHealthRecord(id: string) {
  return withActionGuard(async () => {
    const response = await deleteHealthRecord(id);

    return mapApiResult(response, {
      errorMessage: "Failed to delete health record",
      successMessage: response?.success ? "Health record deleted" : undefined,
    });
  }, {
    fallbackMessage: "Failed to delete health record",
    logLabel: "Delete health record error",
  });
}

export async function handleCreateAttachment(data: any) {
  return withActionGuard(async () => {
    const response = await createAttachment(data);

    return mapApiResult(response, {
      errorMessage: "Failed to create attachment",
      successMessage: response?.success ? "Attachment added!" : undefined,
    });
  }, {
    fallbackMessage: "Failed to create attachment",
    logLabel: "Create attachment error",
  });
}

export async function handleGetAttachmentsByHealthRecord(healthRecordId: string) {
  return withActionGuard(async () => {
    const response = await getAttachmentsByHealthRecord(healthRecordId);
    return mapApiResult(response, {
      errorMessage: "Failed to fetch attachments",
    });
  }, {
    fallbackMessage: "Failed to fetch attachments",
    logLabel: "Get attachments by health record error",
  });
}

export async function handleDeleteAttachment(id: string) {
  return withActionGuard(async () => {
    const response = await deleteAttachment(id);

    return mapApiResult(response, {
      errorMessage: "Failed to delete attachment",
      successMessage: response?.success ? "Attachment deleted" : undefined,
    });
  }, {
    fallbackMessage: "Failed to delete attachment",
    logLabel: "Delete attachment error",
  });
}

