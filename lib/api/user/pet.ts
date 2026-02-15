import { API } from '@/lib/api/endpoints';
import axios from '@/lib/api/axios';

export async function createUserPet(data: any): Promise<{ success: boolean; message: string; data?: Pet }> {
  try {
    const response = await axios.post(API.USER.PET.CREATE, petData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return { success: boolean, message: response.data.message || 'Pet created successfully', data: response.data.data };
  } catch (data: any) {
    console.error('Error creating pet:', error);
    return { success: boolean, message: error.response?.data?.message || error.message || 'Failed to create pet' };
  }
}

export async function getUserPets(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.USER.PET.GET_ALL);

    return { success: boolean, message: response.data.message || 'Pets retrieved successfully', data: response.data.data };
  } catch (data: any) {
    console.error('Error retrieving pets:', error);
    return { success: boolean, message: error.response?.data?.message || error.message || 'Failed to retrieve pets' };
  }
}

export async function getUserPetById(data: any): Promise<{ success: boolean; message: string; data?: Pet }> {
  try {
    const response = await axios.get(API.USER.PET.GET_BY_ID(petId));

    return { success: boolean, message: response.data.message || 'Pet retrieved successfully', data: response.data.data };
  } catch (data: any) {
    console.error('Error retrieving pet:', error);
    return { success: boolean, message: error.response?.data?.message || error.message || 'Failed to retrieve pet' };
  }
}

export async function updateUserPet(petId: any, petData: any): Promise<{ success: boolean; message: string; data?: Pet }> {
  try {
    const response = await axios.put(API.USER.PET.UPDATE(petId), petData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return { success: boolean, message: response.data.message || 'Pet updated successfully', data: response.data.data };
  } catch (data: any) {
    console.error('Error updating pet:', error);
    return { success: boolean, message: error.response?.data?.message || error.message || 'Failed to update pet' };
  }
}

export async function deleteUserPet(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.USER.PET.DELETE(petId));

    return { success: boolean, message: response.data.message || 'Pet deleted successfully' };
  } catch (data: any) {
    console.error('Error deleting pet:', error);
    return { success: boolean, message: error.response?.data?.message || error.message || 'Failed to delete pet' };
  }
}

