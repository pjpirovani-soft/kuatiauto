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
| D-P1 | Alcance MVP = gestión + directorio + portal + catálogo + inventario (los 4 componentes del PROMPT MAESTRO). | APROBADA |
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


## Decisiones de F2 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F2-1 | Roles del MVP: `admin_general`, `propietario`, `empleado`, `conductor`, `visitante`. `verificador_catalogo` → v2 | APROBADA por delegación |
| D-F2-2 | Authn con Supabase Auth para todos los roles con cuenta. Authz con RLS + server actions (doble capa) | APROBADA por delegación |
| D-F2-3 | Operaciones auditables: 8 listadas en ARCHITECTURE sección Autorización | APROBADA por delegación |
| D-F2-4 | Conductor ve historial solo si autorizó. Establecimiento no ve historial cross-tenant (R8) | APROBADA por delegación |
| D-F2-5 | Directorio con coordenadas aproximadas. Exactas solo para autenticados (R10) | APROBADA por delegación |

## Decisiones de F3 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F3-1 | 1 empresa → N establecimientos. En MVP, 1 usuario = 1 empresa. Multi-empresa → v2 | APROBADA por delegación |
| D-F3-2 | RLS por empresa_id en tablas de negocio. Catálogo global: SELECT true, escritura admin_general. Directorio: SELECT true con coordenadas aproximadas. Portal: RLS por conductor_id | APROBADA por delegación |
| D-F3-3 | Una sola función SECURITY DEFINER en MVP: crear_empresa_con_establecimiento. search_path fijo, permisos solo authenticated | APROBADA por delegación |
| D-F3-4 | Pruebas cruzadas obligatorias antes de cerrar F3. 2 sesiones, todas las tablas, documentadas en BITACORA.md | APROBADA por delegación |
| D-F3-5 | RLS diferencia por empresa_id, no por rol. Roles se validan en server actions. Excepción: historial_compartido | APROBADA por delegación |

## Decisiones de F4 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F4-1 | Modelo de amenazas: OWASP Top 10 completo + ASVS nivel 2 + amenazas del dominio (R7-R14) | APROBADA por delegación |
| D-F4-2 | Límites de confianza: frontend no confiable, server actions confiables pero validan, Supabase confiable (RLS última línea), service_role solo server-side, terceros con permisos mínimos | APROBADA por delegación |
| D-F4-3 | Rate limiting: login 5/min IP, registro 3/min IP, recuperación 3/min IP, API 100/min usuario, crear empresa 10/min, invitar empleado 10/min, publicar directorio 20/min. Implementación: middleware + tabla rate_limit | APROBADA por delegación |
| D-F4-4 | Auditoría: tabla audit_log con 9 operaciones auditables, retención 1 año, solo admin_general lee, INSERT vía SECURITY DEFINER o server action con service_role | APROBADA por delegación |
| D-F4-5 | Recuperación: backups diarios Supabase (7 días free), rotación de secretos 90 días, plan de respuesta documentado, notificación de incidentes críticos en 72h | APROBADA por delegación |

## Decisiones de F5a (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F5a-1 | DDL en migraciones numeradas por fase (001-006 en F5a). `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at` con trigger. | APROBADA por delegación |
| D-F5a-2 | Triggers: `set_updated_at`, `handle_new_user`, `crear_empresa_con_establecimiento` (SECURITY DEFINER), `poblar_vehiculo_identidad`, `actualizar_stock`. | APROBADA por delegación |
| D-F5a-3 | FKs a tablas de catálogo (servicio_global, producto_global) se agregan en F5b, no en F5a, para evitar dependencia circular. En F5a solo se crean las columnas. | APROBADA por delegación |

## Decisiones de F5b (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F5b-1 | Catálogo automotriz completo: jerarquía fabricante → marca → modelo → version → motorizacion. Especificaciones con fuente, fecha, estado de validación y verificador. | APROBADA por delegación |
| D-F5b-2 | Directorio con coordenadas aproximadas (lat/lng con 5 decimales, barrio, ciudad, departamento). No expone coordenadas exactas (R10). | APROBADA por delegación |
| D-F5b-3 | Portal del conductor con tabla propia (conductor), distinta de usuario de empresa. El conductor autoriza/revoca historial_compartido (R8). | APROBADA por delegación |

## Decisiones de F5c (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F5c-1 | RLS en todas las tablas. 2 helpers (`current_empresa_id`, `is_admin_general`). Políticas por tabla y operación, siguiendo el modelo de F3. `rate_limit` sin políticas (solo service_role). | APROBADA por delegación |
| D-F5c-2 | Seed del catálogo: 15 fabricantes, 5 marcas, 3 modelos, 10 servicios globales, 8 productos globales (marca `[PENDIENTE]`). Especificaciones de lubricantes vacías hasta F6 (no inventar). | APROBADA por delegación |
| D-F5c-3 | `check_rate_limit(clave, max, ventana_segundos)` SECURITY DEFINER. `cleanup_rate_limit()` para limpieza periódica. | APROBADA por delegación |

## Decisiones de F6a (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F6-1 | Fuentes aceptables: niveles 1-3 (manual del fabricante, fabricante del lubricante, bases técnicas). Nivel 4 (foros) no aceptable. Cada especificación con fuente, fecha, estado, verificador. | APROBADA por delegación |
| D-F6-2 | Validación por admin_general en MVP. `pendiente` → `verificado` o `disputado`. Contradicción → `disputado`. Revisión anual. | APROBADA por delegación |
| D-F6-3 | Alcance inicial: 10 fabricantes comunes en Paraguay, 2-3 modelos cada uno, solo especificaciones de aceite de motor. Ampliación en v2. | APROBADA por delegación |
| D-F6-4 | Carga manual por admin en MVP. Importación CSV en v2. Versionado por fila nueva. Auditoría en audit_log. | APROBADA por delegación |

## Decisiones de F7 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F7-1 | Stack core = Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase + Zod + Vitest + Vercel | APROBADA por delegación |
| D-F7-2 | Correo transaccional = Resend (free tier 100 emails/día, 3000/mes) | APROBADA por delegación |
| D-F7-3 | Mapas = Leaflet + OpenStreetMap en MVP. Mapbox en v2 | APROBADA por delegación |
| D-F7-4 | Analítica = Vercel Analytics. Monitoreo = Sentry free tier. CI/CD = GitHub Actions | APROBADA por delegación |

## Decisiones de F8 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F8-1 | Todo free tier. Único costo real en MVP: dominio `.com.py` (~$2/mes). No se paga nada más. | APROBADA por delegación |
| D-F8-2 | Monitoreo mensual de límites. Si se acerca al límite, evaluar. No pagar por adelantado. | APROBADA por delegación |
| D-F8-3 | Si el proyecto escala, se evalúan escenarios 3 y 4. Hasta entonces, $0/mes. | APROBADA por delegación |

## Decisiones de F9 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F9-1 | Datos personales: email, nombre, teléfono, patente, VIN (interno), km_actual, IP/user_agent (audit_log), coordenadas aproximadas. Nada más. | APROBADA por delegación |
| D-F9-2 | Retención: mientras cuenta/vehículo activo. audit_log 1 año. Eliminación: soft delete + anonimización en 30 días. | APROBADA por delegación |
| D-F9-3 | Derechos: acceso, rectificación, eliminación, oposición, portabilidad (v2). | APROBADA por delegación |
| D-F9-4 | Consentimiento en registro (términos + privacidad) y en conductor (historial compartido). Sin cookies de tracking en MVP. | APROBADA por delegación |
## Pendientes de verificar

| ID | Decisión | Estado |
|---|---|---|
| P-Nombre | Verificar `@kuatiauto` en redes y DINAPI | PENDIENTE |
| P-Piloto | Confirmar los 5 campos críticos de `CLIENTE.md` | PENDIENTE |
| P-Dominio | Registrar `kuatiauto.com.py` | PENDIENTE |
| P-Alcance-MVP | Directorio y portal son MVP (resuelto 2026-10-30). | APROBADA |
| P-Catálogo | Catálogo completo desde MVP: fabricantes, marcas, modelos, motores, especificaciones, fuentes (resuelto 2026-10-30). | APROBADA |
| P-Inventario | Inventario y movimientos de stock en MVP (resuelto 2026-10-30). | APROBADA |