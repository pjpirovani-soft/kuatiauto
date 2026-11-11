'use client';

import { useEffect, useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';

export default function RegistroSW() {
  const [nuevaVersion, setNuevaVersion] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration;

    window.addEventListener('load', async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js');

        // Detectar si hay una actualizacion esperando
        if (registration.waiting) {
          setNuevaVersion(registration.waiting);
        }

        // Escuchar nuevas actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setNuevaVersion(newWorker);
            }
          });
        });
      } catch (error) {
        console.warn('[SW] Error registrando:', error);
      }
    });
  }, []);

  function actualizar() {
    if (!nuevaVersion) return;
    nuevaVersion.postMessage('SKIP_WAITING');
    window.location.reload();
  }

  if (!nuevaVersion) return null;

  return (
    <div className='fixed bottom-4 right-4 z-[100] bg-kuati-petroleo text-kuati-blanco px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm'>
      <div className='flex-1'>
        <p className='text-sm font-semibold'>Nueva version disponible</p>
        <p className='text-xs text-kuati-blanco/70'>Actualiza para ver las ultimas mejoras.</p>
      </div>
      <button
        onClick={actualizar}
        className='bg-kuati-lima text-kuati-petroleo px-3 py-1.5 rounded font-semibold text-sm hover:bg-kuati-lima/90 transition-colors flex items-center gap-1'
      >
        <IconRefresh size={14} />
        Actualizar
      </button>
    </div>
  );
}