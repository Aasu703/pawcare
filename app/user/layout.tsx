"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated, loggingOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🏠 User Layout - Loading:', loading, 'Auth:', isAuthenticated, 'User:', user, 'Role:', user?.role, 'LoggingOut:', loggingOut);
    
    if (!loading && !loggingOut) {
      if (!isAuthenticated) {
        console.log('🚫 User Layout - Not authenticated, redirecting to login');
        router.push("/login");
      } else if (user?.role === "admin") {
        console.log('🚫 User Layout - Admin detected, redirecting to admin');
        router.push("/admin");
      } else {
        console.log('✅ User Layout - User authenticated, rendering content');
      }
    }
  }, [loading, isAuthenticated, user, router, loggingOut]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "user") {
    return null;
  }

  return <section>{children}</section>;
}