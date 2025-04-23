import { cookies } from "next/headers"
import { createUser, getUserByEmail, getUserById } from "./db"
import type { User } from "./types"
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const COOKIE_NAME = "auth_token"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function signUp(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await hashPassword(password)
  const user = await createUser({
    email,
    name,
  })

  // In a real app, store the hashed password in the database
  // For this challenge, we'll simulate it by storing in a separate file
  const fs = require("fs")
  const path = require("path")

  const PASSWORDS_FILE = path.join(process.cwd(), "data", "passwords.json")

  let userPasswords = {}

  // Check if the passwords file exists
  if (fs.existsSync(PASSWORDS_FILE)) {
    try {
      const data = fs.readFileSync(PASSWORDS_FILE, "utf8")
      userPasswords = JSON.parse(data)
    } catch (error) {
      console.error("Error reading passwords file:", error)
    }
  }

  userPasswords[user.id] = hashedPassword

  // Ensure the data directory exists
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  fs.writeFileSync(PASSWORDS_FILE, JSON.stringify(userPasswords, null, 2))

  return user
}

export async function signIn(email: string, password: string): Promise<User | null> {
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
}

export function createToken(user: User): string {
  // Use a simpler approach to create the JWT token
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )
  } catch (error) {
    console.error("Error creating token:", error)
    throw new Error("Failed to create authentication token")
  }
}

export function setAuthCookie(token: string): void {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export function removeAuthCookie(): void {
  cookies().delete(COOKIE_NAME)
}

export function getAuthToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value
}

export function verifyToken(token: string): any {
  try {
    // Use a simpler approach to verify the JWT token
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) return null

    const user = await getUserById(decoded.id)
    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
