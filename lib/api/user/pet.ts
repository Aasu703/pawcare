import { API } from '@/lib/api/endpoints';
import axios from '@/lib/api/axios';

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

