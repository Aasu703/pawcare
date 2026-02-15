import axios from "../axios";
import { API } from "../endpoints";
// Health Records
export async function createHealthRecord(data: any): Promise<{ success: boolean; message: string; data?: HealthRecord }> {
  try {
    const response = await axios.post(API.HEALTH_RECORD.CREATE, data);
    return { success: boolean, message: response.data.message || "Health record created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create health record" };
  }
}

export async function getHealthRecordsByPet(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.HEALTH_RECORD.GET_BY_PET(petId));
    return { success: boolean, message: "Health records fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch health records" };
  }
}

export async function getHealthRecordById(data: any): Promise<{ success: boolean; message: string; data?: HealthRecord }> {
  try {
    const response = await axios.get(API.HEALTH_RECORD.GET_BY_ID(id));
    return { success: boolean, message: "Health record fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch health record" };
  }
}

export async function updateHealthRecord(id: any, data: any): Promise<{ success: boolean; message: string; data?: HealthRecord }> {
  try {
    const response = await axios.put(API.HEALTH_RECORD.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Health record updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update health record" };
  }
}

export async function deleteHealthRecord(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.HEALTH_RECORD.DELETE(id));
    return { success: boolean, message: response.data.message || "Health record deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete health record" };
  }
}

// Attachments
export async function createAttachment(data: any): Promise<{ success: boolean; message: string; data?: Attachment }> {
  try {
    const response = await axios.post(API.ATTACHMENT.CREATE, data);
    return { success: boolean, message: response.data.message || "Attachment created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create attachment" };
  }
}

export async function getAttachmentsByHealthRecord(data: any): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.ATTACHMENT.GET_BY_HEALTH_RECORD(healthRecordId));
    return { success: boolean, message: "Attachments fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch attachments" };
  }
}

export async function deleteAttachment(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.ATTACHMENT.DELETE(id));
    return { success: boolean, message: response.data.message || "Attachment deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete attachment" };
  }
}


