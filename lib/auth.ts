import { cookies } from "next/headers"
import { createUser, getUserByEmail, getUserById } from "./db"
import type { User } from "./types"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

// Use environment variable for JWT secret
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
const COOKIE_NAME = "auth_token"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function signUp(email: string, password: string, name: string): Promise<User> {
  try {
    const hashedPassword = await hashPassword(password)
    const user = await createUser({
      email,
      name,
    })

    // In a real app, store the hashed password in the database
    // For this challenge, we'll simulate it by storing in a separate file
    const fs = require("fs")
    const path = require("path")

    const dataDir = path.join(process.cwd(), "data")
    const PASSWORDS_FILE = path.join(dataDir, "passwords.json")

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    let userPasswords = {}

    // Check if the passwords file exists
    if (fs.existsSync(PASSWORDS_FILE)) {
      try {
        const data = fs.readFileSync(PASSWORDS_FILE, "utf8")
        userPasswords = JSON.parse(data)
      } catch (error) {
        console.error("Error reading passwords file:", error)
        // Continue with empty object if file exists but can't be read
      }
    }

    userPasswords[user.id] = hashedPassword
    fs.writeFileSync(PASSWORDS_FILE, JSON.stringify(userPasswords, null, 2))

    return user
  } catch (error) {
    console.error("Sign up error:", error)
    throw new Error("Failed to create user account")
  }
}

export async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByEmail(email)
    if (!user) return null

    // In a real app, get the hashed password from the database
    // For this challenge, we'll simulate it by reading from a separate file
    const fs = require("fs")
    const path = require("path")

    const PASSWORDS_FILE = path.join(process.cwd(), "data", "passwords.json")

    if (!fs.existsSync(PASSWORDS_FILE)) {
      return null
    }

    let userPasswords = {}
    try {
      const data = fs.readFileSync(PASSWORDS_FILE, "utf8")
      userPasswords = JSON.parse(data)
    } catch (error) {
      console.error("Error reading passwords file:", error)
      return null
    }

    const hashedPassword = userPasswords[user.id]

    if (!hashedPassword) return null

    const passwordMatch = await comparePasswords(password, hashedPassword)
    if (!passwordMatch) return null

    return user
  } catch (error) {
    console.error("Sign in error:", error)
    return null
  }
}

export async function createToken(user: User): Promise<string> {
  try {
    // Create a JWT token using jose
    return await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)
  } catch (error) {
    console.error("Token creation error:", error)
    throw new Error("Failed to create authentication token")
  }
}

export function setAuthCookie(token: string): void {
  try {
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
  } catch (error) {
    console.error("Set cookie error:", error)
    throw new Error("Failed to set authentication cookie")
  }
}

export function removeAuthCookie(): void {
  try {
    cookies().delete(COOKIE_NAME)
  } catch (error) {
    console.error("Remove cookie error:", error)
  }
}

export function getAuthToken(): string | undefined {
  try {
    return cookies().get(COOKIE_NAME)?.value
  } catch (error) {
    console.error("Get token error:", error)
    return undefined
  }
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload || !payload.id) return null

    const user = await getUserById(payload.id)
    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
