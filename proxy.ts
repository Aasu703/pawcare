import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/forgot-password"];
const adminPaths = ["/admin"];
const userPaths = ["/user"];

function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get token directly from request cookies (Edge-safe)
    const token = req.cookies.get('auth_token')?.value;
    const userDataCookie = req.cookies.get('user_data')?.value;
    
    // Parse user data if exists
    let user = null;
    if (userDataCookie) {
        try {
            user = JSON.parse(userDataCookie);
        } catch (e) {
            // Invalid JSON in cookie, treat as no user
            user = null;
        }
    }

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
    const isUserPath = userPaths.some((path) => pathname.startsWith(path));

    // Redirect unauthenticated users from protected routes
    if (!token && (isAdminPath || isUserPath)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect authenticated users away from public auth pages
    if (token && isPublicPath) {
        // Check user role and redirect accordingly
        const isAdmin = user?.role === 'admin';
        const redirectUrl = isAdmin ? "/admin" : "/user/home";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Block non-admin users from admin routes
    if (token && isAdminPath && user?.role !== 'admin') {
        return NextResponse.redirect(new URL("/user/home", req.url));
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
    ]
}


// matcher - which path to apply proxy logic