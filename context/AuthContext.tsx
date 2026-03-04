"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { handleLogout } from "@/lib/actions/auth-actions";

// Client-safe cookie helpers (no server actions)
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift() || null;
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function clearClientAuthStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("auth_token");
}

function getClientToken(): string | null {
  const cookieToken = getCookie("auth_token");
  if (cookieToken && cookieToken !== "undefined") return cookieToken;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("auth_token");
    if (stored && stored !== "undefined") return stored;
  }

  return null;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  loggingOut: boolean;
  logout: () => Promise<void>;
  checkAuth: (userData?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const checkAuth = async (directUserData?: any) => {
    setLoading(true);
    try {
      // If user data is passed directly (e.g., after login), use it
      if (directUserData) {
        console.log("Using direct user data:", directUserData);
        setUser(directUserData);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Otherwise, check for auth artifacts client-side
      const token = getClientToken();
      const userDataStr = getCookie("user_data");

      // Validate token exists and is not the string "undefined"
      const hasValidToken = token && token !== "undefined" && token.length > 20;

      if (!hasValidToken || !userDataStr) {
        console.log("No valid auth cookies found");
        setUser(null);
        setIsAuthenticated(false);
        clearClientAuthStorage();
        return;
      }

      try {
        const userData = JSON.parse(userDataStr);
        console.log("User data from cookie:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse user_data cookie:", e);
        deleteCookie("user_data");
        deleteCookie("auth_token");
        clearClientAuthStorage();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("CheckAuth error:", error);
      setUser(null);
      setIsAuthenticated(false);
      clearClientAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  // Run ONCE on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    try {
      // Clear server-side cookies
      await handleLogout();
      // Clear client-side auth artifacts
      deleteCookie("auth_token");
      deleteCookie("user_data");
      clearClientAuthStorage();
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      // Hard redirect to landing page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // On error, still clear client-side and redirect
      deleteCookie("auth_token");
      deleteCookie("user_data");
      clearClientAuthStorage();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/";
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        loggingOut,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
