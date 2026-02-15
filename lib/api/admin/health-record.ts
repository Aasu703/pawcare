import { API } from "../endpoints";
import axios from "../axios";

export const getAllHealthRecords = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API.ADMIN.HEALTH_RECORD.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch health records');
    }
};

export const getHealthRecordById = async (data: any) => {
    try {
        const response = await axios.get(API.ADMIN.HEALTH_RECORD.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch health record');
    }
};

export const deleteHealthRecord = async (data: any) => {
    try {
        const response = await axios.delete(API.ADMIN.HEALTH_RECORD.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete health record');
    }
};


