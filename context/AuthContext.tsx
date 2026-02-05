"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

// Client-safe cookie helpers (no server actions)
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift() || null;
    // Decode the cookie value (handles URL encoding)
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
  const router = useRouter();

  const checkAuth = async (directUserData?: any) => {
    setLoading(true);

    try {
      // If user data is passed directly (e.g., after login), use it
      if (directUserData) {
        console.log('✅ Using direct user data:', directUserData);
        console.log('👤 User role:', directUserData?.role);
        setUser(directUserData);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      const token = getCookie('auth_token');
      console.log('🔍 CheckAuth - Token:', token ? 'EXISTS' : 'MISSING');

      // 🔒 No token = logged out
      if (!token) {
        console.log('❌ No token found');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // ✅ Token exists → fetch user from cookie
      const userDataStr = getCookie('user_data');
      console.log('📦 Raw user_data cookie:', userDataStr);
      let userData = null;
      
      if (userDataStr) {
        try {
          userData = JSON.parse(userDataStr);
        } catch (e) {
          console.error('❌ Failed to parse user_data cookie:', e);
          console.error('📦 Cookie value was:', userDataStr);
          // Cookie is malformed, clear it
          deleteCookie('user_data');
          deleteCookie('auth_token');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
      }
      
      console.log('✅ User data from cookie:', userData);
      console.log('👤 User role:', userData?.role);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // ❌ Anything fails → clean logout state
      console.error('❌ CheckAuth error:', error);
      setUser(null);
      setIsAuthenticated(false);
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
      deleteCookie('auth_token');
      deleteCookie('user_data');
      // Redirect first
      router.replace("/");
    } finally {
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      // Keep loggingOut true for a bit to prevent redirects
      setTimeout(() => setLoggingOut(false), 1000);
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
