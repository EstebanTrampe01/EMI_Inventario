```mermaid
%% Diagrama de arquitectura para el repo EstebanTrampe01/DEMO_EMI
%% Componentes inferidos a partir de:
%% - inventario-frontend/package.json (Next.js, NextAuth, React, Tailwind, UI libs)
%% - inventario-backend/package.json (NestJS, TypeORM, MySQL, Passport/JWT, bcrypt, winston)
flowchart TD
  User[Usuario (Navegador)] -->|HTTP/HTTPS| Frontend[Frontend: Next.js (inventario-frontend)]
  Frontend -->|Autenticación| NextAuth[NextAuth (session, providers)]
  Frontend -->|REST / HTTP API| Backend[NestJS API (inventario-backend)]
  Backend -->|TypeORM| Database[(MySQL / mysql2)]
  Backend -->|Auth: passport-jwt / passport-local| Auth[Auth (JWT / bcrypt)]
  Backend -->|Logging| Logging[winston / nest-winston]
  Frontend -->|Static assets / SSR| CDN[Hosting / Vercel / Netlify / CDN]
  Repo[Repositorio: DEMO_EMI\n- inventario-frontend/\n- inventario-backend/\n- configs (tsconfig.json en cada carpeta)]:::repo
  CI[CI local: scripts (build/test) en package.json] --> Repo

  classDef repo fill:#fef3c7,stroke:#b45309,stroke-width:1px
  class Repo repo
```

## Resumen de lo que inspeccioné
He revisado los archivos clave del repositorio para inferir esta arquitectura:
- inventario-frontend/package.json — Next.js 15, React 18, NextAuth, Tailwind, varias librerías de UI (Heroui, Radix, lucide-react). Uso esperado: SPA/SSR con autenticación gestionada por NextAuth.
- inventario-backend/package.json — NestJS (v10), TypeORM, mysql2, passport (passport-jwt / passport-local), bcrypt, winston. Uso esperado: API REST (o GraphQL si se añadiera) con persistencia en MySQL y autenticación por JWT.
- tsconfig.json en ambos proyectos — configuración TS para frontend y backend separada.

## Notas y recomendaciones rápidas
- Endpoint API: el Frontend se comunica con el Backend vía HTTP (REST). Confirma la URL/basePath en envs (.env) para desplegar.
- Seguridad: JWT + bcrypt ya aparecen en dependencias; revisar expiraciones y secretos en variables de entorno.
- Observabilidad: winston está presente; podrías añadir integraciones para métricas/errores (Sentry / Prometheus) si necesitas más observabilidad.
- Deploy: el Frontend puede desplegarse en Vercel/Netlify (Next.js) y el Backend en un contenedor/docker o plataforma de Node (Heroku, DigitalOcean, etc.). Añadir workflows de CI/CD en .github/workflows facilitará despliegues automáticos.

He generado este diagrama y resumen basados en los package.json y tsconfig detectados. Si quieres, puedo:
- generar un README con instrucciones de ejecución (dev, build, envs) para cada subproyecto,
- crear un diagrama más detallado mostrando rutas/endpoints concretos si me indicas los controllers o archivos del backend a mapear,
- o producir un archivo docker-compose / Dockerfiles sugeridos para levantar frontend + backend + MySQL.

Dime cuál de esas opciones prefieres y genero el archivo correspondiente. 
````
