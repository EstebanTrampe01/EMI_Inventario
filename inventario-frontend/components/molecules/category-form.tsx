"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Save } from "lucide-react"

interface Product {
  id: string
  name: string
}

interface CategoryFormProps {
  availableProducts: Product[]
  onSubmit: (category: {
    name: string
    products: string[]
  }) => void
}

export function CategoryForm({ availableProducts, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      products: selectedProducts,
    })

    // Reset form
    setName("")
    setSelectedProducts([])
  }

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Crear Nueva Categoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Nombre de la categoría *</Label>
            <Input
              id="category-name"
              placeholder="Ej: Detergentes, Desinfectantes..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Productos (opcional)</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Selecciona los productos que pertenecen a esta categoría
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
              {availableProducts.length > 0 ? (
                availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-2 border rounded cursor-pointer transition-colors hover:bg-muted ${
                      selectedProducts.includes(product.id) ? "bg-muted border-primary" : ""
                    }`}
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{product.name}</span>
                      {selectedProducts.includes(product.id) && (
                        <Badge variant="default" className="text-xs">
                          Seleccionado
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No hay productos disponibles</div>
              )}
            </div>
            {selectedProducts.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedProducts.length} producto{selectedProducts.length !== 1 ? "s" : ""} seleccionado
                {selectedProducts.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!name.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Crear Categoría
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
