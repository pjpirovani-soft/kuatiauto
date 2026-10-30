# DECISIONES — KuatiAuto

Registro de decisiones del proyecto. Cada decisión tiene un estado:
- **APROBADA:** confirmada explícitamente por el propietario.
- **PROPUESTA:** recomendación pendiente de aprobación.
- **PENDIENTE / VERIFICAR:** requiere información o investigación.
- **DESCARTADA:** evaluada y rechazada.

## Heredadas del PROMPT MAESTRO (D1-D12)

| ID | Decisión | Estado |
|---|---|---|
| D1 | Alcance geográfico: Paraguay (usuarios extranjeros OK, establecimientos solo PY) | APROBADA |
| D2 | Modelo multiempresa en una sola plataforma; un Supabase | APROBADA |
| D3 | PostgreSQL vía Supabase como BD inicial | APROBADA |
| D4 | Presupuesto mínimo, free tier al inicio | APROBADA |
| D5 | Cloudinary para imágenes (evaluar por tipo) | APROBADA con matiz |
| D6 | Módulos mínimos: clientes, vehículos, servicios, próximos mantenimientos | APROBADA (estructura a diseñar) |
| D7 | Directorio con búsqueda por ubicación (mecanismo a definir) | APROBADA con matiz |
| D8 | Catálogo automotriz con trazabilidad y fuentes | APROBADA |
| D9 | Facturación tributaria oficial FUERA del MVP | APROBADA |
| D10 | Diseñar y documentar antes de programar | APROBADA |
| D11 | Repo único, app Next modular | APROBADA |
| D12 | Método B de trabajo: fases → docs → aprobación → commit | APROBADA |

## Metodología (D-A a D-D)

| ID | Decisión | Estado |
|---|---|---|
| D-A | Alinear studio a metodología ENC | APROBADA |
| D-B | Seguridad integrada en ARCHITECTURE + SPEC + BITACORA + SESSION-STATE. Sin SEGURIDAD.md | APROBADA |
| D-C | CLIENTE.md provisional con `[PENDIENTE]` | APROBADA |
| D-D | `KuatiAuto` es nombre de trabajo, no comercial definitivo | APROBADA |

## Producto (D-P1 a D-P3, D-F1-1 a D-F1-3)

| ID | Decisión | Estado |
|---|---|---|
| D-P1 | Alcance MVP = gestión + catálogo mínimo + admin mínimo. Directorio y portal → v2 | PROPUESTA |
| D-P2 | Vehículo híbrido: pertenencia por empresa (MVP) + `vehiculo_identidad` (v2) | PROPUESTA |
| D-P3 | Piloto provisional con `[PENDIENTE]` | APROBADA |
| D-F1-1 | Flujo MVP: 7 pasos. Sin factura/recibo, sin impresión/PDF, sin métricas en dashboard. Próximo mantenimiento sugerido automático | PROPUESTA |
| D-F1-2 | Orden de trabajo: 9 campos. `orden_servicio` y `orden_producto` en tablas aparte. `importe_total` único | PROPUESTA |
| D-F1-3 | Catálogo híbrido: global (admin) + local (empresa). Seed manual | PROPUESTA |

**Nota:** las decisiones marcadas PROPUESTA fueron tomadas por delegación pero no confirmadas explícitamente. Deben revisarse contra el PROMPT MAESTRO, que trata directorio y portal como componentes principales, no como v2. Si el propietario las confirma, pasan a APROBADA. Si las rechaza, pasan a DESCARTADA y se revierten.

## ADRs (en ARCHITECTURE.md)

| ID | Decisión | Estado |
|---|---|---|
| ADR-001 | Repo único con app Next modular | APROBADA |
| ADR-002 | Vehículo híbrido | PROPUESTA |
| ADR-003 | Piloto provisional | APROBADA |
| ADR-004 | Nombre KuatiAuto provisional | APROBADA |
| ADR-005 | Catálogo híbrido global + local | PROPUESTA |
| ADR-006 | Productos y servicios en tablas aparte | PROPUESTA |

## Pendientes de verificar

| ID | Decisión | Estado |
|---|---|---|
| P-Nombre | Verificar `@kuatiauto` en redes y DINAPI | PENDIENTE |
| P-Piloto | Confirmar los 5 campos críticos de `CLIENTE.md` | PENDIENTE |
| P-Dominio | Registrar `kuatiauto.com.py` | PENDIENTE |
| P-Alcance-MVP | ¿Directorio y portal v2 (D-P1) o MVP (PROMPT MAESTRO)? | PENDIENTE |
| P-Catálogo | ¿Catálogo mínimo o completo? | PENDIENTE |
| P-Inventario | ¿Inventario y stock en MVP o v2? | PENDIENTE |