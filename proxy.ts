import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/forget-password", "/reset-password"];
const adminPaths = ["/admin"];
const userPaths = ["/user"];

function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get token directly from request cookies (Edge-safe)
    const token = req.cookies.get('auth_token')?.value;
    const userDataCookie = req.cookies.get('user_data')?.value;

    // Parse user data if exists
    let user: { role?: string } | null = null;
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

    // Redirect unauthenticated users from protected routes
    if (!hasValidToken && (isAdminPath || isUserPath)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect authenticated users away from public auth pages
    if (hasValidToken && user && isPublicPath) {
        const redirectUrl = user.role === 'admin' ? "/admin" : "/user/home";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Block non-admin users from admin routes
    if (hasValidToken && isAdminPath && user?.role !== 'admin') {
        return NextResponse.redirect(new URL("/user/home", req.url));
    }

    // Block admin users from user routes
    if (hasValidToken && isUserPath && user?.role === 'admin') {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Allow request to continue
    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register",
        "/forget-password",
        "/reset-password",
    ],
};