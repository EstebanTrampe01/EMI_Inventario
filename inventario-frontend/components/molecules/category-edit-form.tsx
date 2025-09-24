"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Edit3, Save, X, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  products: string[]
}

interface CategoryEditFormProps {
  categories: Category[]
  availableProducts: Product[]
  onUpdate: (
    categoryId: string,
    updatedCategory: {
      name: string
      products: string[]
    },
  ) => void
  onDelete: (categoryId: string) => void
}

export function CategoryEditForm({ categories, availableProducts, onUpdate, onDelete }: CategoryEditFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category)
    setName(category.name)
    setSelectedProducts(category.products)
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (selectedCategory) {
      setName(selectedCategory.name)
      setSelectedProducts(selectedCategory.products)
    }
    setIsEditing(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    onUpdate(selectedCategory.id, {
      name,
      products: selectedProducts,
    })

    setIsEditing(false)
    // Actualizar la categoría seleccionada con los nuevos datos
    const updatedCategory = {
      ...selectedCategory,
      name,
      products: selectedProducts,
    }
    setSelectedCategory(updatedCategory)
  }

  const handleDelete = () => {
    if (selectedCategory) {
      onDelete(selectedCategory.id)
      setSelectedCategory(null)
      setSearchTerm("")
    }
  }

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Categoría para Editar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Nombre de la categoría</Label>
            <Input
              id="search"
              placeholder="Escribe el nombre de la categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="space-y-2">
              <Label>Categorías encontradas:</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedCategory?.id === category.id ? "bg-muted border-primary" : ""
                      }`}
                      onClick={() => handleSelectCategory(category)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.products.length} producto{category.products.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.products.length}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No se encontraron categorías con ese nombre
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                {isEditing ? "Editando Categoría" : "Categoría Seleccionada"}
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={handleStartEdit}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                )}
                {/* Delete button visible in both view and edit modes */}
        <AlertDialog>
                  <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente la categoría "{selectedCategory.name}". Esta acción no
                        se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sí, eliminar categoría
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre de la categoría *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <Label>Productos</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecciona los productos que pertenecen a esta categoría
                </p>
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-2 border rounded cursor-pointer transition-colors ${
                          !isEditing ? "cursor-default" : "hover:bg-muted"
                        } ${selectedProducts.includes(product.id) ? "bg-muted border-primary" : ""}`}
                        onClick={() => isEditing && handleProductToggle(product.id)}
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
                {selectedProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">0 productos seleccionados</p>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
