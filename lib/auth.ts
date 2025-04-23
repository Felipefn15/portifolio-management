import { cookies } from "next/headers"
import { createUser, getUserByEmail, getUserById } from "./db"
import type { User } from "./types"
import bcrypt from "bcryptjs"
import * as fs from "fs"
import * as path from "path"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const COOKIE_NAME = "auth_token"

// Simple JWT implementation to avoid library issues
function createSimpleToken(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64").replace(/=/g, "")

  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 60 * 60 * 24 * 7 // 7 days

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  }

  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString("base64").replace(/=/g, "")

  const signature = Buffer.from(
    require("crypto").createHmac("sha256", JWT_SECRET).update(`${encodedHeader}.${encodedPayload}`).digest(),
  )
    .toString("base64")
    .replace(/=/g, "")

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

function verifySimpleToken(token: string): any {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".")

    const expectedSignature = Buffer.from(
      require("crypto").createHmac("sha256", JWT_SECRET).update(`${encodedHeader}.${encodedPayload}`).digest(),
    )
      .toString("base64")
      .replace(/=/g, "")

    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString())

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null // Token expired
    }

    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true })
    } catch (error) {
      console.error("Failed to create data directory:", error)
    }
  }
  return dataDir
}

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

    // Store the hashed password
    const dataDir = ensureDataDirectory()
    const PASSWORDS_FILE = path.join(dataDir, "passwords.json")

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

    const dataDir = ensureDataDirectory()
    const PASSWORDS_FILE = path.join(dataDir, "passwords.json")

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

export function createToken(user: User): string {
  try {
    return createSimpleToken({ id: user.id, email: user.email })
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

export function verifyToken(token: string): any {
  try {
    return verifySimpleToken(token)
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload || !payload.id) return null

    const user = await getUserById(payload.id)
    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
