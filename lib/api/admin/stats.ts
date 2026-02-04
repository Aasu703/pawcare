import { API } from "../endpoints";
import axios from "../axios";

export const getDashboardStats = async () => {
    try {
        const response = await axios.get(API.ADMIN.STATS.DASHBOARD);
        return response.data.data; // Return the actual stats data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch dashboard stats');
    }
}
