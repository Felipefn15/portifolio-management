import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public paths that don't require authentication
const publicPaths = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value

  // If the path is public and the user is authenticated, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    // Allow API routes to handle their own authentication
    if (pathname.startsWith("/api/")) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes - we'll handle auth there separately)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
