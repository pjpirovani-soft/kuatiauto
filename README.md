# Blueprint - Web App

Plantilla de web app para proyectos nuevos. Copiala a `clients/<nombre>/`
y despues `npm install` **dentro del cliente**, no aca.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL 15 + RLS + Auth) via @supabase/ssr
- Zod (validacion)

## Caracteristicas

- Auth completo: login, registro, logout.
- CRUD de clientes con RLS (cada usuario ve solo sus clientes).
- Middleware (proxy.ts) de proteccion de rutas.
- Validacion con Zod en frontend y backend.

## Estructura

    app/        layout, page, login, dashboard, api
    components/ formularios, tablas, ui/
    lib/        supabase/client.ts, supabase/server.ts, schema.ts
    public/     assets

## Uso

1. Copiar a `clients/<cliente>/`
2. `.env.example` -> `.env.local` y completar con credenciales de Supabase
3. `npm install`
4. `npm run dev` / `npm run build` / `npm test`

## Estado

- [x] Bloque 1 - estructura base + Zod schema + tests
- [x] Bloque 2 - Supabase + Auth + CRUD + RLS
- [x] Bloque 3 - proxy (middleware) + validacion completa
