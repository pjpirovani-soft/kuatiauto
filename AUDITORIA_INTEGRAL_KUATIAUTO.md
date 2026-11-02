# Auditoría integral de software — KuatiAuto

**Fecha de revisión:** 2026-11-02  
**Repositorio:** [`pjpirovani-soft/kuatiauto`](https://github.com/pjpirovani-soft/kuatiauto)  
**Rama/commit auditado:** `main` / `84a8624fd6bf6c2155ad14b885d2171acc67c7ce`  
**Alcance:** inspección estática del árbol completo comunicado por GitHub, configuración, dependencias declaradas/lockfile presente, documentación, acciones de servidor seleccionadas, migraciones SQL, pruebas y workflows. No se conectó a Supabase ni se ejecutaron scripts de la aplicación o contra producción.

> **Limitación esencial:** la auditoría se efectuó mediante acceso de lectura a los archivos de GitHub; no hay workspace/runtime en esta sesión. Por tanto no pude instalar dependencias, ejecutar `npm test`, `npm run lint`, `tsc`, `npm run build`, `npm audit`, Playwright, pruebas RLS o verificar el esquema/estado efectivo de Supabase y Vercel. No afirmo resultados de ejecución ni estado de producción. Los hallazgos de código se basan en contenido versionado revisado y se distingue lo confirmado estáticamente de lo que requiere verificación dinámica.

## A. Resumen ejecutivo

KuatiAuto es un SaaS multiempresa en fase temprana (versión `0.4.0`, repositorio creado hace pocos días al momento de esta revisión), implementado como aplicación Next.js App Router con React, TypeScript, Supabase/PostgreSQL y políticas RLS. El repositorio tiene una arquitectura reconocible y una cantidad apreciable de documentación, validación Zod, server actions, migraciones numeradas y pruebas unitarias. Hay decisiones explícitas para aislamiento por empresa y un esfuerzo valioso por mantener secretos fuera del código.

La principal preocupación es la **autorización efectiva**, no la ausencia de mecanismos: la protección perimetral en `proxy.ts` solo cubre rutas `/dashboard...`, mientras que el layout del dashboard no autentica; además, rutas sensibles como `/admin` y `/mi-garage` tampoco verifican por sí mismas el rol/tipo de cuenta. Muchas server actions sí vuelven a verificar sesión y tenant, lo que reduce el impacto de acceso directo a la interfaz, pero no sustituye una autorización consistente en todas las páginas y operaciones. Hay evidencia adicional de controles que contradicen la política documentada: registro público asigna a cada nuevo usuario el rol `empleado`, y la RPC de creación de empresa promueve al usuario actual a propietario sin comprobar que todavía no esté asociado a otra empresa.

También se confirma una debilidad de disponibilidad: el rate limit falla abierto en todos los entornos, aunque `.env.example` declara un modo cerrado para producción. Se identificaron flujos CRUD no atómicos para órdenes, consultas administrativas sin paginación y riesgos de consistencia relacional en las escrituras. No se observó evidencia suficiente para declarar exposición cross-tenant confirmada, fuga de secretos o SQL injection; las políticas RLS están presentes y extensas, pero falta una prueba de integración reproducible contra PostgreSQL/Supabase y verificación del estado de privilegios real.

**Dictamen:** la base técnica es prometedora y la arquitectura modular es razonable para MVP, pero el código versionado no aporta evidencia bastante para declarar el sistema listo para producción con datos reales. Antes de abrirlo al público, deben cerrarse y probarse las brechas de control de acceso, endurecer el rate limiting, validar todas las mutaciones, garantizar transacciones y revisar dependencias y políticas RLS en un entorno seguro de staging.

### Fortalezas principales

- Stack coherente y TypeScript estricto (`package.json`, `tsconfig.json`); uso extensivo de Zod en flujos.
- RLS habilitado en tablas de negocio/portal y funciones `SECURITY DEFINER` con `search_path` fijado en la mayoría de los ejemplos revisados (`supabase/migrations/010_rls_policies.sql`, 019, 020).
- Acciones críticas seleccionadas validan sesión y `empresa_id` en servidor; no se confía simplemente en identificadores recibidos desde el cliente.
- La clave de service role se obtiene únicamente desde una variable server-side (`lib/supabase/admin.ts`); `.env.example` contiene placeholders, no credenciales reales.
- Pruebas unitarias distribuidas entre schemas y acciones, Playwright smoke tests, configuración de Sentry y un workflow de backup de base de datos.
- Decisiones arquitectónicas, modelo multi-tenant, operación y riesgos de dominio están documentados de forma inusualmente extensa para una versión temprana.

### Debilidades/riesgos principales

1. Protección de páginas incompleta y divergencia con la autorización declarada; rol/tipo de cuenta no está aplicado uniformemente en server-side de páginas/layouts.
2. Registro abierto que crea cuentas con rol `empleado`, más función de creación de empresa que no verifica asignación previa, lo que permite potencialmente cambiar de tenant/crear empresas repetidamente (impacto depende de privilegios y reglas efectivas; riesgo **alto** de diseño/autorización, no se verificó contra DB real).
3. Rate limiting deliberadamente fail-open ante error RPC/excepción, sin aplicar `RATE_LIMIT_FAIL_MODE`; el endpoint de login limita por email y no por IP como dice la documentación.
4. Operaciones de orden con múltiples escrituras independientes sin transacción; fallos intermedios dejan registros parciales.
5. Páginas/acciones administrativas omiten paginación y errores parciales; en particular, listados globales pueden escalar mal y mostrar contadores incorrectos.
6. No se ejecutó ningún test/linter/build/auditoría de dependencias ni se verificaron RLS/backup restore/headers en infraestructura.

## B. Evaluación por áreas

Escala orientativa de 0 (inexistente) a 10 (evidencia robusta, repetible y apropiada para producción). Las puntuaciones reflejan solo el repositorio estático inspeccionado, no el entorno desplegado.

| Área | Nota | Justificación |
|---|---:|---|
| Arquitectura | 6/10 | Next modular con route groups, separación `app`/`components`/`lib`/migraciones y ADRs. Aún hay límites de autorización inconsistentes, lógica de servidor extensa y una ruta de autorización no cohesionada. |
| Seguridad | 4/10 | Buenas bases RLS, Zod y separación de service role, pero hay defectos de fail-open, guardas de páginas incompletas, alta pública con privilegios funcionales y falta de pruebas negativas RLS/roles verificadas. No se comprobó vulnerabilidad de fuga entre tenants. |
| Funcionalidad | 6/10 | Flujos extensos de clientes, vehículos, órdenes, catálogo, directorio y portal; no pudo probarse comportamiento en ejecución. Órdenes parciales y el valor funcional de varios flujos requieren pruebas de integración. |
| Base de datos | 6/10 | Migraciones, FKs, restricciones, índices y RLS presentes; riesgos por transacciones entre acciones y por drift documentado/manual. Falta prueba de migración limpia, inspección de esquema efectivo y estrategia de restore probada. |
| Calidad del código | 6/10 | Tipado estricto, schemas compartidos y tests son positivos; hay `any`, `unknown[]`, `as` y módulos de acciones con muchas responsabilidades, manejo irregular de errores y duplicación. |
| UI/UX | 6/10 | Identidad visual, paleta, Inter y variantes móvil/escritorio visibles en páginas inspeccionadas. Sin render en navegador/lector de pantalla no se puede certificar contraste, navegación por teclado, estados y accesibilidad; hay riesgo de tablas anchas en CSS global. |
| Rendimiento | 5/10 | Páginas server-rendered y límites en búsqueda, pero consultas administrativas traen tablas completas y listados no tienen paginación; mapa/directorio y tamaños de bundle no se midieron. |
| Testing | 5/10 | Amplia colección de tests unitarios de acciones/schemas y smoke e2e; falta evidencia de resultados/cobertura, pruebas SQL/RLS multitenant, transacciones y no hay script CI general de lint/typecheck/build/test visible en el árbol inspeccionado. |
| Documentación | 7/10 | ARCHITECTURE, SPEC, decisiones, mantenimiento, contexto, README y env example. README raíz sigue siendo plantilla/blueprint genérico y la arquitectura mantiene descripciones desactualizadas o de fase/estado contradictorios. |
| Escalabilidad | 4/10 | Monolito modular apropiado para MVP, pero consultas de carga completa, rate-limit centralizado en PostgreSQL, ausencia de paginación/observabilidad operativa verificada y falta de métricas de carga probadas limitan proyección. |

## C. Registro de hallazgos

### KU-SEC-01 — Protección incompleta de páginas/rutas privilegiadas

- **Categoría/severidad:** Seguridad — **ALTO**.
- **Descripción:** el proxy redirige únicamente usuarios anónimos cuyo path empieza con `/dashboard`; no cubre `/admin`, `/mi-garage`, rutas de negocio `/clientes`, `/vehiculos`, etc. Los layouts dashboard/admin/portal revisados solo montan navegación y contenido, sin comprobar usuario ni rol. Algunas páginas/actions internas repiten la sesión; no todas las páginas han sido verificadas una a una, por lo que el alcance de acceso a contenido pre-renderizado debe confirmarse. Un endpoint de servidor debe ser el límite de seguridad; ocultar el enlace no basta.
- **Evidencia:** `proxy.ts:37-41` comprueba solo `startsWith('/dashboard')`; `app/(dashboard)/layout.tsx:4-14`, `app/(admin)/layout.tsx:4-14` y `app/(portal)/layout.tsx:4-14` no tienen comprobación de autorización. `app/(dashboard)/clientes/page.tsx:7-12` verifica login, no rol explícito. `app/(admin)/admin/page.tsx:5-7` delega autorización a la acción que obtiene contadores, pero no protege el layout/rutas admin completas.
- **Impacto/probabilidad:** usuarios autenticados sin rol autorizado pueden alcanzar páginas y ejecutar acciones que carezcan de su propia guarda; exposición concreta depende de comprobaciones por página/action y RLS. Probabilidad media-alta dada la cobertura inconsistente.
- **Recomendación/prioridad:** definir un guard común server-side por rol/tenant y aplicarlo en cada segmento privado y acción privilegiada; conservar proxy solo como optimización. Añadir pruebas anónimas, conductor→admin/dashboard, empleado→admin y acceso directo a IDs/rutas.

### KU-SEC-02 — Aprovisionamiento de empresa sin comprobar estado previo del usuario

- **Categoría/severidad:** Seguridad / autorización multi-tenant — **ALTO** (requiere confirmar privilegios efectivos de ejecución en Supabase).
- **Descripción:** la RPC crea empresa y establecimiento nuevos y actualiza `usuario.empresa_id`/rol para `auth.uid()` sin condición que requiera usuario no asociado, rol elegible o empresa previa nula. La acción de aplicación verifica solo autenticación antes de llamarla. Un usuario autenticado puede potencialmente invocarla repetidamente y mover su propia pertenencia de tenant; los efectos sobre registros previamente asociados dependen de FKs, estado y reglas efectivas.
- **Evidencia:** `supabase/migrations/001_empresa_establecimiento.sql:61-77`; `lib/empresa-actions.ts:19-37`. La RPC está concedida a `authenticated` (líneas 81-82). No hay condición de “solo onboarding una vez” en el cuerpo inspeccionado.
- **Impacto/probabilidad:** duplicación de empresas, cambio de contexto y posible acceso/desvinculación indebida a datos empresariales. Probabilidad media si el RPC es accesible tal como está migrado; no se realizó llamada.
- **Recomendación/prioridad:** reforzar invariante en base de datos dentro de la misma transacción (`usuario.empresa_id is null`, rol/estado esperado), validar longitud/normalización en SQL y hacer creación idempotente si corresponde; probar RPC con usuario ya asociado y concurrencia.

### KU-SEC-03 — Rate limit falla abierto incluso en producción

- **Categoría/severidad:** Seguridad/abuso — **ALTO** para login/registro/reset; **MEDIO** para mutaciones ordinarias.
- **Descripción:** cualquier error de RPC o excepción permite la operación. El helper no lee `RATE_LIMIT_FAIL_MODE`, aunque `.env.example` describe `open (dev) | closed (prod)`. Además, login/registro/reset construyen claves por email; no hay límite por IP implementado en la acción revisada, a diferencia del diseño documentado.
- **Evidencia:** `lib/rate-limit.ts:19-37` retorna `{ok: true}` tanto ante error RPC como catch. `.env.example:15-16` declara modo de fallo, pero no es consumido por ese módulo. `lib/auth-actions.ts:25-26, 70-71, 89-90` usa clave con email, sin IP.
- **Impacto/probabilidad:** si la base de datos/RPC no está disponible, los límites desaparecen; permite fuerza bruta distribuida contra emails y abuso de operaciones. Probabilidad media; requiere fallos o abuso deliberado.
- **Recomendación/prioridad:** modo fail-closed en producción, límites combinados por IP/cuenta y respuesta 429 verificable; garantizar proveedor persistente compatible con instancias concurrentes y alertas. Probar fallos de DB y rotación de ventanas.

### KU-SEC-04 — RLS y autorización no cuentan con pruebas negativas reproducibles

- **Categoría/severidad:** Seguridad / control de acceso — **ALTO como riesgo de aseguramiento** (no es prueba de bypass confirmado).
- **Descripción:** hay políticas RLS completas para varias tablas y scopes, pero no aparece una suite pgTAP/SQL de integración. La arquitectura marca explícitamente como obligatorias las pruebas con dos tenants y roles, y aún registra esos fundamentos/gates como pendientes en secciones del mismo documento. La existencia de políticas no verifica grants efectivos, tablas incorporadas luego, vistas, RPCs ni el estado de producción.
- **Evidencia:** `supabase/migrations/010_rls_policies.sql` define políticas (por ejemplo líneas 70-83 para usuario y 356-372 para historial); `docs/proyecto/ARCHITECTURE.md:157-172, 339-387` exige pruebas cruzadas; árbol completo inspeccionado contiene tests TypeScript, no tests SQL/pgTAP.
- **Impacto/probabilidad:** error de policy/grant/RPC podría causar BOLA o fuga de datos personales/comerciales entre empresas. Probabilidad no cuantificable sin ejecutar pruebas.
- **Recomendación/prioridad:** crear entorno Supabase local/staging con datos sintéticos A/B y pruebas SELECT/INSERT/UPDATE/DELETE por rol para todas las tablas, incluidos RPCs y funciones `SECURITY DEFINER`; verificar grants y catálogo real antes del lanzamiento.

### KU-SEC-05 — Cuenta pública registrada como empleado y divergencia de alta de conductor

- **Categoría/severidad:** Seguridad/funcionalidad de identidad — **MEDIO**.
- **Descripción:** el trigger crea toda cuenta nueva en `usuario` con rol `empleado`; el registro normal no asigna empresa, y el alta de conductor crea además fila `conductor` basada en metadata. La acción de login da prioridad al rol admin, pero cualquier registro de conductor se reconoce después por existencia en tabla `conductor`; las acciones/páginas restantes deben tratar coherentemente ambas identidades. `activo` no se muestra como guard global en las comprobaciones inspeccionadas.
- **Evidencia:** `supabase/migrations/002_usuario.sql:24-39` asigna rol `empleado`; `supabase/migrations/008_directorio_portal.sql:56-79` crea conductor; `lib/auth-actions.ts:105-119` acepta metadata `tipo=conductor`; `lib/auth-actions.ts:48-54` resuelve login por presencia de conductor luego de admin.
- **Impacto/probabilidad:** privilegio nominal o contexto inconsistente, cuentas sin empresa y potencial acceso a operaciones por validaciones incompletas. Probabilidad media.
- **Recomendación/prioridad:** modelar registro como estado pendiente/no privilegiado; asignación explícita de rol y tenant por invitación verificada; comprobar `activo` y coherencia de identidad en toda action. Cubrir registro/login por tipo y rutas cruzadas.

### KU-SEC-06 — Función SQL de búsqueda pública sin límites defensivos internos

- **Categoría/severidad:** Seguridad/abuso y rendimiento — **MEDIO**.
- **Descripción:** la RPC pública permite `anon` y filtra publicaciones, pero no valida rango de coordenadas/radio ni limita longitud de texto; el límite final es 100, aunque la consulta puede calcular distancia/filtrar y ordenar sobre todo el directorio. La documentación especifica rate limiting de búsqueda, pero `buscarEstablecimientos` no llama al helper.
- **Evidencia:** `supabase/migrations/012_busqueda_directorio.sql:11-17, 51-63`; `lib/directorio-actions.ts:7-23` valida schema y llama RPC, sin rate limit. El esquema cliente existe, pero no prueba el límite del lado SQL ante llamada directa a RPC.
- **Impacto/probabilidad:** abuso de consultas y degradación/coste de DB; datos anómalos pueden producir resultados no esperados. Probabilidad media.
- **Recomendación/prioridad:** validar límites también en SQL, imponer rate limit de IP/usuario que cubra invocación directa, normalizar texto y medir planes/índices geoespaciales con volumen sintético.

### KU-FUNC-01 — Guardado/edición de órdenes no atómico

- **Categoría/severidad:** Funcionalidad/integridad de datos — **ALTO**.
- **Descripción:** la acción crea cabecera de orden y luego guarda líneas en consultas independientes. Un fallo de inserción de servicios/productos deja orden parcial y retorna error; la edición actualiza cabecera, elimina líneas y re-inserta secuencialmente. Una falla intermedia puede perder líneas anteriores o guardar datos incoherentes. No se observa una transacción/RPC que agrupe el flujo.
- **Evidencia:** `lib/ordenes-actions.ts:189-225` y `241-303`.
- **Impacto/probabilidad:** órdenes incompletas, importes/historial incorrectos y necesidad de reparación manual; probabilidad media bajo errores de red/DB.
- **Recomendación/prioridad:** mover la mutación completa a RPC transaccional con verificación de pertenencia y rollback; agregar tests de fallo simulado entre pasos y reintentos/idempotencia.

### KU-FUNC-02 — Falta validar que el cliente/vehículo de una mutación pertenezca a la empresa

- **Categoría:** Integridad / control de acceso a nivel de objeto — **MEDIO**, posible BOLA si las constraints no lo impiden.
- **Descripción:** `crearVehiculo` obtiene `empresaId` del usuario, pero inserta `cliente_id` recibido sin consultar que el cliente pertenezca a la misma empresa. `editarVehiculo` cambia `cliente_id` sin esa verificación. `editarOrden` verifica que la orden pertenece al tenant y verifica referencias empresariales de líneas, pero no valida explícitamente que el nuevo `vehiculo_id` pertenezca al tenant. RLS de la fila padre no garantiza por sí sola integridad entre FKs cuando el cliente puede seleccionar un UUID de otra empresa, salvo constraint/trigger no visto.
- **Evidencia:** `lib/vehiculos-actions.ts:74-85, 118-130`; `lib/ordenes-actions.ts:241-274`; `010_rls_policies.sql:109-125` filtra `vehiculo` por empresa, pero no documenta constraint compuesta que asegure pareja `empresa_id`/FK.
- **Impacto/probabilidad:** registros huérfanos desde la perspectiva del tenant o referencia cruzada accidental; posible exposición indirecta a través de joins. No se confirmó acceso a fila ajena.
- **Recomendación/prioridad:** validar pertenencia del objeto referenciado dentro de una transacción y añadir constraints compuestas/trigger como defensa; tests B/A usando IDs ajenos.

### KU-FUNC-03 — Transición de estado de orden susceptible a condición de carrera

- **Categoría:** Integridad funcional — **MEDIO**.
- **Descripción:** completar/anular/editar primero leen estado y después actualizan con filtro por ID (no incluye estado previo en el UPDATE); dos solicitudes concurrentes pueden completar/anular o editar/cerrar en orden impredecible. El flujo de editar tiene varias escrituras no atómicas.
- **Evidencia:** `lib/ordenes-actions.ts:253-273`, `320-371`, `420-435`.
- **Impacto/probabilidad:** reescritura de estado o totales, doble notificación; probabilidad baja-media bajo doble envío/concurrencia.
- **Recomendación/prioridad:** transición condicional atómica (`WHERE estado = ...`) o RPC con lock/versionado; clave idempotente y test concurrente.

### KU-PERF-01 — Cargas administrativas sin paginación y errores parciales ignorados

- **Categoría:** Rendimiento/funcionalidad — **MEDIO**.
- **Descripción:** listados traen colecciones completas y cuentan en memoria. `listarEmpresasAdmin` carga todos los registros de usuario, cliente, vehículo y orden para crear mapas; `listarUsuariosAdmin` obtiene todos los usuarios. No se comprueba error de cada consulta secundaria, lo que puede producir métricas aparentemente válidas pero incompletas. Por defecto PostgREST pagina resultados con límite del servidor, por lo que las métricas pueden subcontar al crecer.
- **Evidencia:** `lib/admin-actions.ts:109-149` y `257-290`; los queries no usan `.range()` ni `count` en los secundarios.
- **Impacto/probabilidad:** resultados truncados y consumo creciente de memoria/red; probable al superar límites de filas de Supabase.
- **Recomendación/prioridad:** paginar listados con cursor/offset; conteos con consultas `count: exact` filtradas por empresa o RPC agregado; propagar todos los errores y probar con dataset mayor que el límite.

### KU-DB-01 — Migraciones reflejan drift y estado manual previo

- **Categoría:** Base de datos/operación — **MEDIO**.
- **Descripción:** una migración indica explícitamente que `producto_empresa` fue creada manualmente en DB y añade sincronización posterior; nota que el drift fue detectado y que una policy existente no se repite por el estado real. La reconstrucción desde cero puede divergir del proyecto desplegado o depender del orden/versión actual del esquema.
- **Evidencia:** `supabase/migrations/016_producto_empresa.sql:2-6`; `docs/proyecto/ARCHITECTURE.md` lista migraciones 001–008 con un catálogo antiguo (líneas 696–709), frente al árbol actual 001–020.
- **Impacto/probabilidad:** despliegues nuevos o restauraciones con diferencias de grants, tablas/policies o datos; probabilidad media hasta reconciliar y probar migración limpia.
- **Recomendación/prioridad:** validar `supabase db reset`/migración desde cero en DB descartable y comparar schema diff contra staging; documentar estado fuente de verdad y evitar cambios manuales no capturados.

### KU-DB-02 — RLS para `usuario` permite actualización de rol/empresa del propio registro en política

- **Categoría:** Seguridad/BD — **MEDIO, requiere revisar GRANT/column privileges y acciones cliente**.
- **Descripción:** la policy UPDATE permite al usuario actualizar cualquier columna de su fila (`id = auth.uid()`) o de su empresa. La policy RLS restringe filas, no columnas. La aplicación parece usar service role para ciertos cambios administrativos y no se observó aquí una acción cliente genérica para editar `rol`, pero debe verificarse que grants y cualquier otro cliente/SDK no permitan modificar `rol`, `empresa_id` o `activo` directamente.
- **Evidencia:** `supabase/migrations/010_rls_policies.sql:76-79`; no hay policy `WITH CHECK` explícita que restrinja columnas/cambios; tabla grants/column permissions no fue consultable en el repositorio.
- **Impacto/probabilidad:** escalada de privilegios o reasignación de tenant si authenticated tiene UPDATE directo y la policy aplicable lo autoriza; no confirmado por falta de inspección de ACL real y conducta de PostgREST.
- **Recomendación/prioridad:** revocar UPDATE directo o restringir columnas; implementar cambios de perfil/rol por RPCs/actions con allowlist, y probar actualizaciones directas de rol/empresa desde sesión de usuario.

### KU-DB-03 — Historial compartido no garantiza exclusividad del vehículo y la empresa solicitante

- **Categoría:** Integridad/privacidad — **MEDIO, requiere validar constraints y flujos completos**.
- **Descripción:** la RPC de propuesta valida vehículo de empresa y crea autorización pendiente asociada con conductor identificado por email, pero no valida que `p_conductor_email` corresponda al titular/controlador del vehículo ni una relación previa verificada. La tabla permite referencias a `vehiculo_conductor_id` o `vehiculo_empresa_id` con un CHECK “al menos una”, no exactamente una; propuesta inserta `vehiculo_empresa_id`. La aceptación queda vinculada por token y `conductor_id`, medida positiva.
- **Evidencia:** `supabase/migrations/019_historial_compartido_consentimiento.sql:24-40, 47-59`; `008_directorio_portal.sql:104-114`.
- **Impacto/probabilidad:** propuestas mal dirigidas o inconsistencias en la asociación de historial; la lectura específica está restringida en RPC 020 al conductor, pero no se verificó todo el flujo.
- **Recomendación/prioridad:** confirmar identidad del conductor y vínculo vehículo/conductor según el modelo de producto, reforzar exclusividad de columnas y unicidad de propuesta/revocación; probar reenvíos, revocación y datos cross-tenant.

### KU-OPS-01 — CI visible no ejecuta comprobaciones generales de calidad

- **Categoría:** Calidad/operación — **MEDIO**.
- **Descripción:** el workflow de E2E ejecuta smoke contra producción; el workflow de backup realiza dump semanal. En los workflows visibles no hay job general de test unitario, lint, typecheck, build, escaneo de secretos o auditoría de dependencias. Playwright está configurado con `flows-local` apuntando a `./e2e/flows`, pero el árbol recursivo no contiene ese directorio.
- **Evidencia:** `.github/workflows/e2e-smoke.yml:1-55`, `backup-db.yml:1-54`, `playwright.config.ts:39-46`, árbol completo inspeccionado sin `e2e/flows`.
- **Impacto/probabilidad:** regresiones pueden integrarse sin gate local automatizado; ejecución del proyecto `flows-local` fallará o no encontrará tests si se invoca. No se conoce configuración externa de CI no visible en el árbol.
- **Recomendación/prioridad:** CI para `npm ci`, lint, typecheck, unit tests y build en PR; mantener E2E contra staging con cuentas/datos aislados, no producción en cada evento, y alinear proyectos Playwright con rutas existentes.

### KU-OPS-02 — Backup almacenado como artifact de Actions sin restore verificado

- **Categoría:** Continuidad — **MEDIO**.
- **Descripción:** workflow semanal genera dumps y sube artifact con retención 90 días. No se observa copia externa/versionada en storage separado, cifrado adicional explícito, verificación de integridad o prueba automática de restauración. El workflow depende de secreto `SUPABASE_DB_URL` y se ejecuta manual/programado.
- **Evidencia:** `.github/workflows/backup-db.yml:24-54`; arquitectura menciona export semanal y prueba de restauración, pero no hay evidencia de ejecución (`docs/proyecto/ARCHITECTURE.md:513-517, 741-746`).
- **Impacto/probabilidad:** pérdida de recuperación ante compromiso de cuenta GitHub, artefacto corrupto o fallo de dump; impacto alto, probabilidad desconocida.
- **Recomendación/prioridad:** almacenamiento externo con cifrado, mínimo privilegio y retención formal; alertas de fallo y simulacro de restauración trimestral a entorno aislado con RPO/RTO medidos.

### KU-UX-01 — Accesibilidad y responsive no certificables; tablas fuerzan ancho mínimo global

- **Categoría:** UI/UX/accesibilidad — **BAJO-MEDIO**.
- **Descripción:** CSS global asigna `min-width: 600px` a todas las tablas bajo 768px y habilita overflow a `.overflow-hidden`, que es una clase de utilidad con significado distinto. Puede generar desplazamiento horizontal y afectar tablas que ya tengan layout móvil dedicado. No se ha inspeccionado toda la interfaz en navegador, teclado o lector de pantalla.
- **Evidencia:** `app/globals.css:26-34`; `app/(dashboard)/clientes/page.tsx:44-74` ya separa tabla desktop de tarjetas móviles, pero la regla global sigue aplicándose a cualquier tabla visible.
- **Impacto/probabilidad:** scroll horizontal o navegación difícil en móvil, riesgo de pérdida de contenido/zoom; probabilidad media en pantallas pequeñas.
- **Recomendación/prioridad:** revisar cada tabla y usar contenedor/estilo explícito solo donde sea necesario; auditoría WCAG 2.2 AA con teclado, estados focus, contraste real y viewport de 320–375 px.

### KU-UX-02 — Fallback offline del service worker no está disponible

- **Categoría:** Funcionalidad/UX — **BAJO**.
- **Descripción:** el service worker precachea rutas SVG que no aparecen en `public/icons` (los recursos listados son PNG); `cache.addAll` falla si falta alguno. Además el fallback de navegación busca `/`, pero el comentario indica que no se cachea y no está en la lista. El worker puede no instalarse y la experiencia offline declarada no funciona.
- **Evidencia:** `public/sw.js:2-7, 9-14, 32-38`; árbol `public/icons` contiene PNG, no los SVG indicados.
- **Impacto/probabilidad:** instalación SW fallida o navegación offline sin fallback; impacto limitado, probabilidad alta si esas URLs no existen como consta en el árbol.
- **Recomendación/prioridad:** reconciliar recursos precacheados con archivos reales y definir estrategia offline explícita; verificar install/activate/fetch con Playwright sin red.

### KU-DOC-01 — README principal no representa el producto actual

- **Categoría:** Documentación — **BAJO**.
- **Descripción:** el README se presenta como plantilla/blueprint que debe copiarse a `clients/<nombre>` y describe CRUD genérico; no guía sobre el producto KuatiAuto ni refleja la estructura, configuración o comandos actuales en forma suficiente.
- **Evidencia:** `README.md:1-4, 13-39`; árbol raíz demuestra app propia, docs, migraciones y tests.
- **Impacto/probabilidad:** incorporación de desarrolladores más lenta y discrepancias al configurar/desplegar.
- **Recomendación/prioridad:** sustituir el contenido por guía específica con prerequisitos Node 22, env vars, Supabase local/migraciones, desarrollo, tests, deploy, backup y limitaciones conocidas.

### KU-PERF-02 — Consultas de órdenes no implementan paginación

- **Categoría:** Rendimiento — **MEDIO a escala**.
- **Descripción:** listado de órdenes filtra por empresa y ordena fecha/creación, pero devuelve todos los registros; no hay cursor ni límite explícito. Puede exceder el límite de filas de PostgREST y trasladar historial innecesario al servidor/render.
- **Evidencia:** `lib/ordenes-actions.ts:119-140`.
- **Impacto/probabilidad:** listados truncados o lentos a medida que crezca el historial por empresa.
- **Recomendación/prioridad:** paginación server-side por fecha/id, filtros de rango y medición de índices compuestos en datos representativos.

### Hallazgos no confirmados / aspectos no declarados como vulnerabilidad

- No se encontró una credencial real en los archivos revisados. `.env.example` contiene nombres y placeholders; no se muestran valores secretos en este informe.
- Consultas Supabase revisadas utilizan el query builder y no se observó SQL dinámico interpolado en acciones TypeScript; no se confirma SQL injection.
- No se confirmó IDOR/BOLA cross-tenant: RLS y filtros explícitos están presentes en varios flujos. El hallazgo KU-FUNC-02 es un riesgo de integridad/verificación de FK, no evidencia de lectura de otra empresa.
- No se inspeccionaron ACL efectivos, configuración de Auth (MFA, confirmación email, duración/rotación de sesión), políticas de proyecto Supabase, CORS/CDN, HTTPS/HSTS, CSP/headers ni secretos de Vercel/GitHub.
- La versión de dependencias está fijada por `package-lock.json`, pero no se consultó un feed actual de CVEs ni se ejecutó `npm audit`; no se declara dependencia vulnerable/desactualizada sin evidencia.

## D. Matriz de riesgos priorizada

| Orden | ID | Riesgo | Severidad | Probabilidad | Prioridad |
|---:|---|---|---|---|---|
| 1 | KU-SEC-01 | Guardas de páginas/roles incompletas | Alto | Media-alta | P0 antes de usuarios/datos reales |
| 2 | KU-SEC-02 | RPC de alta empresa permite reaprovisionamiento/cambio de tenant | Alto | Media, requiere validar ejecución | P0 |
| 3 | KU-SEC-03 | Rate limit fail-open y sin límite IP declarado | Alto (auth) | Media | P0 |
| 4 | KU-SEC-04 | RLS/RPC sin pruebas cross-tenant ejecutadas | Alto como riesgo de aseguramiento | Desconocida | P0 |
| 5 | KU-FUNC-01 | Escritura de órdenes no atómica | Alto funcional | Media | P1 |
| 6 | KU-SEC-05 | Provisionamiento/roles de registro ambiguos | Medio | Media | P1 |
| 7 | KU-DB-02 | Permisos UPDATE de usuario no restringidos por columna | Medio, condicional a grants | Desconocida | P1 |
| 8 | KU-FUNC-02 | Referencias cliente/vehículo sin validación explícita tenant | Medio | Baja-media | P1 |
| 9 | KU-SEC-06 | Búsqueda pública susceptible a abuso/coste | Medio | Media | P1 |
| 10 | KU-FUNC-03 | Carrera en transición de órdenes | Medio | Baja-media | P2 |
| 11 | KU-PERF-01/02 | Cargas sin paginación/conteos potencialmente truncados | Medio | Media al crecer | P2 |
| 12 | KU-DB-01 | Drift de esquema y migración dependiente de historia manual | Medio | Media | P1 |
| 13 | KU-OPS-01 | CI de calidad incompleto y Playwright path divergente | Medio | Media | P1 |
| 14 | KU-OPS-02 | Backup sin restore demostrable/copia separada | Medio | Desconocida | P1 |
| 15 | KU-UX-01 | Tablas/contraste/teclado no validados | Bajo-medio | Media | P2 |
| 16 | KU-UX-02 | Service worker apunta a assets inexistentes | Bajo | Alta (si URLs ausentes en deploy) | P2 |
| 17 | KU-DOC-01 | README genérico | Bajo | Alta | P3 |

## E. Plan de acción priorizado

### 1. Inmediato — antes de publicar o incorporar datos reales

| Acción | Hallazgos | Esfuerzo |
|---|---|---|
| Inventariar todas las páginas y server actions; añadir guardas server-side de sesión, rol, estado activo y empresa; probar acceso directo a `/admin`, `/mi-garage` y módulos por rol. | KU-SEC-01, SEC-05 | Medio |
| Endurecer `crear_empresa_con_establecimiento` para aceptar solo usuarios elegibles sin tenant previo; ejecutar pruebas de invocación repetida y simultánea en DB descartable. | KU-SEC-02 | Bajo-medio |
| Configurar rate limit fail-closed en producción y combinar límites por IP/cuenta; comprobar ausencia de bypass directo a RPC y comportamiento cuando DB falla. | KU-SEC-03, SEC-06 | Medio |
| Crear suite de RLS/ACL/RPC con empresa A y B y roles admin/propietario/empleado/conductor/anon; probar lecturas y mutaciones directas, no solo acciones UI. | KU-SEC-04, DB-02, FUNC-02 | Alto |
| Hacer una revisión de staging de configuración Supabase/Vercel: grants, auth/MFA/confirmación, secretos, HTTPS/headers/CORS, logs y configuración de service role. No usar datos de producción para pruebas. | SEC-01..06 | Medio |

### 2. Corto plazo — fiabilidad e integridad

| Acción | Hallazgos | Esfuerzo |
|---|---|---|
| Implementar creación/edición de orden como operación transaccional con rollback y test de fallo de cada paso; hacer transiciones de estado condicionales/idempotentes. | FUNC-01, FUNC-03 | Alto |
| Validar en DB/acción la pertenencia de cliente y vehículo en cada FK de mutación; agregar restricciones relacionales que lo sostengan. | FUNC-02 | Medio |
| Conciliar migraciones desde cero con staging, comparar drift de esquema y grants, verificar secuencia 001–020 y regeneración de tipos. | DB-01 | Medio |
| Paginación de órdenes/usuarios/empresas y conteos agregados eficientes; propagar errores secundarios. | PERF-01/02 | Medio |
| Introducir CI de PR para instalación reproducible, lint, typecheck, tests unitarios y build; E2E contra staging, ajustar `e2e/flows`. | OPS-01 | Medio |
| Ejecutar prueba de restauración real de backup en proyecto aislado y documentar RTO/RPO; almacenar copia resiliente y cifrada. | OPS-02 | Medio-alto |

### 3. Mediano plazo — mantenimiento y experiencia

| Acción | Hallazgos | Esfuerzo |
|---|---|---|
| Separar módulos de administración (empresas, usuarios, catálogos) en servicios/archivos con schemas de entrada compartidos y resultados tipados. | Código / PERF-01 | Medio |
| Eliminar `any`/casts de modelos de dominio y sustituir `unknown[]` por tipos generados desde Supabase; hacer errores de DB explícitos. | Código | Medio |
| Auditoría WCAG 2.2 AA y responsive en navegador real; corregir foco, etiquetas, contraste y reglas de tabla donde las pruebas evidencien problemas. | UX-01 | Medio |
| Corregir y probar el ciclo del service worker, assets y fallback offline o retirar la promesa offline si no es requisito. | UX-02 | Bajo |
| Análisis de dependencias con `npm audit`/Dependabot en CI y revisión periódica de lockfile/CVEs, registrando fecha y excepciones. | Seguridad/OPS | Bajo-medio |

### 4. Largo plazo — evolución y escala

| Acción | Hallazgos | Esfuerzo |
|---|---|---|
| Establecer métricas de latencia p95, errores, carga de DB, volumen de rate limit y consultas lentas; revisar índices con explain en staging. | Rendimiento/escalabilidad | Medio |
| Evaluar límites de rate limiting Postgres y migrar a almacén dedicado solo si el volumen/latencia lo justifica. | SEC-03/escala | Alto |
| Formalizar runbooks de incidente, rotación, retención y derechos de titulares; hacer ejercicios periódicos de recuperación. | OPS-02/documentación | Medio |
| Añadir pruebas de carga controladas y presupuesto de bundle/CWV; definir umbrales realistas con tráfico sintético. | Rendimiento | Medio-alto |

## F. Deuda técnica

1. Reglas de autorización repartidas entre proxy, páginas, server actions, RLS y service-role; falta una matriz de cobertura comprobable.
2. Funciones de acciones grandes con validación, autorización, consultas, auditoría, notificación y revalidación en un mismo flujo (`lib/ordenes-actions.ts`, `lib/admin-actions.ts`).
3. Contratos de datos poco específicos en lugares (`unknown[]`, `as`, `any`) a pesar de TypeScript estricto y tipos Supabase.
4. Reglas de pertenencia entre filas dependen de comprobaciones imperativas; conviene representarlas también como restricciones de base de datos.
5. Migraciones documentan schema drift y decisiones de creación manual; reconstrucción limpia no está probada según la evidencia accesible.
6. Rate limiting centralizado con fail-open, claves que no reflejan el límite documentado por IP y ausencia de evidencia de limpieza automática efectiva en `rate_limit`.
7. Los listados administrativos calculan agregados en memoria y pueden ser parciales/truncados.
8. README de blueprint y documentos de arquitectura con tablas/estado de migraciones antiguos frente a la estructura actual.
9. Configuración de E2E incluye un proyecto `flows-local` cuya ruta no aparece en árbol.
10. `.gitignore` tiene entradas de temporales duplicadas, limpieza menor que reduce claridad pero no constituye riesgo funcional por sí sola.

## G. Recomendaciones estratégicas

- Mantener la arquitectura monolítica Next modular: el tamaño y stack actuales no justifican una reescritura ni separar servicios.
- Tratar RLS como última barrera, no como sustituto de autorización explícita y de pruebas por operación. Probar contra una base efímera reproducible en CI.
- Establecer una matriz formal `rol × ruta × acción × tabla/RPC` y enlazar cada permiso a una prueba positiva y negativa.
- Evitar usar service role salvo en operaciones justificadas; cada uso debe validar identidad/rol antes de elevar privilegios, registrar auditoría y limitar columnas expuestas.
- Llevar el flujo transaccional de órdenes y onboarding al nivel de DB para que integridad y permisos no dependan de secuencias de llamadas desde aplicación.
- Separar staging de producción, no utilizar pruebas smoke mutables contra usuarios/datos reales y proteger usuarios E2E con datos sintéticos aislados.
- Convertir las decisiones de seguridad/documentación ya escritas en gates automatizados, eliminando contradicciones entre diseño, migraciones y comportamiento.
- No invertir en microservicios ni optimizaciones prematuras; primero medir, paginar y corregir agregados que cargan tablas completas.

## H. Dictamen final

### ¿Está preparado para producción?

**No puede considerarse preparado para producción con los datos actuales.** La revisión estática identifica riesgos altos en autorización, aprovisionamiento y limitación de abuso, además de operaciones de negocio no atómicas. No se ejecutaron comprobaciones en el despliegue o la base de datos real, de modo que no es posible certificar aislamiento ni configuración.

### Condiciones mínimas antes de publicar

1. Guards server-side consistentes en todas las páginas privadas y acciones privilegiadas, con pruebas por rol.
2. Invariantes de onboarding/empresa aplicadas atómicamente en SQL y probadas con usuario ya asociado y concurrencia.
3. Rate limiting cerrado ante fallos en producción, con capa por IP para autenticación/búsqueda.
4. Suite de integración RLS/ACL con tenants A/B y RPCs privilegiadas, ejecutada en entorno aislado.
5. Mutaciones de orden transaccionales y validación de referencias cross-tenant.
6. CI verde y documentado para typecheck, lint, unit, build y pruebas críticas; auditoría de dependencias con resultado fechado.
7. Restauración de backup demostrada en un entorno separado y verificación de configuración/headers/secretos de producción.

### Riesgos que no deberían aceptarse

- Autorizar páginas o acciones privilegiadas únicamente por UI/proxy.
- RPC `SECURITY DEFINER` que puede reasignar/provisionar una empresa sin invariante de estado previo.
- Rate limit que permite solicitudes si falla en producción.
- Declarar aislamiento multiempresa seguro sin pruebas negativas ejecutadas ni verificación de grants.
- Guardar órdenes con transacciones parciales en operaciones financieras/históricas.

### Qué corregir primero

Atender `KU-SEC-01` a `KU-SEC-04`, después `KU-FUNC-01` y los riesgos de integridad referencial, y finalmente completar CI y restauración probada. Las validaciones deben hacerse en staging/local, nunca mediante experimentación destructiva sobre producción.

### Aspectos suficientemente bien implementados

- No hay fundamento para reescribir todo el sistema: el uso de Next App Router, módulos `lib`, componentes y Postgres es adecuado para una primera versión.
- La estructura RLS extensa, la separación de anon/service role, los schemas Zod y el uso de `auth.getUser()` en diversas acciones son bases correctas, aunque falta probar cobertura y configuración real.
- Las migraciones reflejan un esfuerzo explícito de modelado e índices; los workflows de backup y smoke y la documentación de arquitectura dan una base operativa que se puede endurecer.
- La evidencia accesible no indica credenciales reales versionadas ni inyección SQL confirmada.

## Limitaciones exactas de la revisión

- Solo se inspeccionaron contenidos versionados accesibles en GitHub en commit `84a8624fd6bf6c2155ad14b885d2171acc67c7ce`; árbol reportado no truncado.
- No se tuvo shell/workspace ni acceso a secretos o paneles de GitHub, Supabase o Vercel.
- No se instalaron dependencias; no se ejecutaron lint, typecheck, unit tests, Playwright, build ni escaneo CVE. Por ende, no hay resultados de pruebas que puedan reportarse como pasados/fallidos.
- No se inspeccionaron todas las páginas individualmente al nivel de cada línea ni se renderizó la UI; las conclusiones de accesibilidad son de riesgo estático, no certificación WCAG.
- No se hizo prueba de penetración, llamada a RPC, lectura de datos reales o prueba de escritura; no se alteraron datos ni configuraciones.
- No puede confirmarse qué migrations/grants están aplicados en la base desplegada, si hay reglas adicionales fuera del repositorio, si el backup funciona o si los artifacts son descargables/restaurables.

---

**Fin del informe.** Este documento es un diagnóstico estático y no reemplaza pruebas de seguridad autorizadas, validación de producción ni revisión legal/regulatoria.
