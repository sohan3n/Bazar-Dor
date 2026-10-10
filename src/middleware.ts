import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Fetch the active session from BetterAuth
  const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = await response.json().catch(() => null);

  // 2. Define route categories
  // Added /category and /product to the protected list
  const isProtectedRoute = 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/category") || 
    pathname.startsWith("/product");
    
  const isAuthRoute = pathname === "/signin" || pathname === "/signup";

  // 3. Redirect Logic
  // Block unauthorized users from protected routes
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Block logged-in users from accessing auth pages
  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 4. Update the matcher array so Next.js knows to run middleware on these paths
export const config = {
  matcher: [
    "/profile", 
    "/signin", 
    "/signup", 
    "/category/:path*", 
    "/product/:path*"
  ],
};