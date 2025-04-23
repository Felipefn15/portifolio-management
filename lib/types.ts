export interface User {
  id: string
  name: string
  email: string
}

export interface Wallet {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Asset {
  id: string
  walletId: string
  type: "stock" | "crypto" | "cash" | "other"
  symbol: string
  name: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  createdAt: string
  updatedAt: string
}

export interface WalletWithCalculations extends Wallet {
  totalValue: number
  spentAmount: number
  profitLoss: number
  profitLossPercentage: number
  assetCount: number
}

export interface AssetWithCalculations extends Asset {
  totalValue: number
  profitLoss: number
  profitLossPercentage: number
}
