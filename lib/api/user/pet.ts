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

export interface VerifiedVetOption {
  _id: string;
  name: string;
  clinicOrShopName?: string;
  pawcareVerified?: boolean;
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

export async function getVerifiedVets(): Promise<{ success: boolean; message: string; data?: VerifiedVetOption[] }> {
  try {
    const response = await axios.get(API.PROVIDER.GET_ALL, {
      params: {
        providerType: "vet",
        pawcareVerified: true,
        status: "approved",
      },
    });

    const raw = response.data?.data;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.providers)
        ? raw.providers
        : Array.isArray(raw?.items)
          ? raw.items
          : [];

    const data = list
      .map((item: any) => item?._doc || item)
      .filter((item: any) => item?._id && item?.providerType === "vet")
      .filter((item: any) => item?.pawcareVerified !== false)
      .filter((item: any) => !item?.status || item.status === "approved")
      .map((item: any) => ({
        _id: String(item._id),
        name: String(item.businessName || item.name || item.email || "Verified Vet"),
        clinicOrShopName: item.clinicOrShopName ? String(item.clinicOrShopName) : "",
        pawcareVerified: Boolean(item.pawcareVerified),
      }));

    return { success: true, message: "Verified vets fetched successfully", data };
  } catch (err: any) {
    console.error("Error retrieving verified vets:", err);
    return { success: false, message: err.response?.data?.message || err.message || "Failed to retrieve verified vets" };
  }
}

export async function assignVetToUserPet(
  petId: string,
  vetId: string | null,
): Promise<{ success: boolean; message: string; data?: any }> {
  const fallback = new FormData();
  fallback.append("assignedVetId", vetId || "");

  try {
    // Prefer the generic pet update route because current backend supports it.
    const updateResponse = await updateUserPet(petId, fallback);
    if (updateResponse.success) {
      return {
        success: true,
        message: updateResponse.message || "Vet assigned successfully",
        data: updateResponse.data,
      };
    }

    // If generic update fails, try a dedicated assignment route (for newer backends).
    const response = await axios.put(API.USER.PET.ASSIGN_VET(petId), { vetId });
    return {
      success: true,
      message: response.data.message || "Vet assigned successfully",
      data: response.data.data,
    };
  } catch (err: any) {
    console.error("Error assigning vet to pet:", err);
    return { success: false, message: err.response?.data?.message || err.message || "Failed to assign vet" };
  }
}

