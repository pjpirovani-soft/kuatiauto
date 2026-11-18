'use client';

import { useEffect, useState } from 'react';
import { IconDownload, IconApple, IconBrandAndroid, IconX } from '@tabler/icons-react';
import {
  type BeforeInstallPromptEvent,
  isStandalone,
  isIOS,
  canPromptInstall,
} from '@/lib/pwa';

type Estado = 'cargando' | 'instalada' | 'disponible' | 'ios' | 'no-soportado';

export default function BotonInstalarApp() {
  const [estado, setEstado] = useState<Estado>('cargando');
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrandoInstrucciones, setMostrandoInstrucciones] = useState(false);
  const [instalando, setInstalando] = useState(false);

  useEffect(() => {
    // Si ya está instalada (standalone), no mostrar nada.
    if (isStandalone()) {
      setEstado('instalada');
      return;
    }

    // iOS: no hay beforeinstallprompt, mostrar instrucciones.
    if (isIOS()) {
      setEstado('ios');
      return;
    }

    // Otros navegadores sin soporte (Firefox, Safari desktop): no mostrar.
    if (!canPromptInstall()) {
      setEstado('no-soportado');
      return;
    }

    // Chromium: escuchar beforeinstallprompt.
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setEstado('disponible');
    }

    // Si ya se instaló mientras la pestaña estaba abierta.
    function onAppInstalled() {
      setPromptEvent(null);
      setEstado('instalada');
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    // Si en 2s no llegó el evento, marcar como no soportado.
    // (Chromium emite el evento después de que la PWA es instalable, lo que requiere
    // que el service worker esté registrado y el manifest válido.)
    const timeout = setTimeout(() => {
      setEstado((prev) => (prev === 'cargando' ? 'no-soportado' : prev));
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
      clearTimeout(timeout);
    };
  }, []);

  async function instalar() {
    if (!promptEvent) return;
    setInstalando(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setEstado('instalada');
      }
      setPromptEvent(null);
    } catch (e) {
      console.warn('[pwa] prompt error:', e);
    } finally {
      setInstalando(false);
    }
  }

  if (estado === 'cargando' || estado === 'instalada' || estado === 'no-soportado') {
    return null;
  }

  return (
    <>
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-4 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-kuati-petroleo/10 rounded-lg flex items-center justify-center text-kuati-petroleo shrink-0'>
            {estado === 'ios' ? <IconApple size={22} /> : <IconBrandAndroid size={22} />}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-kuati-petroleo text-sm'>Instalá KuatiAuto</h3>
            <p className='text-xs text-kuati-grafito/70 mt-1'>
              {estado === 'ios'
                ? 'Agregala a tu pantalla de inicio para abrirla como app.'
                : 'Accedé más rápido desde tu pantalla de inicio.'}
            </p>
            <div className='mt-3'>
              {estado === 'disponible' && (
                <button
                  type='button'
                  onClick={instalar}
                  disabled={instalando}
                  className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg text-sm font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
                >
                  <IconDownload size={16} />
                  {instalando ? 'Instalando...' : 'Instalar app'}
                </button>
              )}
              {estado === 'ios' && (
                <button
                  type='button'
                  onClick={() => setMostrandoInstrucciones(true)}
                  className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg text-sm font-semibold hover:bg-kuati-petroleo/90 transition-colors'
                >
                  <IconDownload size={16} />
                  Ver instrucciones
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {mostrandoInstrucciones && (
        <div className='fixed inset-0 z-[100] bg-kuati-grafito/60 flex items-center justify-center p-4' role='dialog' aria-modal='true'>
          <div className='bg-kuati-blanco rounded-xl max-w-md w-full p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-4'>
              <h3 className='text-lg font-bold text-kuati-petroleo'>Instalar en iPhone / iPad</h3>
              <button
                type='button'
                onClick={() => setMostrandoInstrucciones(false)}
                className='text-kuati-grafito/60 hover:text-kuati-grafito p-1'
                aria-label='Cerrar'
              >
                <IconX size={20} />
              </button>
            </div>
            <ol className='space-y-3 text-sm text-kuati-grafito'>
              <li className='flex gap-3'>
                <span className='shrink-0 w-6 h-6 rounded-full bg-kuati-petroleo/10 text-kuati-petroleo flex items-center justify-center font-semibold text-xs'>1</span>
                <span>Abrí KuatiAuto en <strong>Safari</strong> (no Chrome ni otro navegador).</span>
              </li>
              <li className='flex gap-3'>
                <span className='shrink-0 w-6 h-6 rounded-full bg-kuati-petroleo/10 text-kuati-petroleo flex items-center justify-center font-semibold text-xs'>2</span>
                <span>Tocá el botón <strong>Compartir</strong> (el cuadrado con flecha hacia arriba).</span>
              </li>
              <li className='flex gap-3'>
                <span className='shrink-0 w-6 h-6 rounded-full bg-kuati-petroleo/10 text-kuati-petroleo flex items-center justify-center font-semibold text-xs'>3</span>
                <span>Buscá y tocá <strong>Agregar a pantalla de inicio</strong>.</span>
              </li>
              <li className='flex gap-3'>
                <span className='shrink-0 w-6 h-6 rounded-full bg-kuati-petroleo/10 text-kuati-petroleo flex items-center justify-center font-semibold text-xs'>4</span>
                <span>Confirmá con <strong>Agregar</strong>. Vas a ver el ícono de KuatiAuto en tu inicio.</span>
              </li>
            </ol>
            <button
              type='button'
              onClick={() => setMostrandoInstrucciones(false)}
              className='mt-6 w-full bg-kuati-petroleo text-kuati-blanco px-4 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors'
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}