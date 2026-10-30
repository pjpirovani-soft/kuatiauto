# AI-RULES — kuatiauto

Reglas para la IA en este proyecto.

## Idioma

- Espanol (Paraguay). Sin acentos en codigo, con acentos en docs cuando se pueda.

## Flujo de trabajo

- Un bloque a la vez. Esperar output.
- Verificar antes de asumir.
- Documentar decisiones en ARCHITECTURE.md.

## Codigo

- TypeScript estricto. No usar any sin justificar.
- Componentes funcionales, no clases.
- Server Components por defecto. Client Components solo cuando hay estado/eventos.
- Validacion con Zod en cliente y servidor.

## Tests

- Vitest + RTL. Un test por feature critica.
- Tests deben pasar antes de commitear.

## Seguridad

- **Regla de oro: nunca imprimir el VALOR de una key. Solo el NOMBRE.** Ver SEGURIDAD.md para comandos prohibidos.
- Nunca commitear .env.local ni secretos.
- RLS en Supabase para todo dato de usuario.
- Validar en servidor, no solo en cliente.

## Commits

- Conventional Commits.
- Un commit por feature o grupo logico.
