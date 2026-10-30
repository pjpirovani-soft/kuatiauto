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


## Costes y sostenibilidad (F8 — 2026-10-30)

**Principio:** todo free tier. No se paga nada hasta que el proyecto lo justifique con uso real. Si el proyecto escala, se evalúa.

### Free tiers del stack

| Servicio | Free tier | Límite | Al superar |
|---|---|---|---|
| Vercel | Hobby | 100 GB bandwidth/mes, 100 GB-h compute | Evaluar (Pro $20/mes) |
| Supabase | Free | 500 MB DB, 1 GB storage, 50k MAU, 2 GB egress | Evaluar (Pro $25/mes) |
| Resend | Free | 100 emails/día, 3000/mes | Evaluar ($20/mes) |
| Sentry | Free | 5k eventos/mes | Evaluar o desactivar |
| Leaflet + OSM | Gratis | Sin límite (Nominatim 1 req/seg) | — |
| GitHub | Free | Repos ilimitados, Actions 2000 min/mes | — |
| Dominio `.com.py` | — | — | ~$15-30/año (NIC.py) |

**Único costo real en MVP:** dominio `.com.py` (~$15-30/año, ~$2/mes). Todo lo demás, free tier.

### Escenarios

**Escenario 1 — Prueba (0-5 establecimientos):**
- Vercel Hobby, Supabase Free, Resend Free, Sentry Free, OSM.
- Costo: **$0/mes** + dominio (~$2/mes).
- Límites: 500 MB DB, 1 GB storage, 3000 emails/mes. Suficiente para 5 establecimientos con ~100 clientes cada uno.

**Escenario 2 — Primeros establecimientos (5-50):**
- Mismos free tiers. Posiblemente se acerque al límite de Supabase Free (500 MB).
- Costo: **$0/mes** hasta que se supere el free tier.
- Cuándo evaluar: si la DB supera 400 MB o hay más de 10k emails/mes.

**Escenario 3 — Crecimiento moderado (50-500):**
- Si se supera el free tier, evaluar Supabase Pro ($25/mes) + Vercel Pro ($20/mes) + Resend ($20/mes) = ~$65/mes.
- **No se paga hasta que el proyecto genere ingresos o el piloto lo justifique.**

**Escenario 4 — Crecimiento importante (500+):**
- Vercel Enterprise o self-hosted, Supabase Team. ~$1200/mes.
- **Muy lejos del MVP. Se evalúa cuando se llegue.**

### Regla de oro

> **No se paga nada hasta que el proyecto lo justifique con uso real o ingresos.** El free tier es el plan. Si escala, se evalúa. Si no escala, no se paga.

### Cuándo se empieza a pagar

- **Dominio `.com.py`:** cuando el piloto confirme que va a probar la plataforma (es el único costo real del MVP).
- **Vercel / Supabase / Resend / Sentry:** solo si se supera el free tier. Se monitorea mensualmente.
- **Nunca** se paga por adelantado ni se asume que el proyecto va a escalar.

### Decisiones de F8 (por delegación)

- D-F8-1: todo free tier. Único costo real en MVP: dominio `.com.py` (~$2/mes).
- D-F8-2: monitoreo mensual de límites. Si se acerca al límite, evaluar. No pagar por adelantado.
- D-F8-3: si el proyecto escala, se evalúan los escenarios 3 y 4. Hasta entonces, $0/mes.
## Modelo comercial (F12 — 2026-10-30)

### Planes

- **MVP:** plan unico free. Sin cobro. Todas las funcionalidades del MVP disponibles para todos los pilotos.
- **v2 (tentativo):** 3 tiers.
  - **Free:** 1 establecimiento, funcionalidades del MVP, sin exportacion.
  - **Pro:** Gs. 150.000/mes por establecimiento. Multi-establecimiento, exportacion, reportes.
  - **Business:** a definir. Multi-empresa, catalogo editable, API.

### Limites por plan

- **MVP:** 1 empresa por usuario (D-F3-1). Establecimientos y vehiculos sin tope duro. Monitoreo mensual de uso.
- **v2:** limites por tier en la tabla de planes. Gating por feature flag en server actions.

### Funcionalidades premium diferidas a v2

- Multi-empresa (mas de 1 empresa por usuario).
- Exportacion de datos (CSV, PDF).
- Reportes avanzados (rentabilidad, productividad, stock proyectado).
- Portal del conductor con historial extendido (mas alla de lo compartido).
- Catalogo editable por empresa (hoy: catalogo global + local limitado).

### Estrategia comercial

- **Canal MVP:** outbound directo al piloto + 5 talleres de la red del propietario. Sin paid ads.
- **CAC estimado MVP:** ~Gs. 0 (tiempo del propietario).
- **LTV estimado v2:** ~Gs. 1.800.000 por establecimiento (12 meses de Pro).
- **Retencion objetivo:** >80% anual en Pro.
- **Metrica norte MVP:** establecimientos activos con al menos 1 orden de trabajo cerrada por mes.

### Suscripciones y cobro

- **MVP:** sin cobro. Sin pasarela. Sin facturacion.
- **v2 temprana:** cobro manual por transferencia. Validacion de demanda antes de integrar pasarela.
- **v2 avanzada:** pasarela local (Bancard o Pagopar). Stripe solo si hay clientes fuera de PY (D1: establecimientos solo PY, asi que no prioritario).
- **Facturacion tributaria oficial:** sigue fuera del alcance (D9).

### Decisiones de F12 (por delegacion)

- **D-F12-1:** plan unico free en MVP. Sin freemium ni planes pagos. (PROPUESTA)
- **D-F12-2:** limites tecnicos suaves en MVP. 1 empresa por usuario. Sin tope duro de establecimientos ni vehiculos. Monitoreo mensual. (PROPUESTA)
- **D-F12-3:** funcionalidades premium diferidas a v2: multi-empresa, exportacion, reportes avanzados, portal extendido, catalogo editable. (PROPUESTA)
- **D-F12-4:** pricing tentativo v2: Gs. 150.000/mes por establecimiento, 3 tiers. Cobro manual en v2 temprana, pasarela en v2 avanzada. (PROPUESTA)
- **D-F12-5:** canal MVP: outbound directo + red del propietario. Sin paid ads. CAC ~ 0. (PROPUESTA)
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