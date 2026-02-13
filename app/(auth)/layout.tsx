"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, loading, loggingOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading || loggingOut || !isAuthenticated || !user) return;

        const redirectPath =
            user.role === "admin"
                ? "/admin"
                : user.role === "provider"
                    ? "/provider/dashboard"
                    : "/user/home";

        router.replace(redirectPath);
    }, [isAuthenticated, user, loading, loggingOut, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated && user && !loggingOut) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
                Redirecting...
            </div>
        );
    }

    return <section>{children}</section>;
}