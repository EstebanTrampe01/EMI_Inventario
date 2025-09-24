"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"

interface Category {
  id: string
  name: string
  color?: "primary" | "secondary" | "accent"
}

interface ProductFormProps {
  availableCategories: Category[]
  onSubmit: (product: {
    name: string
    description: string
    stock: number
    image: string
    categories: string[]
  minStock?: number
  }) => void
}

export function ProductForm({ availableCategories, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    image: "",
    categories: [] as string[],
  minStock: undefined as number | undefined,
  })

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      name: "",
      description: "",
      stock: 0,
      image: "",
  categories: [],
  minStock: undefined,
    })
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }))
  }

  const removeCategoryFromForm = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }))
  }

  const selectedCategoryObjects = availableCategories.filter((cat) => formData.categories.includes(cat.id))

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crear Nuevo Producto</CardTitle>
        <p className="text-muted-foreground">Completa la información del producto de limpieza</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del producto */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: Detergente Líquido Concentrado"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las características y usos del producto..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Stock inicial */}
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Inicial *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))}
              required
            />
          </div>

          {/* Stock mínimo (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="minStock">Stock Mínimo (opcional)</Label>
            <Input
              id="minStock"
              type="number"
              min="0"
              placeholder="Calculado automáticamente si se omite"
              value={formData.minStock ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minStock: e.target.value === "" ? undefined : Math.max(0, Number.parseInt(e.target.value) || 0),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Si no se define, se calculará como 20% del stock (mínimo 5).
            </p>
          </div>

          {/* URL de imagen */}
          <div className="space-y-2">
            <Label htmlFor="image">URL de Imagen</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Vista previa"
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Categorías */}
          <div className="space-y-2">
            <Label>Categorías</Label>
            <div className="space-y-3">
              {/* Categorías seleccionadas */}
              {selectedCategoryObjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryObjects.map((category) => (
                    <Badge
                      key={category.id}
                      variant={category.color === "primary" ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => removeCategoryFromForm(category.id)}
                        className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Botón para agregar categorías */}
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Categoría
                </Button>

                {/* Dropdown de categorías */}
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {availableCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          handleCategoryToggle(category.id)
                          setShowCategoryDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between ${
                          formData.categories.includes(category.id) ? "bg-muted" : ""
                        }`}
                      >
                        <span>{category.name}</span>
                        <Badge variant={category.color === "primary" ? "default" : "secondary"} className="text-xs">
                          {category.color}
                        </Badge>
                      </button>
                    ))}
                    {availableCategories.length === 0 && (
                      <div className="px-3 py-2 text-muted-foreground text-sm">No hay categorías disponibles</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Crear Producto
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  name: "",
                  description: "",
                  stock: 0,
                  image: "",
                  categories: [],
                  minStock: undefined,
                })
              }
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
