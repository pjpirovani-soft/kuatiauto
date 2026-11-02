'use client';

import { useState } from 'react';
import { IconList, IconX } from '@tabler/icons-react';
import type { AyudaSeccionData } from '@/lib/ayuda/types';

type Props = {
  secciones: AyudaSeccionData[];
};

export default function AyudaIndiceLateral({ secciones }: Props) {
  const [abiertoMobile, setAbiertoMobile] = useState(false);

  const lista = (
    <nav className='space-y-1'>
      {secciones.map((s) => (
        <a
          key={s.id}
          href={'#' + s.id}
          onClick={() => setAbiertoMobile(false)}
          className='block px-3 py-2 text-sm rounded-lg text-kuati-grafito/80 hover:bg-kuati-fondo hover:text-kuati-petroleo transition-colors'
        >
          {s.titulo}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Botón flotante en mobile */}
      <button
        type='button'
        onClick={() => setAbiertoMobile(true)}
        className='lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-3 rounded-full shadow-lg hover:bg-kuati-petroleo/90 transition-colors'
        aria-label='Abrir índice'
      >
        <IconList size={20} />
        <span className='text-sm font-semibold'>Índice</span>
      </button>

      {/* Drawer en mobile */}
      {abiertoMobile && (
        <div
          className='lg:hidden fixed inset-0 z-50 bg-black/40'
          onClick={() => setAbiertoMobile(false)}
        >
          <div
            className='absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-kuati-blanco shadow-xl p-4 overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-bold text-kuati-petroleo'>Índice</h3>
              <button
                type='button'
                onClick={() => setAbiertoMobile(false)}
                className='p-1 text-kuati-grafito/60 hover:text-kuati-grafito'
                aria-label='Cerrar índice'
              >
                <IconX size={20} />
              </button>
            </div>
            {lista}
          </div>
        </div>
      )}

      {/* Sidebar sticky en desktop */}
      <aside className='hidden lg:block'>
        <div className='sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto bg-kuati-blanco rounded-xl border border-kuati-borde p-4 shadow-sm'>
          <h3 className='font-bold text-kuati-petroleo mb-3 text-sm uppercase tracking-wide'>
            En esta guía
          </h3>
          {lista}
        </div>
      </aside>
    </>
  );
}