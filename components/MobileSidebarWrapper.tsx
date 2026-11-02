'use client';

import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import MobileTopBar from './MobileTopBar';

export default function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Barra superior solo para celular */}
      <MobileTopBar onMenuClick={() => setIsOpen(true)} />

      {/* Overlay oscuro cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contenedor del Sidebar */}
      <div
        className={
          'fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 transform transition-transform duration-300 ease-in-out ' +
          (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
        }
      >
        {/* Botón de cerrar (solo en celular) */}
        <div className='md:hidden absolute top-4 right-4 z-50'>
          <button
            onClick={() => setIsOpen(false)}
            className='p-2 text-kuati-blanco/80 hover:text-kuati-blanco bg-white/10 rounded-lg'
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
