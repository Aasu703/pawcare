"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProviderSidebar from "./_components/ProviderSidebar";

const authPages = ["/provider/login", "/provider/register"];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, loading, loggingOut } = useAuth();
  const isAuthPage = authPages.includes(pathname);

  useEffect(() => {
    if (loading || loggingOut) return;

    if (!isAuthenticated) {
      if (!isAuthPage) {
        router.replace("/provider/login");
      }
      return;
    }

    if (user?.role === "provider") {
      if (isAuthPage) {
        router.replace("/provider/dashboard");
      }
      return;
    }

    const redirectPath = user?.role === "admin" ? "/admin" : "/user/home";
    router.replace(redirectPath);
  }, [isAuthenticated, isAuthPage, loading, loggingOut, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isAuthPage) {
      return <>{children}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Redirecting to provider login...
      </div>
    );
  }

  if (user?.role !== "provider") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Redirecting...
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}