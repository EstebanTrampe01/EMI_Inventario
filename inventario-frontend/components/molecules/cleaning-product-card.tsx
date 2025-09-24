"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/atoms/product-image"
import { CategoryBadge } from "@/components/atoms/category-badge"
import { Minus, Plus, Package, AlertTriangle } from "lucide-react"

interface CleaningProduct {
  id: string
  name: string
  categories: {
    id: string
    name: string
    color?: "primary" | "secondary" | "accent"
  }[]
  image: string
  stock: number
  minStock: number
  unit: string // "unidades", "litros", "kg", etc.
}

interface CleaningProductCardProps {
  product: CleaningProduct
  onStockChange: (productId: string, newStock: number) => Promise<void>
  className?: string
}

export function CleaningProductCard({ product, onStockChange, className }: CleaningProductCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const isLowStock = product.stock <= product.minStock
  const isOutOfStock = product.stock === 0

  const handleStockChange = async (change: number) => {
    const newStock = Math.max(0, product.stock + change)
    setIsUpdating(true)
    try {
      await onStockChange(product.id, newStock)
    } catch (e) {
      console.error("Error updating stock", e)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStockStatusColor = () => {
    if (isOutOfStock) return "text-red-600"
    if (isLowStock) return "text-orange-600"
    return "text-green-600"
  }

  const getStockStatusIcon = () => {
    if (isOutOfStock || isLowStock) {
      return <AlertTriangle className="h-4 w-4" />
    }
    return <Package className="h-4 w-4" />
  }

  return (
    <Card className={`group overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImage src={product.image} alt={product.name} className="h-full object-cover" />

          {/* Indicador de stock bajo/agotado */}
          {(isLowStock || isOutOfStock) && (
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium text-white ${
                isOutOfStock ? "bg-red-500" : "bg-orange-500"
              }`}
            >
              {isOutOfStock ? "Agotado" : "Stock Bajo"}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium text-sm line-clamp-2 text-foreground mb-1">{product.name}</h3>
            <div className={`flex items-center gap-1 text-xs font-medium ${getStockStatusColor()}`}>
              {getStockStatusIcon()}
              <span>
                {product.stock} {product.unit}
              </span>
            </div>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStockChange(-1)}
                disabled={isUpdating || product.stock === 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>

              <div className="min-w-[60px] text-center">
                <div className="text-sm font-medium">{product.stock}</div>
                <div className="text-xs text-muted-foreground">{product.unit}</div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStockChange(1)}
                disabled={isUpdating}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Botones de acción rápida */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStockChange(5)}
                disabled={isUpdating}
                className="text-xs px-2 h-7"
              >
                +5
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStockChange(10)}
                disabled={isUpdating}
                className="text-xs px-2 h-7"
              >
                +10
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.categories.map((category) => (
              <CategoryBadge key={category.id} category={category} size="sm" />
            ))}
          </div>

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <div className="flex justify-between">
              <span>Stock mínimo:</span>
              <span>
                {product.minStock} {product.unit}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
