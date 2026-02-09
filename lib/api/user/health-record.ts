import axios from "../axios";
import { API } from "../endpoints";
import { HealthRecord, CreateHealthRecordRequest, UpdateHealthRecordRequest, Attachment, CreateAttachmentRequest, UpdateAttachmentRequest } from "@/lib/types/health-record";

// Health Records
export async function createHealthRecord(data: CreateHealthRecordRequest): Promise<{ success: boolean; message: string; data?: HealthRecord }> {
  try {
    const response = await axios.post(API.HEALTH_RECORD.CREATE, data);
    return { success: true, message: response.data.message || "Health record created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create health record" };
  }
}

export async function getHealthRecordsByPet(petId: string): Promise<{ success: boolean; message: string; data?: HealthRecord[] }> {
  try {
    const response = await axios.get(API.HEALTH_RECORD.GET_BY_PET(petId));
    return { success: true, message: "Health records fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch health records" };
  }
}

export async function getHealthRecordById(id: string): Promise<{ success: boolean; message: string; data?: HealthRecord }> {
  try {
    const response = await axios.get(API.HEALTH_RECORD.GET_BY_ID(id));
    return { success: true, message: "Health record fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch health record" };
  }
}

export async function updateHealthRecord(id: string, data: UpdateHealthRecordRequest): Promise<{ success: boolean; message: string; data?: HealthRecord }> {
  try {
    const response = await axios.put(API.HEALTH_RECORD.UPDATE(id), data);
    return { success: true, message: response.data.message || "Health record updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update health record" };
  }
}

export async function deleteHealthRecord(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.HEALTH_RECORD.DELETE(id));
    return { success: true, message: response.data.message || "Health record deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete health record" };
  }
}

// Attachments
export async function createAttachment(data: CreateAttachmentRequest): Promise<{ success: boolean; message: string; data?: Attachment }> {
  try {
    const response = await axios.post(API.ATTACHMENT.CREATE, data);
    return { success: true, message: response.data.message || "Attachment created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create attachment" };
  }
}

export async function getAttachmentsByHealthRecord(healthRecordId: string): Promise<{ success: boolean; message: string; data?: Attachment[] }> {
  try {
    const response = await axios.get(API.ATTACHMENT.GET_BY_HEALTH_RECORD(healthRecordId));
    return { success: true, message: "Attachments fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch attachments" };
  }
}

export async function deleteAttachment(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ATTACHMENT.DELETE(id));
    return { success: true, message: response.data.message || "Attachment deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete attachment" };
  }
}
