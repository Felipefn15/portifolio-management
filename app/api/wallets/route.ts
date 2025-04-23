import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createWallet, getWallets } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const wallets = await getWallets(user.id)
    return NextResponse.json(wallets)
  } catch (error) {
    console.error("Get wallets error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Wallet name is required" }, { status: 400 })
    }

    const wallet = await createWallet({ name, userId: user.id })
    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Create wallet error:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}
