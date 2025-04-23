"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header, AssetCard, CreateAssetDialog, EditAssetDialog, DeleteAssetDialog } from "@/components/ui-components"
import type { AssetWithCalculations, WalletWithCalculations } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function WalletPage({ params }: { params: { id: string } }) {
  const [wallet, setWallet] = useState<WalletWithCalculations | null>(null)
  const [assets, setAssets] = useState<AssetWithCalculations[]>([])
  const [loading, setLoading] = useState(true)
  const [editAsset, setEditAsset] = useState<AssetWithCalculations | null>(null)
  const [deleteAsset, setDeleteAsset] = useState<AssetWithCalculations | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const fetchWallet = async () => {
    try {
      const response = await fetch(`/api/wallets/${params.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard")
          return
        }
        throw new Error("Failed to fetch wallet")
      }
      const data = await response.json()
      setWallet(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wallet",
        variant: "destructive",
      })
    }
  }

  const fetchAssets = async () => {
    try {
      const response = await fetch(`/api/wallets/${params.id}/assets`)
      if (!response.ok) {
        throw new Error("Failed to fetch assets")
      }
      const data = await response.json()
      setAssets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchWallet()
      await fetchAssets()
    }
    fetchData()
  }, [params.id])

  const handleEditAsset = (asset: AssetWithCalculations) => {
    setEditAsset(asset)
    setIsEditDialogOpen(true)
  }

  const handleDeleteAsset = (asset: AssetWithCalculations) => {
    setDeleteAsset(asset)
    setIsDeleteDialogOpen(true)
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : wallet ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{wallet.name}</h1>
                <p className="text-muted-foreground">Manage your assets</p>
              </div>
              <CreateAssetDialog walletId={params.id} onAssetCreated={fetchAssets} />
            </div>

            {/* Wallet Summary */}
            <div className="grid gap-4 mb-8 p-4 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">Wallet Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${wallet.totalValue.toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">${wallet.spentAmount.toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit/Loss</p>
                  <p
                    className={`text-2xl font-bold ${
                      wallet.profitLoss > 0 ? "text-green-600" : wallet.profitLoss < 0 ? "text-red-600" : ""
                    }`}
                  >
                    ${wallet.profitLoss.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Return</p>
                  <p
                    className={`text-2xl font-bold ${
                      wallet.profitLossPercentage > 0
                        ? "text-green-600"
                        : wallet.profitLossPercentage < 0
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {wallet.profitLossPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            {assets.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">You don&apos;t have any assets in this wallet yet.</p>
                <p className="mt-2">Add an asset to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p>Wallet not found.</p>
            <Button variant="link" onClick={handleBack}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </main>

      {/* Edit Asset Dialog */}
      <EditAssetDialog
        asset={editAsset}
        walletId={params.id}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onAssetUpdated={fetchAssets}
      />

      {/* Delete Asset Dialog */}
      <DeleteAssetDialog
        asset={deleteAsset}
        walletId={params.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onAssetDeleted={fetchAssets}
      />
    </div>
  )
}
