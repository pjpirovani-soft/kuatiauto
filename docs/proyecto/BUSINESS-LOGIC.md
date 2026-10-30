# BUSINESS-LOGIC — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

## Dominio

Plataforma SaaS multiempresa para el sector de mantenimiento automotor en Paraguay. Cuatro componentes: gestión para establecimientos, directorio público, portal del conductor, catálogo automotriz técnico.

## Catálogo automotriz (F6a — 2026-10-30)

El catálogo es información crítica: una especificación incorrecta puede dañar un motor y generar responsabilidad comercial. Por eso se trata con reglas estrictas.

### Jerarquía de fuentes

| Nivel | Fuente | Aceptable |
|---|---|---|
| 1 | Manual del fabricante del vehículo (PDF oficial), boletín técnico del fabricante | Sí |
| 2 | Fabricante del lubricante con aprobación del fabricante del vehículo (Mobil, Shell, Castrol, etc.) | Sí |
| 3 | Bases de datos técnicas reconocidas (Lubrizol, API, ACEA) | Sí |
| 4 | Foros, tutoriales, "lo que dice el mecánico" | **No** |

Cada especificación debe tener:
- `fuente` (texto: URL o referencia documental)
- `fecha_consulta` (date)
- `estado_validacion` (`pendiente` | `verificado` | `disputado`)
- `verificado_por` (uuid del admin que verificó, nullable)

### Proceso de validación

1. El admin carga la especificación con `estado_validacion = 'pendiente'`, fuente y fecha.
2. El admin revisa la fuente. Si es de nivel 1-3, marca `verificado`. Si no, marca `disputado`.
3. Si dos fuentes contradicen, se marca `disputado` y se documenta la contradicción en `observaciones` (campo a agregar en F6b si se necesita).
4. Revisión anual o ante reporte de error.

En MVP, **solo el `admin_general`** verifica el catálogo. `verificador_catalogo` → v2.

### Alcance inicial

- **Fabricantes:** los 10 más comunes en Paraguay (Toyota, Chevrolet, Ford, Volkswagen, Hyundai, Kia, Nissan, Honda, Fiat, Peugeot).
- **Modelos:** 2-3 por fabricante (los más vendidos en Paraguay).
- **Especificaciones:** solo las que el piloto atiende (cambios de aceite de motor). No se cargan especificaciones de transmisión, frenos, etc. en MVP.
- **Ampliación:** v2, con datos reales del piloto y de otros establecimientos.

### Proceso de carga

- **MVP:** manual por admin (SQL directo o UI de admin en F7+).
- **v2:** importación desde CSV/Excel.
- **Versionado:** cada cambio de especificación agrega fila nueva (histórico). No se sobrescribe. Se audita en `audit_log`.
- **Revisión:** anual o ante reporte de error.

### Reglas duras

- No inventar especificaciones. Si no hay fuente, no se carga.
- No asumir que una especificación es universal. Cada motorización puede tener una especificación distinta.
- No cargar datos de nivel 4 (foros).
- No cargar datos sin `fuente` y `fecha_consulta`.
- El estado `verificado` requiere revisión humana del admin.

## Reglas de negocio

- Un cliente pertenece a una empresa (RLS).
- Un vehículo pertenece a una empresa y a un cliente de esa empresa (RLS).
- Una orden pertenece a una empresa y a un vehículo de esa empresa (RLS).
- Los servicios/productos de una orden pueden ser globales o locales de la empresa. Nunca de otra empresa.
- El admin general no ve datos de negocio de las empresas, solo gestiona catálogo global y empresas.

## Entidades principales

Ver `SPEC.md` sección 10 y `supabase/migrations/`.

## Flujos clave

Ver `SPEC.md` sección 9.

## Roles y permisos

Ver `SPEC.md` sección 3.

## Decisiones de F6a (por delegación)

- **D-F6-1:** fuentes aceptables niveles 1-3. Nivel 4 (foros) no aceptable. Cada especificación con fuente, fecha, estado y verificador.
- **D-F6-2:** validación por admin_general en MVP. Dato cargado `pendiente`, admin revisa y marca `verificado` o `disputado`. Contradicción → `disputado`. Revisión anual.
- **D-F6-3:** alcance inicial: 10 fabricantes comunes en Paraguay, 2-3 modelos cada uno, solo especificaciones de aceite de motor. Ampliación en v2.
- **D-F6-4:** carga manual por admin en MVP. Importación CSV en v2. Versionado por fila nueva. Auditoría en audit_log.