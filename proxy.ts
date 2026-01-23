import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData} from "./lib/cookie";

const publicPaths = ["/login", "/register", "/forgot-password"];
const adminPaths = ["/admin"];

export async function proxy(req: NextRequest) {

    const {pathname} = req.nextUrl;

    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const isPublicPath = publicPaths.some((path)=> pathname.startsWith(path));

    const isAdminPath = adminPaths.some((path)=> pathname.startsWith(path));


    if(user && token){
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (user && token) {
    // If user is authenticated
    if (isAdminPath && user.role !== 'admin') {
        return NextResponse.redirect(new URL("/login", req.url));
    }

}
    

    // If user is not authenticated

    if (isPublicPath && user) {
        return NextResponse.redirect(new URL("/home", req.url));
        }   
    }

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register",
    ]
}


// matcher - which path to apply proxy logic