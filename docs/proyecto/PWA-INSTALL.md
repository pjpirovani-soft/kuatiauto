# PWA Install — KuatiAuto

Guia de uso, comportamiento por navegador y troubleshooting del boton de instalacion PWA.

## Que es

KuatiAuto es una PWA (Progressive Web App): se puede **instalar como app** en celular y desktop, con icono en la pantalla de inicio, apertura standalone (sin barra de URL) y acceso offline basico via Service Worker.

## Componentes

| Archivo | Rol |
|---|---|
| `public/manifest.json` | Metadatos PWA: nombre, iconos, colores, `display: standalone` |
| `public/sw.js` | Service Worker con estrategia "nueva version disponible" (no auto-refresh) |
| `lib/pwa.ts` | Utilidades: `isStandalone`, `isIOS`, `canPromptInstall`, tipo `BeforeInstallPromptEvent` |
| `components/pwa/BotonInstalarApp.tsx` | Boton + modal de instrucciones iOS |
| `components/RegistroSW.tsx` | Registra el SW y muestra banner de actualizacion |
| `app/perfil/page.tsx` | Integra `<BotonInstalarApp />` arriba del PerfilForm |

## Comportamiento por navegador

| Navegador | Estado | Que ve el usuario |
|---|---|---|
| Chrome/Edge Android | `disponible` | Boton "Instalar app" -> prompt nativo |
| Chrome/Edge desktop | `disponible` | Boton "Instalar app" -> prompt nativo |
| Safari iOS | `ios` | Boton "Ver instrucciones" -> modal 4 pasos |
| Firefox | `no-soportado` | Nada (componente retorna null) |
| Safari desktop | `no-soportado` | Nada (componente retorna null) |
| App ya instalada | `instalada` | Nada (componente retorna null) |

## Como instalar (usuario)

### Android / Chrome / Edge
1. Ir a `/perfil`.
2. Tocar "Instalar app".
3. Aceptar el prompt del sistema.
4. Listo: icono en pantalla de inicio.

### iPhone / iPad (Safari)
1. Ir a `/perfil`.
2. Tocar "Ver instrucciones".
3. Seguir los 4 pasos del modal:
   1. Abrir en **Safari** (no Chrome).
   2. Tocar **Compartir** (cuadrado con flecha).
   3. Tocar **Agregar a pantalla de inicio**.
   4. Confirmar **Agregar**.

### Desktop (Chrome / Edge)
1. Ir a `/perfil`.
2. Tocar "Instalar app".
3. Aceptar el prompt.
4. Listo: icono en barra de tareas / escritorio.

## Por que `beforeinstallprompt` no funciona en iOS

**`beforeinstallprompt` es un evento que solo emite Chromium** (Chrome, Edge, Opera). **Safari no lo implementa.** Por eso en iOS el componente detecta `isIOS()` y muestra **instrucciones manuales** en vez de un boton de instalacion nativo.

## Por que el Service Worker no hace auto-refresh

El SW usa la estrategia **"nueva version disponible"**: cuando hay una actualizacion, `RegistroSW.tsx` muestra un banner "Actualizar". El usuario decide cuando. **No forzamos recarga** porque:
- El usuario podria estar completando un formulario y perder datos.
- Es la recomendacion de Google para PWAs con formularios.

## Troubleshooting

| Sintoma | Causa probable | Solucion |
|---|---|---|
| Boton "Instalar app" no aparece en Chrome Android | El `sw.js` no se registro todavia | Refrescar; verificar que `/sw.js` responde 200 |
| Boton no aparece en desktop | El navegador no soporta `beforeinstallprompt` | Usar Chrome o Edge |
| En iOS no aparece el boton nativo | Safari no soporta `beforeinstallprompt` | Es esperado: usar el modal de instrucciones |
| La app instalada no se actualiza | SW esperando confirmacion | Tocar "Actualizar" en el banner |
| Manifest warning en DevTools | Iconos faltantes o tamanios incorrectos | Verificar `public/icons/icon-192.png` y `icon-512.png` |

## Verificacion rapida (DevTools)

1. Abrir DevTools -> Application.
2. **Manifest**: verificar que carga sin errores.
3. **Service Workers**: verificar que esta "activated and running".
4. **Installability**: Lighthouse o Chrome DevTools -> "Install" (si esta disponible).