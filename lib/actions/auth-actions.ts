// server side processing of both actions
"use server";

import { cookies } from "next/headers";
import { register, login , updateProfile, createUserByAdmin, requestPasswordReset, resetPassword } from "../api/auth";
import { setAuthToken, setUserData, getAuthToken } from "../cookie";
import axios from "../api/axios";
import { API } from "../api/endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

// Server-side whoAmI that uses Next.js cookies
export const whoAmI = async () => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.get(
            API.AUTH.WHOAMI,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Fetching user data failed"
        );
    }
};

export const handleRegister = async (userData: any) => {
    try{
        //how to get data from component
        const result=await register(userData);
        // how to send back to component
        if(result.success){
            if (result.token) {
                await setAuthToken(result.token);
            }
            if (result.data) {
                await setUserData(result.data);
            }
            return {
                success: true,
                message: "Registration successful",
                data: result.data
                };
        }
        return {
            success: false,
            message: result.message  ||"Registration failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message  ||"Registration failed"
        };
    }
}

export const handleLogin = async (loginData: any) => {
    try{
        const result=await login(loginData);
        if(result.success){
            await setAuthToken(result.token);
            await setUserData(result.data);
            return {
                success: true,
                message: "Login successful",
                data: result.data,
                token: result.token
                };
        }
        return {
            success: false,
            message: result.message  ||"Login failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message  ||"Login failed"
        };
    }
}

export const handlewhoAmI = async () => {
    try{
        const result = await whoAmI();
        if(result.success){
            return {
                success: true,
                message: "User data fetched successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Fetching user data failed"
        };
    }
    catch(err: Error | any){
        console.error('whoAmI error:', err);
        return {
            success: false,
            message: err.message || "Fetching user data failed"
        };
    }
}

export const handleUpdateProfile = async (userId: string, formData: any) => {
    try{
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: "No auth token found"
            };
        }

        const response = await axios.put(
            API.AUTH.UPDATEPROFILE,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type for FormData, let axios handle it
                }
            }
        );

        if(response.data?.success){
            // update cookie data
            await setUserData(response.data.data);
            return {
                success: true,
                message: "Profile updated successfully",
                data: response.data.data
            };
        }
        return {
            success: false,
            message: response.data?.message || "Profile update failed"
        };
    } catch (err: Error | any) {
        console.error('Profile update error:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Profile update failed"
        };
    }
}

export const handleAdminCreateUser = async (formData: FormData) => {
    try {
        const result = await createUserByAdmin(formData);
        if (result.success) {
            return {
                success: true,
                message: result.message || "User created successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "User creation failed"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "User creation failed"
        };
    }
}

export const handleForgotPassword = async (email: string) => {
    try {
        const result = await requestPasswordReset(email);
        return result;
    } catch (err: Error | any) {
        throw new Error(
            err.message || "Failed to send password reset email"
        );
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const result = await resetPassword(token, newPassword);
        return result;
    } catch (err: Error | any) {
        throw new Error(
            err.message || "Failed to reset password"
        );
    }
};
