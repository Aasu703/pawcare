import { API } from '@/lib/api/endpoints';
import { Pet, CreatePetRequest, UpdatePetRequest } from '@/lib/types/pet';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export async function createUserPet(petData: FormData): Promise<{ success: boolean; message: string; data?: Pet }> {
  try {
    const response = await fetch(`${API_BASE_URL}${API.USER.PET.CREATE}`, {
      method: 'POST',
      body: petData,
      credentials: 'include',
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Failed to create pet' };
      } catch {
        return { success: false, message: `HTTP ${response.status}: ${response.statusText}` };
      }
    }

    const data = await response.json();
    return { success: true, message: data.message || 'Pet created successfully', data: data.data };
  } catch (error) {
    console.error('Error creating pet:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

export async function getUserPets(): Promise<{ success: boolean; message: string; data?: Pet[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}${API.USER.PET.GET_ALL}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Pets retrieved successfully', data: data.data };
    } else {
      return { success: false, message: data.message || 'Failed to retrieve pets' };
    }
  } catch (error) {
    console.error('Error retrieving pets:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

export async function getUserPetById(petId: string): Promise<{ success: boolean; message: string; data?: Pet }> {
  try {
    const response = await fetch(`${API_BASE_URL}${API.USER.PET.GET_BY_ID(petId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Pet retrieved successfully', data: data.data };
    } else {
      return { success: false, message: data.message || 'Failed to retrieve pet' };
    }
  } catch (error) {
    console.error('Error retrieving pet:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

export async function updateUserPet(petId: string, petData: FormData): Promise<{ success: boolean; message: string; data?: Pet }> {
  try {
    const response = await fetch(`${API_BASE_URL}${API.USER.PET.UPDATE(petId)}`, {
      method: 'PUT',
      body: petData,
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Pet updated successfully', data: data.data };
    } else {
      return { success: false, message: data.message || 'Failed to update pet' };
    }
  } catch (error) {
    console.error('Error updating pet:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

export async function deleteUserPet(petId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${API.USER.PET.DELETE(petId)}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Pet deleted successfully' };
    } else {
      return { success: false, message: data.message || 'Failed to delete pet' };
    }
  } catch (error) {
    console.error('Error deleting pet:', error);
    return { success: false, message: 'Network error occurred' };
  }
}