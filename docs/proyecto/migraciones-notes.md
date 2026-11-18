# Notas de migraciones — KuatiAuto

Documenta peculiaridades del historial de migraciones que no son obvias leyendo el codigo.

## Gap 027

La numeracion salta de `026` a `028`. **No hay `027` local ni remoto.** Es intencional o un error de tipeo al crear `028`. **No se renumeran** las 5 migraciones posteriores (`028`–`032`) porque ya estan aplicadas en produccion y renumerar requiere modificar `supabase_migrations.schema_migrations` en prod (riesgo alto, ganancia nula).

**Estado:** local == remoto (`001`–`026`, `028`–`032`). Verificado con `npx supabase migration list --linked` el 2026-11-18.

## 021 y 025: `fix_crear_empresa_invariante`

Dos migraciones con el mismo proposito, `021` original y `025` reescritura.

- **`021`** (`021_fix_crear_empresa_invariante.sql`): primera version del invariante KU-SEC-02. Persiste `telefono` en el `establecimiento` por defecto.
- **`025`** (`025_fix_crear_empresa_invariante.sql`): `CREATE OR REPLACE FUNCTION`, supersede a la 021. **No persiste `telefono`** (bug funcional menor, ver H-025-1).
- **Estado en prod:** la funcion vigente es la de 025. Verificado con `npx supabase db query --linked "SELECT pg_get_functiondef(p.oid) FROM pg_proc p WHERE p.proname = 'crear_empresa_con_establecimiento';"` el 2026-11-18.
- **Grants:** los `GRANT EXECUTE TO authenticated` de la 021 **siguen vigentes** porque `CREATE OR REPLACE FUNCTION` no toca grants.

## H-025-1: telefono no persiste en establecimiento

- **Origen:** migracion 025.
- **Impacto:** cuando un usuario crea empresa via `crear_empresa_con_establecimiento(p_nombre, p_ruc, p_direccion, p_telefono)`, el telefono se guarda en `empresa.telefono` pero **NO en `establecimiento.telefono`**.
- **Severidad:** baja (cosmetico/funcional menor).
- **Fix pendiente:** migracion 033 que reescriba la funcion incluyendo `telefono` en el INSERT de establecimiento.
- **Tracking:** DEUDA.md P3-1.

## Reglas

1. **No renumerar migraciones aplicadas.** Gap 027 queda como esta.
2. **`CREATE OR REPLACE FUNCTION` supersede, no borra grants.** Si una migracion posterior redefine una funcion, los permisos otorgados antes siguen vigentes. Documentar en el SQL si es intencional.
3. **Toda migracion nueva con `SECURITY DEFINER`** debe fijar `search_path` y revocar de `public` explicitamente (patron de las 019, 020, 021).
4. **Verificar local == remoto** con `npx supabase migration list --linked` antes de cada release.