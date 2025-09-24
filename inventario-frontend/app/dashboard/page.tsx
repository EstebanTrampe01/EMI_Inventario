"use client"

import { useEffect, useMemo, useState } from "react"
import { CleaningProductCard } from "@/components/molecules/cleaning-product-card"
import { ProductForm } from "@/components/molecules/product-form"
import { ProductEditForm } from "@/components/molecules/product-edit-form"
import { CategoryForm } from "@/components/molecules/category-form"
import { CategoryEditForm } from "@/components/molecules/category-edit-form"
import { CategoryFilter } from "@/components/atoms/category-filter"
import { Sidebar } from "@/components/molecules/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import ThemeToggle from "@/components/atoms/ThemeToggle"
import { signIn, signOut, useSession } from "next-auth/react"
import { API_BASE_URL } from "@/lib/config/env"
import { fetchProducts as apiFetchProducts, updateProduct as apiUpdateProduct, createProduct as apiCreateProduct, deleteProduct as apiDeleteProduct } from "@/lib/api/products"
import { fetchCategories as apiFetchCategories, createCategory as apiCreateCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from "@/lib/api/categories"
import { getCategoryColor } from "@/lib/utils/categoryColor"

// Backend integration types
type BackendCategory = { id: string; name: string }
type BackendProduct = {
  id: string
  name: string
  description: string
  stock: number
  image?: string | null
  categories?: BackendCategory[]
  minStock?: number | null
}

// UI product type
type UiProduct = {
  id: string
  name: string
  categories: { id: string; name: string; color?: "primary" | "secondary" | "accent" }[]
  image: string
  stock: number
  minStock: number
  unit: string
}

// Categories for edit/create flows list (id, name, products ids)
type UiCategory = { id: string; name: string; products: string[] }

export default function InventoryPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<UiProduct[]>([])
  const [categories, setCategories] = useState<UiCategory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("inventory")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Fetch products and categories from backend
  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      try {
        const json: { data: BackendProduct[]; totalPages?: number } = await apiFetchProducts({ limit, page, sort: "ASC", sortBy: "name", search: searchTerm || undefined })
        if (json.totalPages) setTotalPages(json.totalPages)
        const mapped: UiProduct[] = (json.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          categories: (p.categories || []).map((c) => ({ id: c.id, name: c.name, color: getCategoryColor(c.id || c.name) })),
          image: p.image || "/producto-limpieza.jpg",
          stock: p.stock,
          minStock: typeof p.minStock === 'number' ? p.minStock : Math.max(5, Math.floor(p.stock * 0.2)),
          unit: "unidades",
        }))
        setProducts(mapped)
      } catch (e) {
        console.error("Error fetching products", e)
      }
    }
    const fetchCategories = async () => {
      try {
        const list: { id: string; name: string; products?: { id: string }[] }[] = await apiFetchCategories()
        const mapped: UiCategory[] = list.map((c) => ({
          id: c.id,
          name: c.name,
          products: (c.products || []).map((p) => p.id),
        }))
        setCategories(mapped)
      } catch (e) {
        console.error("Error fetching categories", e)
      }
    }
    fetchProducts()
    fetchCategories()
    return () => controller.abort()
  }, [page, limit, searchTerm])

  const handleCreateProduct = async (newProduct: {
    name: string
    description: string
    stock: number
    image: string
  categories: string[]
  minStock?: number
  }) => {
    try {
      const created: BackendProduct = await apiCreateProduct({
        name: newProduct.name,
        description: newProduct.description,
        stock: newProduct.stock,
        image: newProduct.image || undefined,
        categories: newProduct.categories.length ? newProduct.categories : undefined,
    minStock: newProduct.minStock,
      })

      const mapped: UiProduct = {
        id: created.id,
        name: created.name,
        categories: (created.categories || []).map((c) => ({ id: c.id, name: c.name })),
        image: created.image || "/producto-limpieza.jpg",
        stock: created.stock,
  minStock: typeof created.minStock === 'number' ? created.minStock : Math.max(5, Math.floor(created.stock * 0.2)),
        unit: "unidades",
      }

      setProducts((prev) => [mapped, ...prev])
      setActiveTab("inventory")
    } catch (e) {
      console.error("Error creating product", e)
    }
  }

  const handleUpdateProduct = async (
    productId: string,
    updatedProduct: {
      name: string
      description: string
      stock: number
      image: string
  categories: string[]
  minStock?: number
    },
  ) => {
    // Optimistic
    const prev = products
    setProducts((cur) =>
      cur.map((p) =>
        p.id === productId
          ? {
              ...p,
              name: updatedProduct.name,
              stock: updatedProduct.stock,
              image: updatedProduct.image || p.image,
              categories: p.categories.map((c) => c),
            }
          : p,
      ),
    )
    try {
      const updated: BackendProduct = await apiUpdateProduct(productId, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        stock: updatedProduct.stock,
        image: updatedProduct.image || undefined,
        categories: updatedProduct.categories,
        minStock: updatedProduct.minStock,
      })
      // Sync from server categories if needed
      setProducts((cur) =>
        cur.map((p) =>
          p.id === productId
            ? {
                ...p,
                name: updated.name,
                stock: updated.stock,
                image: updated.image || p.image,
                categories: (updated.categories || []).map((c) => ({ id: c.id, name: c.name })),
                minStock: typeof updated.minStock === 'number' ? updated.minStock : p.minStock,
              }
            : p,
        ),
      )
    } catch (e) {
      console.error("Error updating product", e)
      setProducts(prev)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    const prev = products
    setProducts((cur) => cur.filter((p) => p.id !== productId))
    try {
      await apiDeleteProduct(productId)
    } catch (e) {
      console.error("Error deleting product", e)
      setProducts(prev)
    }
  }

  const handleCreateCategory = async (newCategory: { name: string; products: string[] }) => {
    try {
      const created: { id: string; name: string; products?: { id: string }[] } = await apiCreateCategory({
        name: newCategory.name,
        products: newCategory.products.length ? newCategory.products : undefined,
      })
      const mapped: UiCategory = {
        id: created.id,
        name: created.name,
        products: (created.products || []).map((p) => p.id),
      }
      setCategories((prev) => [mapped, ...prev])
      // Update products' categories membership locally
      const newProductIds = new Set(mapped.products)
      setProducts((cur) =>
        cur.map((p) => {
          const hasCat = p.categories.some((c) => c.id === mapped.id)
          const shouldHave = newProductIds.has(p.id)
          if (shouldHave && !hasCat) {
            return { ...p, categories: [...p.categories, { id: mapped.id, name: mapped.name }] }
          } else if (!shouldHave && hasCat) {
            return { ...p, categories: p.categories.filter((c) => c.id !== mapped.id) }
          }
          return p
        })
      )
      setActiveTab("inventory")
    } catch (e) {
      console.error("Error creating category", e)
    }
  }

  const handleUpdateCategory = async (
    categoryId: string,
    updatedCategory: { name: string; products: string[] },
  ) => {
    const prev = categories
    setCategories((cur) =>
      cur.map((c) => (c.id === categoryId ? { ...c, name: updatedCategory.name, products: updatedCategory.products } : c)),
    )
    try {
      const updated: { id: string; name: string; products?: { id: string }[] } = await apiUpdateCategory(categoryId, {
        name: updatedCategory.name,
        products: updatedCategory.products,
      })
      setCategories((cur) =>
        cur.map((c) =>
          c.id === categoryId
            ? { id: updated.id, name: updated.name, products: (updated.products || []).map((p) => p.id) }
            : c,
        ),
      )
      // Sync product list categories to reflect new membership for this category
      const updatedProductIds = new Set((updated.products || []).map((p) => p.id))
      setProducts((cur) =>
        cur.map((p) => {
          const hasCat = p.categories.some((c) => c.id === updated.id)
          const shouldHave = updatedProductIds.has(p.id)
          if (shouldHave && !hasCat) {
            return { ...p, categories: [...p.categories, { id: updated.id, name: updated.name }] }
          } else if (!shouldHave && hasCat) {
            return { ...p, categories: p.categories.filter((c) => c.id !== updated.id) }
          }
          return p
        })
      )
    } catch (e) {
      console.error("Error updating category", e)
      setCategories(prev)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const prevCategories = categories
    const prevProducts = products
    const prevSelected = selectedCategories
    // Optimistic updates: remove category from list, from products, and from active filters
    setCategories((cur) => cur.filter((c) => c.id !== categoryId))
    setProducts((cur) => cur.map((p) => ({ ...p, categories: p.categories.filter((c) => c.id !== categoryId) })))
    setSelectedCategories((cur) => cur.filter((id) => id !== categoryId))
    try {
      await apiDeleteCategory(categoryId)
    } catch (e) {
      console.error("Error deleting category", e)
      // Rollback on error
      setCategories(prevCategories)
      setProducts(prevProducts)
      setSelectedCategories(prevSelected)
    }
  }

  const handleStockChange = (productId: string, newStock: number) => {
    setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, stock: newStock } : product)))
  }

  // Update stock via backend and sync UI
  const handleStockChangePersist = async (productId: string, newStock: number) => {
    // Optimistic UI update
    const prev = products
    setProducts((cur) => cur.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)))
    try {
      const updated: BackendProduct = await apiUpdateProduct(productId, { stock: newStock })
      // Sync minStock if backend recalculated or returned it
      setProducts((cur) => cur.map((p) => (p.id === productId ? { ...p, minStock: typeof updated.minStock === 'number' ? updated.minStock : p.minStock } : p)))
    } catch (e) {
      console.error("Error saving stock", e)
      // Rollback on error
      setProducts(prev)
      throw e
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((selectedCat) => product.categories.some((productCat) => productCat.id === selectedCat))
    return matchesSearch && matchesCategory
  })

  // Categories source for filters and product forms (from backend)
  const filterCategories = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories]
  )

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleClearCategories = () => {
    setSelectedCategories([])
  }

  const totalProducts = products.length
  const inStock = products.filter((p) => p.stock > p.minStock).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalProducts={totalProducts}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={
          "transition-all duration-300 ease-in-out " +
          (sidebarCollapsed ? "lg:ml-16" : "lg:ml-64")
        }
      >
        <div className="w-full px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 mt-6 lg:mt-0">
            <div className="flex items-center justify-between mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                {/* Theme toggle (Light/Dark) */}
                <ThemeToggle />

                {/* Auth actions */}
                {!session?.user ? (
                  <Link href="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      {session.user.name || session.user.email || "Usuario"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      Salir
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {activeTab === "inventory" && "Inventario de Productos"}
              {activeTab === "create" && "Crear Nuevo Producto"}
              {activeTab === "edit" && "Editar Producto"}
              {activeTab === "create-category" && "Crear Nueva Categoría"}
              {activeTab === "edit-category" && "Editar Categoría"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "inventory" && "Administra tu inventario de productos de limpieza"}
              {activeTab === "create" && "Agrega un nuevo producto al inventario"}
              {activeTab === "edit" && "Modifica los datos de un producto existente"}
              {activeTab === "create-category" && "Crea una nueva categoría para organizar productos"}
              {activeTab === "edit-category" && "Modifica o elimina categorías existentes"}
            </p>
          </div>

          {/* Content based on active tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar productos de limpieza..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {selectedCategories.length > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {selectedCategories.length}
                      </span>
                    )}
                  </Button>
                </div>

                {showFilters && (
                  <Card>
                    <CardContent className="p-4">
                      <CategoryFilter
                        categories={filterCategories}
                        selectedCategories={selectedCategories}
                        onCategoryToggle={handleCategoryToggle}
                        onClearAll={handleClearCategories}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{totalProducts}</div>
                  <div className="text-sm text-muted-foreground">Total productos</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{inStock}</div>
                  <div className="text-sm text-muted-foreground">Stock normal</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-orange-600">{lowStock}</div>
                  <div className="text-sm text-muted-foreground">Stock bajo</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
                  <div className="text-sm text-muted-foreground">Agotados</div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
                {filteredProducts.map((product) => (
                  <CleaningProductCard key={product.id} product={product} onStockChange={handleStockChangePersist} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Siguiente
                </Button>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground text-lg">
                    No se encontraron productos que coincidan con los filtros
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "create" && (
            <div className="space-y-6">
              <ProductForm availableCategories={filterCategories} onSubmit={handleCreateProduct} />
            </div>
          )}

          {activeTab === "edit" && (
            <div className="space-y-6">
              <ProductEditForm
                products={products}
                availableCategories={filterCategories}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            </div>
          )}

          {activeTab === "create-category" && (
            <div className="space-y-6">
              <CategoryForm
                availableProducts={products.map((p) => ({ id: p.id, name: p.name }))}
                onSubmit={handleCreateCategory}
              />
            </div>
          )}

          {activeTab === "edit-category" && (
            <div className="space-y-6">
              <CategoryEditForm
                categories={categories}
                availableProducts={products.map((p) => ({ id: p.id, name: p.name }))}
                onUpdate={handleUpdateCategory}
                onDelete={handleDeleteCategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
