import { API } from "../endpoints";
import axios from "../axios";

export const createPet = async (data: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.PET.CREATE,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create pet failed');
    }
}

export const getAllPets = async () => {
    try {
        const response = await axios.get(API.ADMIN.PET.GET_ALL);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch pets');
    }
}

export const getPetById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.PET.GET_BY_ID(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch pet');
    }
}

export const updatePet = async (id: any, petData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.PET.UPDATE(id),
            petData
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to update pet');
    }
}

export const deletePet = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.PET.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to delete pet');
    }
}


