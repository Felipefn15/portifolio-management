import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public paths that don't require authentication
const publicPaths = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Skip middleware for the root path - let the page component handle it
    if (pathname === "/") {
      return NextResponse.next()
    }

    // Skip middleware for API routes and static files
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
      return NextResponse.next()
    }

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
