# SPEC — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

Especificación funcional. Estado: **Fase 0 — esqueleto**. Se llena en F1 (definición de producto) y se cierra en F14.

## 1. Identidad del producto

- **Nombre:** KuatiAuto (provisional)
- **Qué es:** Plataforma SaaS multiempresa de gestión y mantenimiento automotor para Paraguay.
- **Qué NO es:** No es un ERP de taller, no emite facturación tributaria oficial (D9), no es un marketplace de repuestos en MVP.

## 2. Alcance MVP (aprobado por D-P1, revisable)

Módulos incluidos:

1. **Gestión multiempresa** — auth, empresas, establecimientos, clientes, vehículos, órdenes de trabajo.
2. **Catálogo mínimo** — datos que el piloto usa (aceite, filtro, intervalos básicos).
3. **Admin general mínimo** — alta/baja de empresas, catálogo global.

Módulos explícitamente fuera del MVP (v2):

- Directorio público geolocalizado.
- Portal del conductor (cuenta propia).
- Notificaciones automáticas por email/push.
- Facturación electrónica (fuera incluso de v2 según D9; integración opcional futura).
- Marketplace de repuestos, seguros, grúas.

## 3. Usuarios y roles (esqueleto, se cierra en F2)

| Rol | Alcance | MVP |
|---|---|---|
| Administrador general | Plataforma | Sí (mínimo) |
| Propietario de empresa | Empresa | Sí |
| Empleado | Empresa | Sí (mismo permiso que propietario salvo gestión de usuarios) |
| Conductor/cliente particular | Plataforma | No (v2) |
| Visitante sin cuenta | Público | No aplica en MVP |
| Verificador de catálogo | Plataforma | No (manual por admin en MVP) |

Matriz completa de permisos → F2.

## 4. Riesgos abiertos

| ID | Riesgo | Severidad | Fase que lo cierra |
|---|---|---|---|
| R1 | Ambigüedad de entidad vehículo | Alto | F3 (mitigado por ADR-002) |
| R2 | RLS mal diseñada en multiempresa | Alto | F3 + F4 |
| R3 | Catálogo sin fuente | Medio-alto | F6 |
| R4 | Free tier como falsa economía | Medio | F8 |
| R5 | Alcance MVP inflado | Medio | F1 (cerrado por D-P1) |
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

Se definen en F1 (funcional) y F4 (seguridad). Estructura obligatoria:

- [ ] Criterio funcional verificable (test manual o automatizado).
- [ ] Criterio de seguridad verificable (test positivo + negativo).
- [ ] Evidencia en `BITACORA.md`.

## 6. Fuera de alcance permanente (hasta nueva decisión)

- Facturación tributaria oficial.
- Reconocimiento facial, biometría.
- App móvil nativa (la web responsive cubre MVP).
- Integraciones con aseguradoras, bancos, SET.

## 7. Decisiones pendientes

- **P-Nombre:** verificar redes (@kuatiauto) y DINAPI antes de declarar `KuatiAuto` definitivo.
- **P-Piloto:** confirmar los 5 campos críticos de `CLIENTE.md`.
- **P-Dominio:** registrar `kuatiauto.com.py` cuando el piloto justifique el costo.

## 8. Fases

1. [ ] F0 — Punto de partida (este doc + ARCHITECTURE + SESSION-STATE + GLOSARIO + CLIENTE)
2. [ ] F1 — Definición de producto y alcance MVP
3. [ ] F2 — Usuarios, roles y permisos
4. [ ] F3 — Arquitectura multiempresa (bloqueante, crítica)
5. [ ] F4 — Seguridad y modelo de amenazas (bloqueante, crítica)
6. [ ] F5 — Modelo conceptual y BD
7. [ ] F6 — Base de conocimiento automotriz
8. [ ] F7 — Arquitectura tecnológica
9. [ ] F8 — Costos y límites free tier
10. [ ] F9 — Privacidad y datos personales
11. [ ] F10 — Geolocalización y directorio
12. [ ] F11 — Recordatorios y notificaciones
13. [ ] F12 — Modelo comercial
14. [ ] F13 — Operación y continuidad
15. [ ] F14 — Plan de implementación