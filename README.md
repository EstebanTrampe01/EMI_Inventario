# EMI Inventario (Mono Repo)

Monorepo con:
- Backend (`inventario-backend`): API NestJS mínima (Productos y Categorías).
- Frontend (`inventario-frontend`): Next.js (pendiente de alinear tras eliminación de auth).

## Estado Actual
- Eliminado: usuarios, autenticación, grupos, roles.
- Persisten sólo entidades: Product, Category.
- Endpoints públicos (sin seguridad aún).

## Próximos Pasos Sugeridos
1. Añadir endpoints CRUD de categorías (si se necesitan crear desde UI).
2. Implementar autenticación simple (ej: token estático o Basic Auth) antes de exponer públicamente.
3. Reemplazar `synchronize: true` por migraciones.
4. Ajustar frontend para consumir nuevos endpoints sin login.

## Estructura
```
inventario-backend/
	src/
		app/products
		app/category
		database/entities/{product,category}.entity.ts
inventario-frontend/
	app/
```

## Licencia
MIT