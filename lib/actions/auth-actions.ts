// server side processing of both actions
"use server";

import { register, login, logout, createUserByAdmin, requestPasswordReset, resetPassword } from "../api/user/auth";
import { setAuthToken, setUserData, getAuthToken, clearAuthCookies } from "../cookie";
import axios from "../api/axios";
import { API } from "../api/endpoints";
import { providerLogin as providerLoginApi, providerRegister as providerRegisterApi } from "../api/provider/provider";

const IMAGE_KEYS = [
    "imageUrl",
    "avatarUrl",
    "image",
    "avatar",
    "profileImage",
    "profileImageUrl",
] as const;

const normalizeImagePayload = (payload: any) => {
    if (!payload || typeof payload !== "object") return payload;

    const imageValue = IMAGE_KEYS
        .map((key) => payload[key])
        .find((value) => typeof value === "string" && value.trim().length > 0)
        ?.trim();

    if (!imageValue) return payload;

    return {
        ...payload,
        imageUrl: payload.imageUrl || imageValue,
        avatarUrl: payload.avatarUrl || imageValue,
    };
};


// Server-side whoAmI that uses Next.js cookies
export const whoAmI = async () => {
    try {
        const token = await getAuthToken();
        
        console.log('[whoAmI] Token from cookies:', token ? `${token.substring(0, 20)}...` : 'NULL');
        
        if (!token) {
            console.log('[whoAmI] No token found in cookies');
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
        console.error('[whoAmI] Error:', err.message);
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
            const normalizedData = normalizeImagePayload(result.data);
            const token = result.data?.accessToken || result.data?.token;
            if (token) {
                await setAuthToken(token);
            }
            if (normalizedData) {
                await setUserData(normalizedData);
            }
            return {
                success: true,
                message: "Registration successful",
                data: normalizedData
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
            const normalizedUser = normalizeImagePayload(result.data?.user);
            const token = result.data?.accessToken || result.data?.token;
            if (!token) {
                return {
                    success: false,
                    message: "Login failed: missing access token"
                };
            }

            await setAuthToken(token);
            await setUserData(normalizedUser);
            return {
                success: true,
                message: "Login successful",
                data: normalizedUser,
                token
                };
        }
        // If user login fails, try provider login
        try {
            const providerResult = await providerLoginApi(loginData);
            if (providerResult.success) {
                const providerData = normalizeImagePayload({
                    ...providerResult.data.provider,
                    role: "provider",
                });
                const token = providerResult.data?.accessToken || providerResult.data?.token;
                if (token) {
                    await setAuthToken(token);
                }
                await setUserData(providerData);
                return {
                    success: true,
                    message: "Login successful",
                    data: providerData,
                    token: token
                };
            }
        } catch (providerErr: any) {
            // Provider login also failed — return original user error
        }
        return {
            success: false,
            message: result.message  ||"Login failed"
        };
    }catch(err: Error | any){
        // User login threw an error — try provider login as fallback
        try {
            const providerResult = await providerLoginApi(loginData);
            if (providerResult.success) {
                const providerData = normalizeImagePayload({
                    ...providerResult.data.provider,
                    role: "provider",
                });
                const token = providerResult.data?.accessToken || providerResult.data?.token;
                if (token) {
                    await setAuthToken(token);
                }
                await setUserData(providerData);
                return {
                    success: true,
                    message: "Login successful",
                    data: providerData,
                    token: token
                };
            }
        } catch (providerErr: any) {
            // Both failed
        }
        return {
            success: false,
            message: err.message  ||"Login failed"
        };
    }
}

export const handleProviderLogin = async (loginData: any) => {
    try {
        const providerResult = await providerLoginApi(loginData);
        if (providerResult.success) {
            const providerData = normalizeImagePayload({
                ...providerResult.data.provider,
                role: "provider",
            });
            const token = providerResult.data?.accessToken || providerResult.data?.token;
            if (!token) {
                return {
                    success: false,
                    message: "Provider login failed: missing access token"
                };
            }

            await setAuthToken(token);
            await setUserData(providerData);
            return {
                success: true,
                message: "Login successful",
                data: providerData,
                token
            };
        }
        return {
            success: false,
            message: providerResult.message || "Provider login failed"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Provider login failed"
        };
    }
}

export const handleProviderRegister = async (providerData: any) => {
    try {
        const result = await providerRegisterApi(providerData);
        if (result.success) {
            const userData = normalizeImagePayload({
                ...result.data.provider,
                role: "provider",
            });
            const token = result.data?.accessToken || result.data?.token;
            if (token) {
                await setAuthToken(token);
            }
            await setUserData(userData);
            return {
                success: true,
                message: "Registration successful",
                data: userData
            };
        }
        return {
            success: false,
            message: result.message || "Provider registration failed"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Provider registration failed"
        };
    }
}

export const handlewhoAmI = async () => {
    try{
        const result = await whoAmI();
        if(result.success){
            const normalizedUser = normalizeImagePayload(result.data);
            return {
                success: true,
                message: "User data fetched successfully",
                data: normalizedUser
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
            const normalizedUser = normalizeImagePayload(response.data.data);
            // update cookie data
            await setUserData(normalizedUser);
            return {
                success: true,
                message: "Profile updated successfully",
                data: normalizedUser
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
        return {
            success: false,
            message: err.message || "Failed to send password reset email"
        };
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const result = await resetPassword(token, newPassword);
        return result;
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to reset password"
        };
    }
};

export const handleLogout = async () => {
    try{
        const result = await logout();
        if(result.success){
            await clearAuthCookies();
            return {
                success: true,
                message: "Logout successful"
            };
        }
        return {
            success: false,
            message: result.message || "Logout failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message || "Logout failed"
        };
    }
}

