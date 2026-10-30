# SPEC — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

Especificación funcional. Estado: **Fase 1 — producto definido**. Fases 2-14 refinan y cierran.

## 1. Identidad del producto

- **Nombre:** KuatiAuto (provisional)
- **Qué es:** Plataforma SaaS multiempresa de gestión y mantenimiento automotor para Paraguay.
- **Qué NO es:** No es un ERP de taller, no emite facturación tributaria oficial (D9), no es un marketplace de repuestos en MVP.

## 2. Alcance MVP (D-P1, P-Alcance-MVP, P-Catálogo, P-Inventario)

Módulos incluidos (los 4 componentes del PROMPT MAESTRO):

1. **SaaS de gestión multiempresa** — auth, empresa, establecimiento, usuarios, clientes, vehículos, órdenes de trabajo, historial, inventario y movimientos de stock, administración.
2. **Directorio público de establecimientos** — búsqueda por ubicación, geolocalización, filtros, perfil público, contacto, horarios.
3. **Portal del conductor** — cuenta propia, vehículos, historial, próximos mantenimientos, recordatorios, información técnica, localización de establecimientos.
4. **Catálogo automotriz técnico completo** — fabricantes, marcas, modelos, años, versiones, motorizaciones, cilindradas, combustibles, especificaciones de lubricantes (SAE, API, ACEA, aprobaciones), capacidades, intervalos. Con fuentes, fecha y estado de validación.

Fuera del MVP (v2 o permanente):

- Facturación electrónica (fuera incluso de v2 según D9).
- Marketplace de repuestos, seguros, grúas.
- Impresión/PDF de orden de trabajo.
- Recibo simple.
- Notificaciones push nativas (email transaccional en MVP, push en v2).

## 3. Usuarios, roles y permisos (F2 — 2026-10-30)

### Roles definitivos del MVP

| Rol | Componente | Cuenta | Descripción |
|---|---|---|---|
| `admin_general` | Plataforma | Sí | Gestiona empresas, catálogo global, moderación del directorio. No ve datos de negocio de empresas. |
| `propietario` | Gestión | Sí | Dueño del establecimiento. CRUD de su empresa, empleados, clientes, vehículos, órdenes, stock, catálogo local. |
| `empleado` | Gestión | Sí | Opera dentro de una empresa. Mismo permiso que propietario salvo gestión de usuarios y empresa. |
| `conductor` | Portal | Sí | Dueño de vehículos. Ve su historial, autoriza/revoca compartir con establecimientos. |
| `visitante` | Directorio | No | Sin cuenta. Ve el directorio público (establecimientos, servicios, ubicación aproximada). |

`verificador_catalogo` → v2. En MVP, el admin general verifica el catálogo manualmente.

### Separación autenticación / autorización

- **Autenticación (authn):** Supabase Auth (email/password) para `admin_general`, `propietario`, `empleado`, `conductor`. `visitante` no tiene cuenta.
- **Autorización (authz):** dos capas.
  1. **RLS** en todas las tablas con datos de usuario o empresa. Primera línea, no negociable.
  2. **Server actions** validan permisos antes de escribir. Segunda línea, defensa en profundidad.
- **Regla:** el frontend nunca decide. El `empresa_id` que llega del navegador no se confía. Se valida en server contra el `usuario.empresa_id` de la sesión.

### Matriz de permisos (rol × entidad × operación)

**Leyenda:** V=ver, C=crear, E=editar, D=eliminar, R=restringido (solo sus datos), ❌=denegado.

#### Gestión

| Entidad | admin_general | propietario | empleado | conductor | visitante |
|---|---|---|---|---|---|
| `empresa` | V todas, C, deshabilitar | V/E la suya | V la suya | ❌ | ❌ |
| `establecimiento` | V todos | CRUD los suyos | V los suyos | ❌ | ❌ |
| `usuario` | V todos, deshabilitar | CRUD empleados de su empresa | V/E su perfil | V/E su perfil | ❌ |
| `cliente` | ❌ | CRUD los suyos | CRUD los suyos | ❌ | ❌ |
| `vehiculo` (gestión) | ❌ | CRUD los suyos | CRUD los suyos | ❌ | ❌ |
| `vehiculo_identidad` | ❌ | auto (trigger) | auto (trigger) | ❌ | ❌ |
| `orden_trabajo` | ❌ | CRUD las suyas | CRUD las suyas | V las de sus vehículos (si compartido) | ❌ |
| `orden_servicio` | ❌ | cascada de orden | cascada de orden | V cascada | ❌ |
| `orden_producto` | ❌ | cascada de orden | cascada de orden | V cascada | ❌ |
| `stock_movimiento` | ❌ | CRUD los suyos | CRUD los suyos | ❌ | ❌ |

#### Catálogo

| Entidad | admin_general | propietario | empleado | conductor | visitante |
|---|---|---|---|---|---|
| `fabricante`, `marca`, `modelo`, `version`, `motorizacion` | CRUD | V | V | V | V |
| `especificacion_lubricante` | CRUD | V | V | V | V |
| `servicio_global`, `producto_global` | CRUD | V | V | V | ❌ |
| `servicio_empresa`, `producto_empresa` | ❌ | CRUD los suyos | CRUD los suyos | ❌ | ❌ |

#### Directorio

| Entidad | admin_general | propietario | empleado | conductor | visitante |
|---|---|---|---|---|---|
| `establecimiento_publico` | V todos, moderar, despublicar | publicar/despublicar el suyo | ❌ | ❌ | V (coordenadas aproximadas) |

#### Portal

| Entidad | admin_general | propietario | empleado | conductor | visitante |
|---|---|---|---|---|---|
| `conductor` | V todos, deshabilitar | ❌ | ❌ | V/E su perfil | ❌ |
| `vehiculo_conductor` | ❌ | ❌ | ❌ | CRUD los suyos | ❌ |
| `historial_compartido` | ❌ | V si el conductor autorizó | V si el conductor autorizó | autorizar/revocar | ❌ |

### Reglas de negocio por rol

- **Aislamiento:** un usuario de empresa A no ve datos de empresa B. RLS por `empresa_id`.
- **Conductor:** ve el historial de **sus** vehículos. El establecimiento solo lo ve si el conductor autorizó (`historial_compartido`).
- **Directorio:** coordenadas aproximadas (barrio/distrito) para visitantes. Exactas solo para usuarios autenticados.
- **Propietario:** no puede degradarse a sí mismo ni eliminarse (evita lockout).
- **Empleado:** ve datos del mismo tenant, no de otros.
- **Admin general:** no ve datos de negocio (clientes, vehículos, órdenes). Solo empresas, catálogo y moderación.

### Operaciones auditables (mínimo MVP)

Se registran en `audit_log` (tabla a crear en F5):

- Alta/baja/deshabilitación de empresa.
- Alta/desactivación de empleado.
- Edición de cliente/vehículo/orden (solo cambios, no lecturas).
- Edición de catálogo global (fabricantes, marcas, modelos, especificaciones, servicios/productos globales).
- Cambios de rol.
- Autorización/revocación de historial compartido.
- Publicación/despublicación en directorio.
- Acceso a `service_role` (si se usa).

### Decisiones de F2 (por delegación)

- **D-F2-1:** roles = admin_general, propietario, empleado, conductor, visitante. `verificador_catalogo` → v2.
- **D-F2-2:** authn con Supabase Auth para todos los roles con cuenta. Authz con RLS + server actions (doble capa).
- **D-F2-3:** operaciones auditables = las 8 listadas arriba.
- **D-F2-4:** conductor ve historial solo si autorizó. Establecimiento no ve historial cross-tenant.
- **D-F2-5:** directorio con coordenadas aproximadas. Exactas solo para autenticados.

## 4. Riesgos abiertos

| ID | Riesgo | Severidad | Fase que lo cierra |
|---|---|---|---|
| R1 | Ambigüedad de entidad vehículo | Alto | F3 (mitigado por ADR-002) |
| R2 | RLS mal diseñada en multiempresa | Alto | F3 + F4 |
| R3 | Catálogo sin fuente | Medio-alto | F6 |
| R4 | Free tier como falsa economía | Medio | F8 |
| R5 | Alcance MVP inflado | Medio | **F1 (cerrado por D-F1-1)** |
| R6 | Datos del piloto inventados | Bajo | F1 + CLIENTE.md |
| R7 | Fuga horizontal entre lubricentros competidores | Crítico | F3 + F4 |
| R8 | Historial vehicular como dato sensible comercial | Alto | F3 + F9 |
| R9 | Datos personales de conductores | Alto | F9 |
| R10 | Coordenadas de establecimientos | Medio | F10 |
| R11 | Integridad del catálogo automotriz | Medio | F6 |
| R12 | Endpoints de notificación abusables | Medio | F11 |
| R13 | Funciones SQL privilegiadas | Alto | F3 + F5 |
| R14 | Dependencias externas | Medio | F7 + F13 |

## 5. Criterios de aceptación

Se definen por módulo en F2-F14. Estructura obligatoria:

- [ ] Criterio funcional verificable (test manual o automatizado).
- [ ] Criterio de seguridad verificable (test positivo + negativo).
- [ ] Evidencia en `BITACORA.md`.

## 6. Fuera de alcance permanente

- Facturación tributaria oficial.
- Reconocimiento facial, biometría.
- App móvil nativa (la web responsive cubre MVP).
- Integraciones con aseguradoras, bancos, SET.

## 7. Decisiones pendientes

- **P-Nombre:** verificar redes (@kuatiauto) y DINAPI antes de declarar `KuatiAuto` definitivo.
- **P-Piloto:** confirmar los 5 campos críticos de `CLIENTE.md`.
- **P-Dominio:** registrar `kuatiauto.com.py` cuando el piloto justifique el costo.

## 8. Fases

1. [x] F0 — Punto de partida arquitectónico.
2. [x] **F1 — Definición de producto y alcance MVP** (este doc).
3. [ ] F2 — Usuarios, roles y permisos.
4. [ ] F3 — Arquitectura multiempresa (bloqueante, crítica).
5. [ ] F4 — Seguridad y modelo de amenazas (bloqueante, crítica).
6. [ ] F5 — Modelo conceptual y BD.
7. [ ] F6 — Base de conocimiento automotriz.
8. [ ] F7 — Arquitectura tecnológica.
9. [ ] F8 — Costos y límites free tier.
10. [ ] F9 — Privacidad y datos personales.
11. [ ] F10 — Geolocalización y directorio.
12. [ ] F11 — Recordatorios y notificaciones.
13. [ ] F12 — Modelo comercial.
14. [ ] F13 — Operación y continuidad.
15. [ ] F14 — Plan de implementación.

## 9. Flujos del MVP (D-F1-1)

### Camino feliz: del registro al historial

1. **Registro.** Dueño de lubricentro se registra con email/password. Queda como `auth.users` + `usuario` (rol propietario).
2. **Crear empresa.** Nombre obligatorio. RUC, dirección, teléfono opcionales. Al crear la empresa, se crea 1 establecimiento por defecto (mismo nombre, dirección de la empresa). El usuario queda como propietario.
3. **Cargar cliente.** Nombre obligatorio. Teléfono, email opcionales.
4. **Cargar vehículo.** Marca, modelo, año, patente, km actual. Pertenece al cliente y a la empresa (ADR-002).
5. **Crear orden de trabajo.** Fecha (default hoy), km al servicio, servicios (multi-select del catálogo), productos usados (opcional, tabla aparte), observaciones, importe total, próximo mantenimiento (fecha y/o km, sugerido automático).
6. **Ver historial del vehículo.** Todas las órdenes del vehículo, ordenadas por fecha descendente. Filtro por rango de fechas.
7. **Ver dashboard.** Próximos mantenimientos (por fecha o km) de todos los vehículos de la empresa. Ordenado por urgencia.

### Flujos secundarios (MVP)

- **Editar cliente/vehículo.** El propietario puede editar datos de clientes y vehículos de su empresa.
- **Editar orden de trabajo.** Mientras no esté "cerrada" (estado `borrador` → `completada`). Una orden completada no se edita, se anula y se crea otra. Motivo: auditoría.
- **Agregar empleado.** El propietario invita por email. El empleado se registra y queda vinculado a la empresa.
- **Gestionar catálogo local.** El propietario agrega servicios/productos propios de su empresa.
- **Admin general:** alta/baja de empresas, edición del catálogo global.

### Fuera de flujos MVP

- Recuperación de contraseña por email (depende de configurar SMTP en Supabase; puede entrar en F7).
- Notificaciones de próximo mantenimiento (v2).
- Exportación de datos (v2).

## 10. Modelo de datos (F5a — 2026-10-30)

Entidades y relaciones. El DDL exacto → F5.

- **`empresa`** — id, nombre, ruc (nullable), direccion (nullable), telefono (nullable), created_at.
- **`establecimiento`** — id, empresa_id, nombre, direccion, horarios (nullable), created_at.
- **`usuario`** — id (= auth.users.id), email, nombre, rol (`admin_general` | `propietario` | `empleado`), empresa_id (nullable para admin general), created_at.
- **`cliente`** — id, empresa_id, nombre, telefono (nullable), email (nullable), created_at.
- **`vehiculo`** — id, empresa_id, cliente_id, marca, modelo, anio, patente, km_actual, created_at.
- **`vehiculo_identidad`** — id, vehiculo_id, patente_normalizada, vin (nullable). Para consolidación cross-tenant en v2 (ADR-002).
- **`orden_trabajo`** — id, empresa_id, vehiculo_id, fecha, km_servicio, observaciones (nullable), importe_total (nullable), proximo_mantenimiento_fecha (nullable), proximo_mantenimiento_km (nullable), estado (`borrador` | `completada` | `anulada`), creado_por (usuario_id), created_at.
- **`orden_servicio`** — id, orden_id, servicio_id (global o local), precio (nullable), created_at. N:M entre orden y servicio.
- **`orden_producto`** — id, orden_id, producto_id (global o local), cantidad, precio_unitario (nullable), created_at. N:M entre orden y producto.
- **`servicio_global`** — id, nombre, descripcion, intervalo_meses_sugerido (nullable), intervalo_km_sugerido (nullable), created_at. Catálogo administrado por admin general.
- **`servicio_empresa`** — id, empresa_id, nombre, descripcion, created_at. Catálogo local.
- **`producto_global`** — id, nombre, marca (nullable), tipo (aceite/filtro/etc.), viscosidad (nullable), created_at.
- **`producto_empresa`** — id, empresa_id, nombre, marca, tipo, created_at.


**Estado F5b (2026-10-30):** las tablas de gestión están en `supabase/migrations/001-006`. El catálogo automotriz (fabricante, marca, modelo, version, motorizacion, especificacion_lubricante, servicio_global, servicio_empresa, producto_global), el directorio (establecimiento_publico) y el portal (conductor, vehiculo_conductor, historial_compartido) están en `supabase/migrations/007-008`. Pendiente F5c: audit_log, rate_limit, RLS policies y seed.

**Triggers y funciones implementados en F5a:**
- `set_updated_at()` — actualiza `updated_at` en cada tabla.
- `handle_new_user()` — crea `public.usuario` al crear `auth.users`.
- `crear_empresa_con_establecimiento()` — SECURITY DEFINER, transacción atómica.
- `poblar_vehiculo_identidad()` — normaliza patente al insertar/actualizar vehículo.
- `actualizar_stock()` — actualiza `producto_empresa.stock_actual` al insertar movimiento.
**Reglas de negocio básicas:**

- Un cliente pertenece a una empresa (RLS).
- Un vehículo pertenece a una empresa y a un cliente de esa empresa (RLS).
- Una orden pertenece a una empresa y a un vehículo de esa empresa (RLS).
- Los servicios/productos de una orden pueden ser globales o locales de la empresa. Nunca de otra empresa.
- El admin general no ve datos de negocio de las empresas, solo gestiona catálogo global y empresas.

## 11. Criterios de aceptación del MVP

Verificables. Cada uno con evidencia en `BITACORA.md`.

### Funcionales

- [ ] Un usuario puede registrarse, crear empresa, y quedar como propietario.
- [ ] Un propietario puede cargar cliente + vehículo + orden de trabajo en < 5 minutos (test manual con usuario real).
- [ ] El historial de un vehículo muestra todas las órdenes, ordenadas por fecha descendente.
- [ ] El dashboard muestra próximos mantenimientos ordenados por urgencia (fecha más cercana primero, km más cercano después).
- [ ] Un propietario puede invitar a un empleado, que ve la misma empresa pero no puede gestionar usuarios.
- [ ] Un propietario puede agregar servicios/productos locales a su empresa.
- [ ] El admin general puede crear/deshabilitar empresas y editar el catálogo global.

### De seguridad (se detallan en F4)

- [ ] Un usuario de empresa A no puede ver clientes, vehículos, órdenes de empresa B (prueba cruzada con 2 sesiones).
- [ ] Un empleado no puede modificar la empresa ni gestionar usuarios.
- [ ] El admin general no puede ver datos de negocio de empresas.

### De calidad

- [ ] `npm run build` pasa sin errores.
- [ ] `npm run test` pasa sin errores (tests unitarios + RLS).
- [ ] `npm run lint` pasa sin errores.