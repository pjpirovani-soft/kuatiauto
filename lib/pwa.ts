// lib/pwa.ts
// Utilidades para detectar el estado de instalación PWA.
// El evento `beforeinstallprompt` solo lo emite Chromium (Android/desktop).
// En iOS Safari NO existe: se muestran instrucciones manuales.

export type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
};

/**
 * Detecta si la app corre en modo standalone (ya instalada).
 * - matchMedia('(display-mode: standalone)') = estándar.
 * - navigator.standalone = iOS Safari (propietario, no estándar).
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia('(display-mode: standalone)').matches;
  const ios = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mq || ios;
}

/**
 * Detecta si es iOS (iPhone/iPad).
 * - iPadOS 13+ se identifica como MacIntel con touch.
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS 13+ se reporta como Mac con touch
  return window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
}

/**
 * Detecta si el navegador soporta beforeinstallprompt (Chromium-based).
 */
export function canPromptInstall(): boolean {
  if (typeof window === 'undefined') return false;
  // Heurística: si es iOS, no. Si es Firefox/Safari desktop, tampoco.
  if (isIOS()) return false;
  const ua = window.navigator.userAgent;
  if (/Firefox|Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua)) return false;
  return true;
}