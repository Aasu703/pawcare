import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

const publicPaths = ['/login', '/register',  '/'];
const adminPrefix = '/admin';
const userPrefix = '/user';

export async function proxy(req:NextRequest){
    const { pathname } = req.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    //Protect /admin routes
    if (pathname.startsWith(adminPrefix)) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (user.role !== 'admin') {
            return NextResponse.redirect(new URL('/not-found', req.url));
        }
    }

    //Protect /user routes
    if (pathname.startsWith(userPrefix)) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (user.role !== 'user') {
            return NextResponse.redirect(new URL('/not-found', req.url));
        }
    }

    // stop alr  logged in users from accessing public pages
    const isPublic = publicPaths.some((path) => path === "/" ? pathname === "/" : pathname === path);
    if (isPublic && user) {
        // Redirect based on role
        if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        if(user.role ==='user'){
            return NextResponse.redirect(new URL('/user/home', req.url));
        }
        else {
            return NextResponse.redirect(new URL('/not-found', req.url));
        }
    }

    // Let Next.js handle 404s for non-existent routes
    return NextResponse.next();
}

export const config ={
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register",
        "/"
    ]
}

//matcher- which path to apply proxy logic