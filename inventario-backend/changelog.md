# Changelog API (Modelo Simplificado)

Desde esta versión se eliminó por completo la lógica de:
- Usuarios / autenticación
- Grupos / multi–tenant
- Roles y permisos

El dominio queda reducido únicamente a Productos y Categorías.

## Productos

### GET /products
Listado paginado y filtrado (opcional) por nombre.

Parámetros query soportados:
```json
{
  "search": "texto opcional",   // Filtra por nombre (opcional)
  "page": 1,                     // Página (default 1)
  "limit": 10,                   // Tamaño de página (default 10)
  "sort": "ASC",                // Orden (ASC | DESC, default ASC)
  "sortBy": "name"              // Campo de orden (default name)
}
```

Respuesta: objeto paginado con `data`, `total`, `page`, `limit`.

### POST /products
Crea un producto. Requiere cuerpo JSON:
```json
{
  "name": "Nombre",
  "description": "Descripción",
  "stock": 100,
  "image": "opcional",
  "categories": ["uuid-category-1", "uuid-category-2"]  // Opcional, array de IDs de categorías existentes
}
```

### PUT /products/:id
Actualiza campos del producto (mismo DTO parcial, incluyendo `categories` opcional).

### DELETE /products/:id
Realiza ocultado lógico (soft hide). El producto deja de aparecer en listados estándar.

## Categorías

### GET /categories
Lista todas las categorías no ocultas.

### POST /categories
Crea una categoría. Requiere cuerpo JSON:
```json
{
  "name": "Nombre único",
  "products": ["uuid-product-1", "uuid-product-2"]  // Opcional, array de IDs de productos existentes
}
```

### PUT /categories/:id
Actualiza campos de la categoría (mismo DTO parcial, incluyendo `products` opcional).

### DELETE /categories/:id
Realiza ocultado lógico (soft hide).

Relación ManyToMany con productos: Puedes enlazar desde productos (al crear/actualizar producto) o desde categorías (al crear/actualizar categoría). Los enlaces son opcionales; un producto/categoría puede existir sin enlaces.

## Eliminado en esta versión
| Concepto | Estado |
|----------|--------|
| Auth / JWT | Eliminado |
| Usuarios | Eliminado |
| Grupos | Eliminado |
| Roles / Guards | Eliminado |
| Parámetro groupId | Eliminado de todos los endpoints |

## Notas de Migración
1. Si consumías la API con `groupId`, deja de enviarlo.
2. Quita cualquier header/token previo: ya no se valida autenticación.
3. Ajusta la UI para no mostrar selección de grupos ni roles.

## Próximos Pasos (Planeado)
- Endpoint CRUD de categorías (si se requiere gestión dinámica).
- Posible reintroducción de autenticación ligera sólo para panel admin (se documentará aparte si ocurre).

Fin del changelog simplificado.