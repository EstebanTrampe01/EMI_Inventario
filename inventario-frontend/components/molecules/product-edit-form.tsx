"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface Category {
  id: string
  name: string
  color?: "primary" | "secondary" | "accent"
}

interface Product {
  id: string
  name: string
  categories: Category[]
  image: string
  stock: number
  minStock: number
  unit: string
}

interface ProductEditFormProps {
  products: Product[]
  availableCategories: Category[]
  onUpdate: (
    productId: string,
    updatedProduct: {
      name: string
      description: string
      stock: number
      image: string
      categories: string[]
  minStock?: number
    },
  ) => void
  onDelete: (productId: string) => void // Added delete handler prop
}

export function ProductEditForm({ products, availableCategories, onUpdate, onDelete }: ProductEditFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [stock, setStock] = useState(0)
  const [image, setImage] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minStock, setMinStock] = useState<number | undefined>(undefined)

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setName(product.name)
    setDescription("") // No tenemos descripción en el modelo actual, pero la agregamos para el formulario
    setStock(product.stock)
    setImage(product.image)
    setSelectedCategories(product.categories.map((cat) => cat.id))
  setMinStock(product.minStock)
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (selectedProduct) {
      setName(selectedProduct.name)
      setDescription("")
      setStock(selectedProduct.stock)
      setImage(selectedProduct.image)
      setSelectedCategories(selectedProduct.categories.map((cat) => cat.id))
  setMinStock(selectedProduct.minStock)
    }
    setIsEditing(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    onUpdate(selectedProduct.id, {
      name,
      description,
      stock,
      image,
  categories: selectedCategories,
  minStock,
    })

    setIsEditing(false)
    // Actualizar el producto seleccionado con los nuevos datos
    const updatedProduct = {
      ...selectedProduct,
      name,
      stock,
      image,
      categories: selectedCategories.map((catId) => {
        const category = availableCategories.find((cat) => cat.id === catId)
        return category || { id: catId, name: catId, color: "secondary" as const }
      }),
  minStock: minStock ?? selectedProduct.minStock,
    }
    setSelectedProduct(updatedProduct)
  }

  const handleDelete = () => {
    if (selectedProduct) {
      onDelete(selectedProduct.id)
      setSelectedProduct(null)
      setSearchTerm("")
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Producto para Editar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Nombre del producto</Label>
            <Input
              id="search"
              placeholder="Escribe el nombre del producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="space-y-2">
              <Label>Productos encontrados:</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedProduct?.id === product.id ? "bg-muted border-primary" : ""
                      }`}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Stock: {product.stock} {product.unit}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((category) => (
                            <Badge key={category.id} variant="secondary" className="text-xs">
                              {category.name}
                            </Badge>
                          ))}
                          {product.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No se encontraron productos con ese nombre
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                {isEditing ? "Editando Producto" : "Producto Seleccionado"}
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
                        Esta acción eliminará permanentemente el producto "{selectedProduct.name}". Esta acción no
                        se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sí, eliminar producto
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nombre del producto *</Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number.parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-minStock">Stock mínimo</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    min="0"
                    placeholder="Calculado automáticamente si se omite"
                    value={minStock ?? ""}
                    onChange={(e) => setMinStock(e.target.value === "" ? undefined : Math.max(0, Number.parseInt(e.target.value) || 0))}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Si se deja vacío, se calculará automáticamente.</p>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Descripción del producto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">URL de la imagen</Label>
                <Input
                  id="edit-image"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label>Categorías</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        !isEditing ? "cursor-default" : "hover:bg-primary hover:text-primary-foreground"
                      }`}
                      onClick={() => isEditing && handleCategoryToggle(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">Sin categorías seleccionadas</p>
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
