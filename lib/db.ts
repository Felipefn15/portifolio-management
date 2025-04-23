import type { Asset, User, Wallet } from "./types"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"
import { calculateAssetMetrics, calculateWalletMetrics } from "./calculations"

// Simple file-based database for the challenge
// In a real application, you would use a proper database

const DB_PATH = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DB_PATH, "users.json")
const WALLETS_FILE = path.join(DB_PATH, "wallets.json")
const ASSETS_FILE = path.join(DB_PATH, "assets.json")

// Ensure the data directory exists
if (!fs.existsSync(DB_PATH)) {
  try {
    fs.mkdirSync(DB_PATH, { recursive: true })
  } catch (error) {
    console.error("Failed to create data directory:", error)
  }
}

// Initialize files if they don't exist
function initializeFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify([]))
    } catch (error) {
      console.error(`Failed to initialize ${filePath}:`, error)
    }
  }
}

// Initialize all required files
initializeFile(USERS_FILE)
initializeFile(WALLETS_FILE)
initializeFile(ASSETS_FILE)

// Helper functions to read and write data
function readData<T>(filePath: string): T[] {
  try {
    if (!fs.existsSync(filePath)) {
      return []
    }
    const data = fs.readFileSync(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

function writeData<T>(filePath: string, data: T[]): void {
  try {
    // Ensure directory exists before writing
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error)
  }
}

// User operations
export async function createUser(userData: Omit<User, "id">): Promise<User> {
  const users = readData<User>(USERS_FILE)

  // Check if user already exists
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    id: uuidv4(),
    ...userData,
  }

  users.push(newUser)
  writeData(USERS_FILE, users)

  return newUser
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = readData<User>(USERS_FILE)
  const user = users.find((user) => user.email === email)
  return user || null
}

export async function getUserById(id: string): Promise<User | null> {
  const users = readData<User>(USERS_FILE)
  const user = users.find((user) => user.id === id)
  return user || null
}

// Wallet operations
export async function getWallets(userId: string) {
  const wallets = readData<Wallet>(WALLETS_FILE)
  const userWallets = wallets.filter((wallet) => wallet.userId === userId)

  const assets = readData<Asset>(ASSETS_FILE)

  return userWallets.map((wallet) => {
    const walletAssets = assets.filter((asset) => asset.walletId === wallet.id)
    return calculateWalletMetrics(wallet, walletAssets)
  })
}

export async function getWalletById(id: string, userId: string) {
  const wallets = readData<Wallet>(WALLETS_FILE)
  const wallet = wallets.find((wallet) => wallet.id === id && wallet.userId === userId)

  if (!wallet) return null

  const assets = readData<Asset>(ASSETS_FILE)
  const walletAssets = assets.filter((asset) => asset.walletId === wallet.id)

  return calculateWalletMetrics(wallet, walletAssets)
}

export async function createWallet(walletData: { name: string; userId: string }) {
  const wallets = readData<Wallet>(WALLETS_FILE)

  const newWallet: Wallet = {
    id: uuidv4(),
    ...walletData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  wallets.push(newWallet)
  writeData(WALLETS_FILE, wallets)

  return newWallet
}

export async function updateWallet(id: string, userId: string, data: { name: string }) {
  const wallets = readData<Wallet>(WALLETS_FILE)
  const walletIndex = wallets.findIndex((wallet) => wallet.id === id && wallet.userId === userId)

  if (walletIndex === -1) {
    throw new Error("Wallet not found")
  }

  wallets[walletIndex] = {
    ...wallets[walletIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeData(WALLETS_FILE, wallets)

  return wallets[walletIndex]
}

export async function deleteWallet(id: string, userId: string) {
  const wallets = readData<Wallet>(WALLETS_FILE)
  const filteredWallets = wallets.filter((wallet) => !(wallet.id === id && wallet.userId === userId))

  if (filteredWallets.length === wallets.length) {
    throw new Error("Wallet not found")
  }

  writeData(WALLETS_FILE, filteredWallets)

  // Delete associated assets
  const assets = readData<Asset>(ASSETS_FILE)
  const filteredAssets = assets.filter((asset) => asset.walletId !== id)
  writeData(ASSETS_FILE, filteredAssets)

  return { success: true }
}

// Asset operations
export async function getAssets(walletId: string) {
  const assets = readData<Asset>(ASSETS_FILE)
  const walletAssets = assets.filter((asset) => asset.walletId === walletId)

  return walletAssets.map((asset) => calculateAssetMetrics(asset))
}

export async function getAssetById(id: string, walletId: string) {
  const assets = readData<Asset>(ASSETS_FILE)
  const asset = assets.find((asset) => asset.id === id && asset.walletId === walletId)

  if (!asset) return null

  return calculateAssetMetrics(asset)
}

export async function createAsset(assetData: Omit<Asset, "id" | "createdAt" | "updatedAt">) {
  const assets = readData<Asset>(ASSETS_FILE)

  const newAsset: Asset = {
    id: uuidv4(),
    ...assetData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  assets.push(newAsset)
  writeData(ASSETS_FILE, assets)

  return calculateAssetMetrics(newAsset)
}

export async function updateAsset(
  id: string,
  walletId: string,
  data: Partial<Omit<Asset, "id" | "walletId" | "createdAt" | "updatedAt">>,
) {
  const assets = readData<Asset>(ASSETS_FILE)
  const assetIndex = assets.findIndex((asset) => asset.id === id && asset.walletId === walletId)

  if (assetIndex === -1) {
    throw new Error("Asset not found")
  }

  assets[assetIndex] = {
    ...assets[assetIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeData(ASSETS_FILE, assets)

  return calculateAssetMetrics(assets[assetIndex])
}

export async function deleteAsset(id: string, walletId: string) {
  const assets = readData<Asset>(ASSETS_FILE)
  const filteredAssets = assets.filter((asset) => !(asset.id === id && asset.walletId === walletId))

  if (filteredAssets.length === assets.length) {
    throw new Error("Asset not found")
  }

  writeData(ASSETS_FILE, filteredAssets)

  return { success: true }
}
