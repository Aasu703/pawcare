// API layer
// Call api from backend

import axios from "./axios";
import { API } from "./endpoints";

export const register = async ( registerData : any ) => {
    try{
        const response = await axios.post(
            API.AUTH.REGISTER, //path
            registerData //body data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            // 400-500 err code counts as exception
            err.response?.data?.message // log error message from backend
            ||err.message // default error message
            ||"Registration failed" //fallback message if default fails
        );
    }
}

export const login = async ( loginData : any ) => {
    try{
        const response = await axios.post(
            API.AUTH.LOGIN, // change
            loginData // change
        );
        return response.data;

    }catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            ||"Login failed"
        )
    }
}

export const logout = async () => {
    try{
        const response = await axios.post(API.AUTH.LOGOUT);
        return response.data;
    }catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            ||"Logout failed"
        )
    }
}

export const updateProfile = async ( userId: any, updateData : any ) => {
    try{
        const response = await axios.put(
            `${API.AUTH.UPDATEPROFILE}`,
            updateData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // this part is important for file upload
                },
            }
        );
        return response.data;
    }catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            ||"Updating profile failed"
        )
    }
}   

export const createUserByAdmin = async (data: any) => {
    try {
        const response = await axios.post(
            API.AUTH.CREATEUSER,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Creating user failed"
        );
    }
}

export const requestPasswordReset = async (data: any) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, data);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Password reset request failed"
        );
    }
}

export const resetPassword = async (token: any, newPassword: any) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Password reset failed"
        );
    }
}

