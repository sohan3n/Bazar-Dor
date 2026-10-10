import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = await response.json().catch(() => null);

  const isProtectedRoute = 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/category") || 
    pathname.startsWith("/product");
    
  const isAuthRoute = pathname === "/signin" || pathname === "/signup";

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile", 
    "/signin", 
    "/signup", 
    "/category/:path*", 
    "/product/:path*"
  ],
};