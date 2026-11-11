'use client';

import { useState, useRef, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import MobileTopBar from './MobileTopBar';

export default function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Focus trap + mover foco al abrir
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    // Guardar el foco anterior para restaurarlo al cerrar
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Mover foco al panel
    const firstFocusable = panelRef.current.querySelector<HTMLElement>(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();

    // Focus trap
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (previouslyFocused) previouslyFocused.focus();
    };
  }, [isOpen]);

  return (
    <>
      <MobileTopBar onMenuClick={() => setIsOpen(true)} isOpen={isOpen} />

      {/* Overlay oscuro cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
          aria-hidden='true'
        />
      )}

      {/* Contenedor del Sidebar */}
      <div
        id='mobile-sidebar'
        ref={panelRef}
        role={isOpen ? 'dialog' : undefined}
        aria-modal={isOpen ? true : undefined}
        aria-label={isOpen ? 'Menu de navegacion' : undefined}
        className={
          'fixed md:sticky md:top-0 md:h-screen md:shrink-0 inset-y-0 left-0 z-50 w-72 md:w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto md:overflow-visible ' +
          (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
        }
      >
        {/* Botón de cerrar (solo en celular) */}
        <div className='md:hidden absolute top-4 right-4 z-50'>
          <button
            type='button'
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