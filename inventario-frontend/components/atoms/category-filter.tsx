"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Category {
  id: string
  name: string
  color?: "primary" | "secondary" | "accent"
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
  onClearAll: () => void
}

export function CategoryFilter({ categories, selectedCategories, onCategoryToggle, onClearAll }: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filtrar por categorías</h3>
        {selectedCategories.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id)
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle(category.id)}
              className="text-xs"
            >
              {category.name}
              {isSelected && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  ✓
                </Badge>
              )}
            </Button>
          )
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedCategories.length} categoría{selectedCategories.length !== 1 ? "s" : ""} seleccionada
          {selectedCategories.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  )
}
