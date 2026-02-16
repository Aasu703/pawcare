import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/forget-password", "/reset-password"];
const adminPaths = ["/admin"];
const userPaths = ["/user"];
const providerPaths = ["/provider"];
const providerAuthPaths = ["/provider/login", "/provider/register"];
const providerSetupPaths = ["/provider/select-type", "/provider/verification-pending"];

type ProxyUser = {
    role?: string;
    providerType?: string | null;
    status?: "pending" | "approved" | "rejected" | string;
};

function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get token directly from request cookies (Edge-safe)
    const token = req.cookies.get('auth_token')?.value;
    const userDataCookie = req.cookies.get('user_data')?.value;

    // Parse user data if exists
    let user: ProxyUser | null = null;
    if (userDataCookie) {
        try {
            user = JSON.parse(userDataCookie);
        } catch {
            user = null;
        }
    }

    // Validate token exists and is not the string "undefined"
    const hasValidToken = token && token !== 'undefined' && token.length > 20;

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
    const isUserPath = userPaths.some((path) => pathname.startsWith(path));
    const isProviderPath = providerPaths.some((path) => pathname.startsWith(path));
    const isProviderAuthPath = providerAuthPaths.some((path) => pathname === path);

    // Allow provider auth pages without token
    if (isProviderAuthPath) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users from protected routes
    if (!hasValidToken && (isAdminPath || isUserPath)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Provider protected routes — check for provider_token cookie
    const providerToken = req.cookies.get('auth_token')?.value;
    if (!providerToken && isProviderPath && !isProviderAuthPath) {
        return NextResponse.redirect(new URL("/provider/login", req.url));
    }

    // Redirect authenticated users away from public auth pages
    if (hasValidToken && user && isPublicPath) {
        const redirectUrl = user.role === 'admin' ? "/admin" : user.role === 'provider' ? "/provider/dashboard" : "/user/home";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Block non-admin users from admin routes
    if (hasValidToken && isAdminPath && user?.role !== 'admin') {
        const redirectUrl = user?.role === 'provider' ? '/provider/dashboard' : '/user/home';
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Block admin users from user routes
    if (hasValidToken && isUserPath && user?.role === 'admin') {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Block non-provider users from provider routes
    if (hasValidToken && isProviderPath && !isProviderAuthPath && user?.role !== 'provider') {
        const redirectUrl = user?.role === 'admin' ? '/admin' : '/user/home';
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Redirect authenticated providers away from provider auth pages  
    if (hasValidToken && user?.role === 'provider' && isProviderAuthPath) {
        const hasProviderType = Boolean(user?.providerType);
        const isApproved = user?.status === "approved";
        const redirectTo = !hasProviderType
            ? "/provider/select-type"
            : isApproved
                ? "/provider/dashboard"
                : "/provider/verification-pending";
        return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    // Provider onboarding + approval gate
    if (hasValidToken && user?.role === 'provider' && isProviderPath && !isProviderAuthPath) {
        const hasProviderType = Boolean(user?.providerType);
        const isApproved = user?.status === "approved";
        const isSetupPath = providerSetupPaths.some((path) => pathname.startsWith(path));

        if (!hasProviderType && pathname !== "/provider/select-type") {
            return NextResponse.redirect(new URL('/provider/select-type', req.url));
        }

        if (hasProviderType && !isApproved && !isSetupPath) {
            return NextResponse.redirect(new URL('/provider/verification-pending', req.url));
        }

        if (hasProviderType && isApproved && isSetupPath) {
            return NextResponse.redirect(new URL('/provider/dashboard', req.url));
        }
    }

    // Allow request to continue
    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/provider/:path*",
        "/login",
        "/register",
        "/forget-password",
        "/reset-password",
    ],
};
