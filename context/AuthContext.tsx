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
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
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
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    setLoading(true);

    try {
      const token = getCookie('auth_token');

      // 🔒 No token = logged out
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // ✅ Token exists → fetch user from cookie
      const userDataStr = getCookie('user_data');
      const userData = userDataStr ? JSON.parse(userDataStr) : null;

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // ❌ Anything fails → clean logout state
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
    try {
      deleteCookie('auth_token');
      deleteCookie('user_data');
    } finally {
      // Always reset state
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/"); // safer than push
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
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
