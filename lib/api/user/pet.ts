import { API } from '@/lib/api/endpoints';
import axios from '@/lib/api/axios';

export type PetVaccinationStatus = "pending" | "done" | "not_required";

export interface PetVaccinationItem {
  vaccine: string;
  recommendedByMonths?: number;
  dosesTaken: number;
  status: PetVaccinationStatus;
}

export interface PetCareData {
  feedingTimes: string[];
  vaccinations: PetVaccinationItem[];
  notes?: string;
  updatedAt?: string | null;
}

function normalizePetCare(data: any): PetCareData {
  return {
    feedingTimes: Array.isArray(data?.feedingTimes) ? data.feedingTimes : [],
    vaccinations: Array.isArray(data?.vaccinations) ? data.vaccinations : [],
    notes: typeof data?.notes === "string" ? data.notes : "",
    updatedAt: data?.updatedAt || null,
  };
}

export async function createUserPet(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.USER.PET.CREATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return { success: true, message: response.data.message || 'Pet created successfully', data: response.data.data };
  } catch (err: any) {
    console.error('Error creating pet:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to create pet' };
  }
}

export async function getUserPets(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.USER.PET.GET_ALL);

    return { success: true, message: response.data.message || 'Pets retrieved successfully', data: response.data.data };
  } catch (err: any) {
    console.error('Error retrieving pets:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to retrieve pets' };
  }
}

export async function getUserPetById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.USER.PET.GET_BY_ID(data));

    return { success: true, message: response.data.message || 'Pet retrieved successfully', data: response.data.data };
  } catch (err: any) {
    console.error('Error retrieving pet:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to retrieve pet' };
  }
}

export async function updateUserPet(petId: any, petData: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.USER.PET.UPDATE(petId), petData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return { success: true, message: response.data.message || 'Pet updated successfully', data: response.data.data };
  } catch (err: any) {
    console.error('Error updating pet:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to update pet' };
  }
}

export async function deleteUserPet(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.USER.PET.DELETE(data));

    return { success: true, message: response.data.message || 'Pet deleted successfully' };
  } catch (err: any) {
    console.error('Error deleting pet:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to delete pet' };
  }
}

export async function getUserPetCare(petId: string): Promise<{ success: boolean; message: string; data?: PetCareData }> {
  try {
    const response = await axios.get(API.USER.PET.CARE.GET(petId));
    return {
      success: true,
      message: response.data.message || 'Pet care retrieved successfully',
      data: normalizePetCare(response.data.data),
    };
  } catch (err: any) {
    console.error('Error retrieving pet care:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to retrieve pet care' };
  }
}

export async function updateUserPetCare(
  petId: string,
  careData: Omit<PetCareData, "updatedAt">,
): Promise<{ success: boolean; message: string; data?: PetCareData }> {
  try {
    const response = await axios.put(API.USER.PET.CARE.UPDATE(petId), careData);
    return {
      success: true,
      message: response.data.message || 'Pet care updated successfully',
      data: normalizePetCare(response.data.data),
    };
  } catch (err: any) {
    console.error('Error updating pet care:', err);
    return { success: false, message: err.response?.data?.message || err.message || 'Failed to update pet care' };
  }
}

