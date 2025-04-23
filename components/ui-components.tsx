"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { AssetWithCalculations, WalletWithCalculations } from "@/lib/types"
import { MoreHorizontal, Plus, Trash, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Header Component
export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="font-semibold text-lg">CareMinds Portfolio</div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Hello, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

// Wallet Card Component
export function WalletCard({
  wallet,
  onEdit,
  onDelete,
}: {
  wallet: WalletWithCalculations
  onEdit: (wallet: WalletWithCalculations) => void
  onDelete: (wallet: WalletWithCalculations) => void
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/wallet/${wallet.id}`)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl">{wallet.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(wallet)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(wallet)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Total Value:</span>
            <span className="font-medium">${wallet.totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Spent:</span>
            <span className="font-medium">${wallet.spentAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Profit/Loss:</span>
            <span
              className={`font-medium ${
                wallet.profitLoss > 0 ? "text-green-600" : wallet.profitLoss < 0 ? "text-red-600" : ""
              }`}
            >
              ${wallet.profitLoss.toFixed(2)} ({wallet.profitLossPercentage.toFixed(2)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Assets:</span>
            <span className="font-medium">{wallet.assetCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" onClick={handleClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

// Asset Card Component
export function AssetCard({
  asset,
  onEdit,
  onDelete,
}: {
  asset: AssetWithCalculations
  onEdit: (asset: AssetWithCalculations) => void
  onDelete: (asset: AssetWithCalculations) => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-lg">{asset.name}</CardTitle>
          <CardDescription>
            {asset.symbol} · {asset.type}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(asset)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Quantity:</span>
            <span className="font-medium">{asset.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Purchase Price:</span>
            <span className="font-medium">${asset.purchasePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Current Price:</span>
            <span className="font-medium">${asset.currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Total Value:</span>
            <span className="font-medium">${asset.totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Profit/Loss:</span>
            <span
              className={`font-medium ${
                asset.profitLoss > 0 ? "text-green-600" : asset.profitLoss < 0 ? "text-red-600" : ""
              }`}
            >
              ${asset.profitLoss.toFixed(2)} ({asset.profitLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Create Wallet Dialog
export function CreateWalletDialog({
  onWalletCreated,
}: {
  onWalletCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to create wallet")
      }

      toast({
        title: "Success",
        description: "Wallet created successfully",
      })
      setName("")
      setOpen(false)
      onWalletCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Wallet</DialogTitle>
            <DialogDescription>Add a new wallet to manage your assets.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Wallet Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter wallet name" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Wallet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit Wallet Dialog
export function EditWalletDialog({
  wallet,
  open,
  onOpenChange,
  onWalletUpdated,
}: {
  wallet: WalletWithCalculations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletUpdated: () => void
}) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Update name when wallet changes
  useState(() => {
    if (wallet) {
      setName(wallet.name)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet || !name.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/wallets/${wallet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to update wallet")
      }

      toast({
        title: "Success",
        description: "Wallet updated successfully",
      })
      onOpenChange(false)
      onWalletUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>Update your wallet information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Wallet Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter wallet name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Wallet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Delete Wallet Dialog
export function DeleteWalletDialog({
  wallet,
  open,
  onOpenChange,
  onWalletDeleted,
}: {
  wallet: WalletWithCalculations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletDeleted: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!wallet) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/wallets/${wallet.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete wallet")
      }

      toast({
        title: "Success",
        description: "Wallet deleted successfully",
      })
      onOpenChange(false)
      onWalletDeleted()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Wallet</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this wallet? This action cannot be undone and all assets in this wallet will
            be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Create Asset Dialog
export function CreateAssetDialog({
  walletId,
  onAssetCreated,
}: {
  walletId: string
  onAssetCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "stock",
    symbol: "",
    name: "",
    quantity: "",
    purchasePrice: "",
    currentPrice: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.symbol.trim() ||
      !formData.name.trim() ||
      !formData.quantity ||
      !formData.purchasePrice ||
      !formData.currentPrice
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/wallets/${walletId}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          symbol: formData.symbol,
          name: formData.name,
          quantity: Number.parseFloat(formData.quantity),
          purchasePrice: Number.parseFloat(formData.purchasePrice),
          currentPrice: Number.parseFloat(formData.currentPrice),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create asset")
      }

      toast({
        title: "Success",
        description: "Asset created successfully",
      })
      setFormData({
        type: "stock",
        symbol: "",
        name: "",
        quantity: "",
        purchasePrice: "",
        currentPrice: "",
      })
      setOpen(false)
      onAssetCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create asset",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>Add a new asset to your wallet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Asset Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g., AAPL, BTC"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Apple Inc., Bitcoin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="any"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                step="any"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="e.g., 150.50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentPrice">Current Price ($)</Label>
              <Input
                id="currentPrice"
                name="currentPrice"
                type="number"
                step="any"
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder="e.g., 155.75"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit Asset Dialog
export function EditAssetDialog({
  asset,
  walletId,
  open,
  onOpenChange,
  onAssetUpdated,
}: {
  asset: AssetWithCalculations | null
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssetUpdated: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "",
    symbol: "",
    name: "",
    quantity: "",
    purchasePrice: "",
    currentPrice: "",
  })

  // Update form data when asset changes
  useState(() => {
    if (asset) {
      setFormData({
        type: asset.type,
        symbol: asset.symbol,
        name: asset.name,
        quantity: asset.quantity.toString(),
        purchasePrice: asset.purchasePrice.toString(),
        currentPrice: asset.currentPrice.toString(),
      })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as any }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset) return

    // Validate form
    if (
      !formData.symbol.trim() ||
      !formData.name.trim() ||
      !formData.quantity ||
      !formData.purchasePrice ||
      !formData.currentPrice
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/wallets/${walletId}/assets/${asset.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          symbol: formData.symbol,
          name: formData.name,
          quantity: Number.parseFloat(formData.quantity),
          purchasePrice: Number.parseFloat(formData.purchasePrice),
          currentPrice: Number.parseFloat(formData.currentPrice),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update asset")
      }

      toast({
        title: "Success",
        description: "Asset updated successfully",
      })
      onOpenChange(false)
      onAssetUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update asset",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update your asset information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Asset Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input
                id="edit-symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g., AAPL, BTC"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Apple Inc., Bitcoin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="number"
                step="any"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-purchasePrice">Purchase Price ($)</Label>
              <Input
                id="edit-purchasePrice"
                name="purchasePrice"
                type="number"
                step="any"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="e.g., 150.50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-currentPrice">Current Price ($)</Label>
              <Input
                id="edit-currentPrice"
                name="currentPrice"
                type="number"
                step="any"
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder="e.g., 155.75"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Delete Asset Dialog
export function DeleteAssetDialog({
  asset,
  walletId,
  open,
  onOpenChange,
  onAssetDeleted,
}: {
  asset: AssetWithCalculations | null
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssetDeleted: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!asset) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/wallets/${walletId}/assets/${asset.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete asset")
      }

      toast({
        title: "Success",
        description: "Asset deleted successfully",
      })
      onOpenChange(false)
      onAssetDeleted()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this asset? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
