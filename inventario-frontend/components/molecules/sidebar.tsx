"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Package, Plus, Edit3, Tag, FolderPlus, Menu, X } from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  totalProducts: number
  onCollapseChange?: (collapsed: boolean) => void
}

const menuItems = [
  {
    id: "inventory",
    label: "Inventario",
    icon: Package,
    showCount: true,
  },
  {
    id: "create",
    label: "Crear Producto",
    icon: Plus,
    showCount: false,
  },
  {
    id: "edit",
    label: "Editar Producto",
    icon: Edit3,
    showCount: false,
  },
  {
    id: "create-category",
    label: "Crear Categoría",
    icon: FolderPlus,
    showCount: false,
  },
  {
    id: "edit-category",
    label: "Editar Categoría",
    icon: Tag,
    showCount: false,
  },
]

export function Sidebar({ activeTab, onTabChange, totalProducts, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    // Close mobile sidebar when selecting a tab
    if (isMobileOpen) {
      setIsMobileOpen(false)
    }
  }

  // Notify parent when collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 z-[45] transition-opacity duration-300 ease-in-out",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={toggleMobileSidebar}
      />

      {!isMobileOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-[60]">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobileSidebar}
            className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-[50] transition-all duration-300 ease-in-out",
          // Desktop behavior
          "hidden lg:flex lg:flex-col",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile behavior
          "lg:translate-x-0",
          isMobileOpen
            ? "flex flex-col w-64 translate-x-0 shadow-2xl"
            : "flex flex-col w-64 -translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100",
            )}
          >
            {!isCollapsed && (
              <>
                <h2 className="font-semibold text-foreground">Gestión</h2>
                <p className="text-xs text-muted-foreground">Productos de Limpieza</p>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={isMobileOpen ? toggleMobileSidebar : toggleSidebar}
            className={cn(
              "h-8 w-8 p-0 transition-all duration-300 ease-in-out hover:scale-110",
              isCollapsed && "lg:mx-auto",
              isMobileOpen && "lg:hidden",
            )}
          >
            <div className="transition-transform duration-200 ease-in-out">
              {isMobileOpen ? (
                <X className="h-4 w-4" />
              ) : isCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4 rotate-45" />
              )}
            </div>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <div
                  key={item.id}
                  className={cn(
                    "transition-all duration-200 ease-in-out",
                    isMobileOpen && `animate-in slide-in-from-left-5 duration-300`,
                  )}
                  style={{
                    animationDelay: isMobileOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full h-10 transition-all duration-200 ease-in-out",
                      isCollapsed ? "justify-center px-2" : "justify-start px-3",
                      isActive && "bg-secondary text-secondary-foreground shadow-sm",
                      "hover:scale-[1.02] active:scale-[0.98]",
                    )}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <div className="relative">
                      <Icon className="h-4 w-4" />
                      {isCollapsed && item.id === "inventory" && totalProducts > 0 && (
                        <span className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
                          {totalProducts > 99 ? "99+" : totalProducts}
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex-1 text-left ml-3 transition-all duration-300 ease-in-out",
                        isCollapsed ? "opacity-0 scale-95 w-0 ml-0" : "opacity-100 scale-100",
                      )}
                    >
                      {!isCollapsed && (
                        <span className="flex items-center">
                          {item.label}
                          {item.showCount && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 transition-all duration-200 ease-in-out hover:scale-110">
                              {totalProducts}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </Button>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "p-4 border-t border-border transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100",
          )}
        >
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              <div>Sistema de Inventario</div>
              <div>v1.0.0</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
