'use client';

import { useState } from 'react';
import { IconMenu2, IconX } from '@tabler/icons-react';

export default function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de menú hamburguesa (solo visible en celular) */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <button
          onClick={() => setIsOpen(true)}
          className='p-2 bg-kuati-petroleo text-kuati-blanco rounded-lg shadow-md'
          aria-label='Abrir menú'
        >
          <IconMenu2 size={24} />
        </button>
      </div>

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
          'fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ' +
          (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
        }
      >
        {/* Botón de cerrar (solo en celular) */}
        <div className='md:hidden absolute top-4 right-[-48px]'>
          <button
            onClick={() => setIsOpen(false)}
            className='p-2 bg-kuati-petroleo text-kuati-blanco rounded-lg shadow-md'
            aria-label='Cerrar menú'
          >
            <IconX size={24} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
