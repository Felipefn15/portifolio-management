import type { Asset, AssetWithCalculations, Wallet, WalletWithCalculations } from "./types"

export function calculateAssetMetrics(asset: Asset): AssetWithCalculations {
  const totalValue = asset.quantity * asset.currentPrice
  const investedValue = asset.quantity * asset.purchasePrice
  const profitLoss = totalValue - investedValue
  const profitLossPercentage = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0

  return {
    ...asset,
    totalValue,
    profitLoss,
    profitLossPercentage,
  }
}

export function calculateWalletMetrics(wallet: Wallet, assets: Asset[]): WalletWithCalculations {
  const assetsWithMetrics = assets.map(calculateAssetMetrics)

  const totalValue = assetsWithMetrics.reduce((sum, asset) => sum + asset.totalValue, 0)

  const spentAmount = assetsWithMetrics.reduce((sum, asset) => sum + asset.purchasePrice * asset.quantity, 0)

  const profitLoss = totalValue - spentAmount

  const profitLossPercentage = spentAmount > 0 ? (profitLoss / spentAmount) * 100 : 0

  return {
    ...wallet,
    totalValue,
    spentAmount,
    profitLoss,
    profitLossPercentage,
    assetCount: assets.length,
  }
}
