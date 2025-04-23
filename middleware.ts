import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of protected paths that require authentication
const protectedPaths = ["/dashboard", "/wallet"]

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Skip middleware for API routes and static files
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
      return NextResponse.next()
    }

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

    // Get the token from the cookies
    const token = request.cookies.get("auth_token")?.value

    // If the path is protected and the user is not authenticated, redirect to login
    if (isProtectedPath && !token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, continue to the requested page
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
