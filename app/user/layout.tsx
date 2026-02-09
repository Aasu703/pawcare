"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserSidebar from "./_components/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated, loggingOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !loggingOut) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role === "admin") {
        router.push("/admin");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}