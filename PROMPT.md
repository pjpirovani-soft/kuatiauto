# PROMPT — kuatiauto

## Antes de actuar

Leer en este orden:
1. ROL.md — quién sos y cómo pensás.
2. CONVENCIONES.md — cómo escribir código.
3. DECISIONES.md — cómo decidir.
4. GLOSARIO.md — vocabulario del studio.
5. STATUS.md — estado actual.
6. SPEC.md — alcance del proyecto.

Después de leer, confirmar entendimiento y proponer el primer bloque.

Soy Pedro J. Pirovani, desarrollador freelance (Paraguay). Este proyecto es **kuatiauto** (tipo: web-app).

## Metodología obligatoria (20 reglas)

1. Recon primero: leer archivos antes de tocarlos.
2. Scripts en bloques cortos (max 60 lineas). Evitar here-strings gigantes.
3. Verificar con git status, git log, Test-Path antes de asumir.
4. Sin BOM: usar [System.IO.File]::WriteAllText con UTF8Encoding(false). Ver ENCODING.md.
5. Un commit por feature o grupo logico.
6. Documentar cada sesion en BITACORA.md + STATUS.md.
7. Explicar el por que de cada decision.
8. Si un Replace falla por CRLF, normalizar a LF antes.
9. Si hay mojibake, reescribir archivo completo con UTF-8 sin BOM.
10. Un bloque a la vez. Esperar output antes del siguiente.
11. **Nunca imprimir el VALOR de una key.** Solo el NOMBRE. Prohibido: cat .env, Get-Content .env, git show de .env, printenv, vercel env pull. Ver SEGURIDAD.md.
12. Here-strings: abre con at-comilla, cierra con comilla-at al inicio de linea.
13. Line endings: detectar CRLF vs LF antes de modificar. Nunca asumir LF.
14. Invocar scripts: powershell -ExecutionPolicy Bypass -File scripts/.../NN.ps1.
15. Scripts de fix: aceptar -NoCommit (dry-run). Correr con -NoCommit primero.
16. Nomenclatura: crear-*.ps1, actualizar-*.ps1, verificar-*.ps1, orquestar-*.ps1.
17. Scripts >150 lineas: crear/editar en VS Code. NUNCA pegar en consola.
18. Commits: Conventional Commits (feat, fix, docs, chore, security, perf, test).
19. Historial: git filter-repo (no git filter-branch).
20. vercel env ls miente con valores Sensitive. Verificar con env pull o dashboard.

## Stack

Next.js 16 (App Router), React 19, Tailwind 4, Supabase (PostgreSQL + RLS + Auth), Vercel, Zod, Vitest + RTL, GitHub Actions.

## Protocolo de sesion

1. **Empezar:** leer STATUS.md + ultimas 3 entradas de BITACORA.md + SPEC.md.
2. **Durante:** un bloque a la vez, verificar output antes del siguiente.
3. **Terminar:** tests verdes + build verde + BITACORA + STATUS + commit + push.

## Primer paso

Leer STATUS.md y SPEC.md antes de cualquier accion.
