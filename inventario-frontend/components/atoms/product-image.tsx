import { cn } from "@/lib/utils"

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className, priority = false }: ProductImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}
