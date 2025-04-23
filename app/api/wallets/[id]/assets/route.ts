import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createAsset, getAssets, getWalletById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Verify wallet belongs to user
    const wallet = await getWalletById(params.id, user.id)
    if (!wallet) {
      return NextResponse.json({ message: "Wallet not found" }, { status: 404 })
    }

    const assets = await getAssets(params.id)
    return NextResponse.json(assets)
  } catch (error) {
    console.error("Get assets error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Verify wallet belongs to user
    const wallet = await getWalletById(params.id, user.id)
    if (!wallet) {
      return NextResponse.json({ message: "Wallet not found" }, { status: 404 })
    }

    const { type, symbol, name, quantity, purchasePrice, currentPrice } = await request.json()

    // Validate input
    if (!type || !symbol || !name || !quantity || !purchasePrice || !currentPrice) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const asset = await createAsset({
      walletId: params.id,
      type,
      symbol,
      name,
      quantity,
      purchasePrice,
      currentPrice,
    })

    return NextResponse.json(asset)
  } catch (error) {
    console.error("Create asset error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}
