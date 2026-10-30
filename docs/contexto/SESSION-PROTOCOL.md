# SESSION-PROTOCOL — kuatiauto

> **Archivo clave:** SESSION-STATE.md contiene el estado exacto entre sesiones. Leerlo primero.

## Arranque de sesion

1. Leer STATUS.md.
2. Leer ultimas 3 entradas de BITACORA.md.
$13. Leer SPEC.md si es la primera sesion.
3b. **Leer SESSION-STATE.md y verificar Open Loops.**
4. Verificar git status + git log -3.
5. Definir objetivo de la sesion (1-3 pasos).

## Durante la sesion

1. Un bloque a la vez.
2. Verificar output antes del siguiente bloque.
3. Documentar decisiones en el momento.

## Cierre de sesion

1. Tests verdes + build verde.
2. Actualizar BITACORA.md (entrada nueva).
$13. Actualizar STATUS.md (progreso + proximos 3 pasos).
3b. **Actualizar SESSION-STATE.md (estado, open loops, follow-ups, lecciones).**
4. Commit + push.
5. Anotar deuda pendiente.

## Volcado para nueva conversacion

Usar scripts/dump-studio.ps1 (copia al portapapeles).
