import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { deleteWallet, getWalletById, updateWallet } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const wallet = await getWalletById(params.id, user.id)

    if (!wallet) {
      return NextResponse.json({ message: "Wallet not found" }, { status: 404 })
    }

    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Get wallet error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Wallet name is required" }, { status: 400 })
    }

    const wallet = await updateWallet(params.id, user.id, { name })
    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Update wallet error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    await deleteWallet(params.id, user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete wallet error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}
