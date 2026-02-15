import { API } from "../endpoints";
import axios from "../axios";

export const createUser = async (data: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.USER.CREATE,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // for file upload/multer
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create user failed');
    }
}

export const getAllUsers = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.USER.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch users');
    }
}

export const getUserById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.USER.GET_BY_ID(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch user');
    }
}

export const updateUser = async (id: any, userData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.USER.UPDATE(id),
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to update user');
    }
}

export const deleteUser = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.USER.DELETE(data));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to delete user');
    }
}

