"use client"

import { useEffect, useState } from "react"
import {
  Header,
  WalletCard,
  CreateWalletDialog,
  EditWalletDialog,
  DeleteWalletDialog,
} from "@/components/ui-components"
import type { WalletWithCalculations } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [wallets, setWallets] = useState<WalletWithCalculations[]>([])
  const [loading, setLoading] = useState(true)
  const [editWallet, setEditWallet] = useState<WalletWithCalculations | null>(null)
  const [deleteWallet, setDeleteWallet] = useState<WalletWithCalculations | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchWallets = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/wallets")
      if (!response.ok) {
        throw new Error("Failed to fetch wallets")
      }
      const data = await response.json()
      setWallets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wallets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  const handleEditWallet = (wallet: WalletWithCalculations) => {
    setEditWallet(wallet)
    setIsEditDialogOpen(true)
  }

  const handleDeleteWallet = (wallet: WalletWithCalculations) => {
    setDeleteWallet(wallet)
    setIsDeleteDialogOpen(true)
  }

  // Calculate total portfolio value and profit/loss
  const totalValue = wallets.reduce((sum, wallet) => sum + wallet.totalValue, 0)
  const totalInvested = wallets.reduce((sum, wallet) => sum + wallet.spentAmount, 0)
  const totalProfitLoss = totalValue - totalInvested
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your investment portfolios</p>
          </div>
          <CreateWalletDialog onWalletCreated={fetchWallets} />
        </div>

        {/* Portfolio Summary */}
        <div className="grid gap-4 mb-8 p-4 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Value</p>
              {loading ? (
                <Skeleton className="h-6 w-24 mt-1" />
              ) : (
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Invested</p>
              {loading ? (
                <Skeleton className="h-6 w-24 mt-1" />
              ) : (
                <p className="text-2xl font-bold">${totalInvested.toFixed(2)}</p>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Profit/Loss</p>
              {loading ? (
                <Skeleton className="h-6 w-24 mt-1" />
              ) : (
                <p
                  className={`text-2xl font-bold ${
                    totalProfitLoss > 0 ? "text-green-600" : totalProfitLoss < 0 ? "text-red-600" : ""
                  }`}
                >
                  ${totalProfitLoss.toFixed(2)}
                </p>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Return</p>
              {loading ? (
                <Skeleton className="h-6 w-24 mt-1" />
              ) : (
                <p
                  className={`text-2xl font-bold ${
                    totalProfitLossPercentage > 0
                      ? "text-green-600"
                      : totalProfitLossPercentage < 0
                        ? "text-red-600"
                        : ""
                  }`}
                >
                  {totalProfitLossPercentage.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Wallets</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">You don&apos;t have any wallets yet.</p>
            <p className="mt-2">Create a wallet to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEditWallet} onDelete={handleDeleteWallet} />
            ))}
          </div>
        )}
      </main>

      {/* Edit Wallet Dialog */}
      <EditWalletDialog
        wallet={editWallet}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onWalletUpdated={fetchWallets}
      />

      {/* Delete Wallet Dialog */}
      <DeleteWalletDialog
        wallet={deleteWallet}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onWalletDeleted={fetchWallets}
      />
    </div>
  )
}
