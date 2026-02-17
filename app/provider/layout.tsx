"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProviderSidebar from "./_components/ProviderSidebar";
import { getMyProviderProfile } from "@/lib/api/provider/provider";

const authPages = ["/provider/login", "/provider/register", "/provider/select-type", "/provider/verification-pending"];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, loading, loggingOut, checkAuth } = useAuth();
  const [profileSynced, setProfileSynced] = useState(false);
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
      if (!profileSynced) {
        (async () => {
          const profile = await getMyProviderProfile();
          if (profile.success && profile.data) {
            const latestUser = { ...(user ?? {}), ...(profile.data ?? {}), role: "provider" };
            document.cookie = `user_data=${encodeURIComponent(JSON.stringify(latestUser))}; path=/;`;
            await checkAuth(latestUser);
          }
          setProfileSynced(true);
        })();
        return;
      }

      if (!user.providerType) {
        if (pathname !== "/provider/select-type") {
          router.replace("/provider/select-type");
        }
        return;
      }

      if (user.status !== "approved") {
        if (pathname !== "/provider/verification-pending") {
          router.replace("/provider/verification-pending");
        }
        return;
      }

      if (isAuthPage) {
        if (user.providerType && user.status === "approved") {
          router.replace("/provider/dashboard");
        } else {
          router.replace(user.providerType ? "/provider/verification-pending" : "/provider/select-type");
        }
      }
      return;
    }

    const redirectPath = user?.role === "admin" ? "/admin" : "/user/home";
    router.replace(redirectPath);
  }, [checkAuth, isAuthenticated, isAuthPage, loading, loggingOut, pathname, profileSynced, router, user]);

  if (loading || (isAuthenticated && user?.role === "provider" && !profileSynced)) {
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
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
