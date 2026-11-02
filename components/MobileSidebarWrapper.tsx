'use client';

import { useState, useEffect } from 'react';
import { IconMenu2, IconX, IconRefresh } from '@tabler/icons-react';

export default function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setUpdateAvailable(true);
        }
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    window.location.reload();
  };

  return (
    <>
      {/* Botón de menú hamburguesa (solo visible en celular) */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <button
          onClick={() => setIsOpen(true)}
          className='p-2 bg-kuati-petroleo text-kuati-blanco rounded-lg shadow-md hover:bg-kuati-petroleo/90 transition-colors'
          aria-label='Abrir menú'
        >
          <IconMenu2 size={24} />
        </button>
      </div>

      {/* Botón de actualización (si hay nueva versión) */}
      {updateAvailable && (
        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
          <button
            onClick={handleUpdate}
            className='flex items-center gap-2 bg-kuati-lima text-kuati-petroleo px-6 py-3 rounded-full font-bold shadow-lg hover:bg-kuati-lima/90 transition-colors'
          >
            <IconRefresh size={20} />
            Nueva versión disponible. Actualizar
          </button>
        </div>
      )}

      {/* Overlay oscuro cuando el sidebar está abierto en celular */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contenedor del Sidebar */}
      <div
        className={
          'fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 transform transition-transform duration-300 ease-in-out bg-kuati-petroleo ' +
          (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
        }
      >
        {/* Botón de cerrar (solo en celular) */}
        <div className='md:hidden absolute top-4 right-4 z-10'>
          <button
            onClick={() => setIsOpen(false)}
            className='p-2 bg-kuati-petroleo/50 text-kuati-blanco rounded-lg hover:bg-kuati-petroleo/80 transition-colors'
            aria-label='Cerrar menú'
          >
            <IconX size={20} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
