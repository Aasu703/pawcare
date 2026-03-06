// server side processing of both actions
"use server";

import {
  register,
  login,
  logout,
  createUserByAdmin,
  requestPasswordReset,
  resetPassword,
} from "../api/user/auth";
import {
  providerLogin as providerLoginApi,
  providerRegister as providerRegisterApi,
} from "../api/provider/provider";
import { setAuthToken, setUserData, getAuthToken, clearAuthCookies } from "../cookie";
import axios from "../api/axios";
import { API } from "../api/endpoints";
import { getErrorMessage } from "./_shared";

type AuthResult<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
};

const IMAGE_KEYS = [
  "imageUrl",
  "avatarUrl",
  "image",
  "avatar",
  "profileImage",
  "profileImageUrl",
] as const;

const extractApiMessage = (error: unknown): string | null => {
  const message = (error as any)?.response?.data?.message;
  return typeof message === "string" && message.trim().length > 0 ? message : null;
};

const resolveErrorMessage = (error: unknown, fallback: string): string => {
  return extractApiMessage(error) || getErrorMessage(error, fallback);
};

const normalizeImagePayload = (payload: any) => {
  if (!payload || typeof payload !== "object") return payload;

  const imageValue = IMAGE_KEYS.map((key) => payload[key]).find(
    (value) => typeof value === "string" && value.trim().length > 0,
  )?.trim();

  if (!imageValue) return payload;

  return {
    ...payload,
    imageUrl: payload.imageUrl || imageValue,
    avatarUrl: payload.avatarUrl || imageValue,
  };
};

const getTokenFromPayload = (payload: any): string | null => {
  const token = payload?.accessToken || payload?.token;
  return typeof token === "string" && token.trim().length > 0 ? token : null;
};

const persistSession = async (params: { token?: string | null; user?: any }) => {
  if (params.token) {
    await setAuthToken(params.token);
  }

  if (params.user) {
    await setUserData(params.user);
  }
};

// User login falls back to provider login so the same form can authenticate both roles.
const tryProviderLoginFallback = async (loginData: any): Promise<AuthResult | null> => {
  try {
    const providerResult = await providerLoginApi(loginData);
    if (!providerResult.success) return null;

    const providerData = normalizeImagePayload({
      ...providerResult.data?.provider,
      role: "provider",
    });
    const token = getTokenFromPayload(providerResult.data);

    await persistSession({ token, user: providerData });

    return {
      success: true,
      message: "Login successful",
      data: providerData,
      token: token || undefined,
    };
  } catch {
    return null;
  }
};

// Server-side whoAmI that uses Next.js cookies.
export const whoAmI = async (): Promise<AuthResult> => {
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      message: "No auth token found",
    };
  }

  try {
    const response = await axios.get(API.AUTH.WHOAMI, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Fetching user data failed"));
  }
};

export const handleRegister = async (userData: any): Promise<AuthResult> => {
  try {
    const result = await register(userData);
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    const normalizedData = normalizeImagePayload(result.data);
    const token = getTokenFromPayload(result.data);
    await persistSession({ token, user: normalizedData });

    return {
      success: true,
      message: "Registration successful",
      data: normalizedData,
    };
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "Registration failed"),
    };
  }
};

export const handleLogin = async (loginData: any): Promise<AuthResult> => {
  try {
    const userResult = await login(loginData);
    if (userResult.success) {
      const token = getTokenFromPayload(userResult.data);
      if (!token) {
        return {
          success: false,
          message: "Login failed: missing access token",
        };
      }

      const normalizedUser = normalizeImagePayload(userResult.data?.user);
      await persistSession({ token, user: normalizedUser });

      return {
        success: true,
        message: "Login successful",
        data: normalizedUser,
        token,
      };
    }

    const providerFallback = await tryProviderLoginFallback(loginData);
    if (providerFallback) return providerFallback;

    return {
      success: false,
      message: userResult.message || "Login failed",
    };
  } catch (error) {
    const providerFallback = await tryProviderLoginFallback(loginData);
    if (providerFallback) return providerFallback;

    return {
      success: false,
      message: resolveErrorMessage(error, "Login failed"),
    };
  }
};

export const handleProviderLogin = async (loginData: any): Promise<AuthResult> => {
  try {
    const providerResult = await providerLoginApi(loginData);
    if (!providerResult.success) {
      return {
        success: false,
        message: providerResult.message || "Provider login failed",
      };
    }

    const providerData = normalizeImagePayload({
      ...providerResult.data?.provider,
      role: "provider",
    });
    const token = getTokenFromPayload(providerResult.data);
    if (!token) {
      return {
        success: false,
        message: "Provider login failed: missing access token",
      };
    }

    await persistSession({ token, user: providerData });

    return {
      success: true,
      message: "Login successful",
      data: providerData,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "Provider login failed"),
    };
  }
};

export const handleProviderRegister = async (providerData: any): Promise<AuthResult> => {
  try {
    const result = await providerRegisterApi(providerData);
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Provider registration failed",
      };
    }

    const userData = normalizeImagePayload({
      ...result.data?.provider,
      role: "provider",
    });
    const token = getTokenFromPayload(result.data);
    await persistSession({ token, user: userData });

    return {
      success: true,
      message: "Registration successful",
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "Provider registration failed"),
    };
  }
};

export const handlewhoAmI = async (): Promise<AuthResult> => {
  try {
    const result = await whoAmI();
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Fetching user data failed",
      };
    }

    const normalizedUser = normalizeImagePayload(result.data);
    return {
      success: true,
      message: "User data fetched successfully",
      data: normalizedUser,
    };
  } catch (error) {
    console.error("whoAmI error:", error);
    return {
      success: false,
      message: resolveErrorMessage(error, "Fetching user data failed"),
    };
  }
};

export const handleUpdateProfile = async (
  _userId: string,
  formData: any,
): Promise<AuthResult> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "No auth token found",
      };
    }

    const response = await axios.put(API.AUTH.UPDATEPROFILE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data?.success) {
      return {
        success: false,
        message: response.data?.message || "Profile update failed",
      };
    }

    const normalizedUser = normalizeImagePayload(response.data.data);
    await setUserData(normalizedUser);

    return {
      success: true,
      message: "Profile updated successfully",
      data: normalizedUser,
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: resolveErrorMessage(error, "Profile update failed"),
    };
  }
};

export const handleAdminCreateUser = async (formData: FormData): Promise<AuthResult> => {
  try {
    const result = await createUserByAdmin(formData);
    if (result.success) {
      return {
        success: true,
        message: result.message || "User created successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "User creation failed",
    };
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "User creation failed"),
    };
  }
};

export const handleForgotPassword = async (email: string): Promise<AuthResult> => {
  try {
    return await requestPasswordReset(email);
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "Failed to send password reset email"),
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string,
): Promise<AuthResult> => {
  try {
    return await resetPassword(token, newPassword);
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "Failed to reset password"),
    };
  }
};

export const handleLogout = async (): Promise<AuthResult> => {
  try {
    const result = await logout();
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Logout failed",
      };
    }

    await clearAuthCookies();
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    return {
      success: false,
      message: resolveErrorMessage(error, "Logout failed"),
    };
  }
};
