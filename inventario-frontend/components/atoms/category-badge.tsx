import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: {
    id: string
    name: string
    color?: "primary" | "secondary" | "accent"
  }
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CategoryBadge({ category, size = "md", className }: CategoryBadgeProps) {
  if (!category) {
    return null
  }

  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        colorClasses[category.color || "secondary"],
        sizeClasses[size],
        className,
      )}
    >
      {category.name}
    </span>
  )
}
