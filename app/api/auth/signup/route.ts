import { type NextRequest, NextResponse } from "next/server"
import { createToken, setAuthCookie, signUp } from "@/lib/auth"
import { getUserByEmail } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ message: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create user
    const user = await signUp(email, password, name)

    // Create and set JWT token
    const token = createToken(user)
    setAuthCookie(token)

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 })
  }
}
