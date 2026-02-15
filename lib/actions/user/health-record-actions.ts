"use server";

import { createHealthRecord, getHealthRecordsByPet, getHealthRecordById, updateHealthRecord, deleteHealthRecord, createAttachment, getAttachmentsByHealthRecord, deleteAttachment } from "@/lib/api/user/health-record";
import { revalidatePath } from "next/cache";

export async function handleCreateHealthRecord(data: any) {
  try {
    const response = await createHealthRecord(data);
    if (response.success) {
      revalidatePath(`/user/pet/${data.petId}/health`);
      return { success: true, message: "Health record created!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetHealthRecordsByPet(petId: string) {
  try {
    const response = await getHealthRecordsByPet(petId);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetHealthRecordById(id: string) {
  try {
    const response = await getHealthRecordById(id);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleUpdateHealthRecord(id: string, data: any) {
  try {
    const response = await updateHealthRecord(id, data);
    if (response.success) {
      return { success: true, message: "Health record updated!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleDeleteHealthRecord(id: string) {
  try {
    const response = await deleteHealthRecord(id);
    if (response.success) return { success: true, message: "Health record deleted" };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleCreateAttachment(data: any) {
  try {
    const response = await createAttachment(data);
    if (response.success) return { success: true, message: "Attachment added!", data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetAttachmentsByHealthRecord(healthRecordId: string) {
  try {
    const response = await getAttachmentsByHealthRecord(healthRecordId);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleDeleteAttachment(id: string) {
  try {
    const response = await deleteAttachment(id);
    if (response.success) return { success: true, message: "Attachment deleted" };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

