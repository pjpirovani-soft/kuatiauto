# PROMPT MAESTRO — KUATIAUTO

**Guardado:** 2026-10-30
**Origen:** documento inicial del proyecto, entregado por el propietario.
**Estado:** fuente de verdad metodológica. No se modifica.

## Contenido del PROMPT MAESTRO

El documento completo tiene 12 secciones:

1. **Rol y objetivo** — equipo multidisciplinario, misión de diseñar KuatiAuto.
2. **Descripción del producto** — 4 componentes: SaaS de gestión, directorio público, portal del conductor, catálogo automotriz técnico.
3. **Contexto y restricciones** — 14 restricciones (Paraguay, multiempresa, Supabase, secretos, facturación fuera del MVP, etc.).
4. **Contexto del primer piloto** — Encarnación, datos pendientes, no inventar.
5. **Metodología de análisis** — crítica, justificación, alternativas, riesgos.
6. **Las 14 fases de definición** — F1 a F14 con contenido específico.
7. **Seguridad progresiva** — controles obligatorios, pruebas, documentación en docs existentes.
8. **Metodología de trabajo con el studio** — mapeo a docs, reglas, clasificación A/B/C/D.
9. **Criterios de calidad** — seguridad, integridad, mantenibilidad, escalabilidad, coste, rendimiento, UX, operación, dependencias, auditoría.
10. **Reglas de interacción** — español, técnico, objetivo, no validar automáticamente, no inventar, no adelantar fases.
11. **Resultado esperado** — 15 entregables al completar las 14 fases.
12. **Instrucción inicial** — diagnosticar, identificar decisiones/pendientes/contradicciones/riesgos, proponer F1. No programar.

## Las 14 fases (resumen)

| # | Fase |
|---|---|
| 1 | Definición del producto |
| 2 | Usuarios, roles y permisos |
| 3 | Arquitectura multiempresa |
| 4 | Arquitectura de seguridad |
| 5 | Modelo de datos |
| 6 | Catálogo automotriz |
| 7 | Stack tecnológico |
| 8 | Costes y sostenibilidad |
| 9 | Privacidad y datos |
| 10 | Directorio y geolocalización |
| 11 | Notificaciones y automatizaciones |
| 12 | Modelo comercial |
| 13 | Operación y continuidad |
| 14 | Plan de implementación |

## Los 4 componentes del producto

1. **SaaS de gestión empresarial** — lubricentros y talleres. Clientes, vehículos, historial, cambios de aceite, productos, servicios, inventario, recordatorios, informes, administración.
2. **Directorio público de establecimientos** — búsqueda por ubicación, geolocalización, filtros, perfil público, contacto, horarios.
3. **Portal del conductor** — cuenta propia, vehículos, historial, próximos mantenimientos, recordatorios, información técnica, localización de establecimientos.
4. **Catálogo automotriz técnico** — fabricantes, marcas, modelos, años, versiones, motorizaciones, cilindradas, combustibles, especificaciones de lubricantes, viscosidades SAE, API, ACEA, aprobaciones, capacidades, intervalos. **Regla: no inventar especificaciones. Cada dato con fuente, fecha, estado de validación.**

## Las 14 restricciones

1. Mercado inicial Paraguay.
2. Comercializable como SaaS.
3. Múltiples empresas independientes.
4. Datos de cada empresa aislados.
5. Directorio público separado conceptualmente de datos privados.
6. Arquitectura económicamente sostenible.
7. Servicios gratuitos cuando sea viable, sin comprometer seguridad.
8. Supabase/PostgreSQL como base inicial, sujeto a evaluación.
9. Cloudinary para imágenes, usos a definir.
10. Autenticación y correo transaccional con estrategia definida.
11. Secretos nunca en frontend ni repositorios.
12. Facturación electrónica y comprobantes tributarios fuera del MVP.
13. No incorporar funcionalidades tributarias por iniciativa propia.
14. No convertir una propuesta en decisión aprobada sin autorización.

## Clasificación de decisiones

- **APROBADA:** confirmada explícitamente por el propietario.
- **PROPUESTA:** recomendación pendiente de aprobación.
- **PENDIENTE / VERIFICAR:** requiere información o investigación.
- **DESCARTADA:** evaluada y rechazada.

El registro de decisiones vive en `docs/contexto/DECISIONES.md`.