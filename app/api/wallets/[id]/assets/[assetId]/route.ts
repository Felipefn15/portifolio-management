import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { deleteAsset, getAssetById, getWalletById, updateAsset } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string; assetId: string } }) {
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

    const asset = await getAssetById(params.assetId, params.id)

    if (!asset) {
      return NextResponse.json({ message: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error("Get asset error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string; assetId: string } }) {
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

    const asset = await updateAsset(params.assetId, params.id, {
      type,
      symbol,
      name,
      quantity,
      purchasePrice,
      currentPrice,
    })

    return NextResponse.json(asset)
  } catch (error) {
    console.error("Update asset error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; assetId: string } }) {
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

    await deleteAsset(params.assetId, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete asset error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}
