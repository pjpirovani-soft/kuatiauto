'use client';

import { useState, useMemo } from 'react';
import { IconSearch, IconUserPlus, IconChevronRight } from '@tabler/icons-react';
import { ClienteForm } from '@/components/ClienteForm';
import { crearCliente } from '@/lib/clientes-actions';
import type { ClienteRecepcion } from '@/app/(dashboard)/recepcion/page';

type Props = {
  clientes: ClienteRecepcion[];
  onSeleccionar: (cliente: ClienteRecepcion) => void;
};

export default function PasoCliente({ clientes, onSeleccionar }: Props) {
  const [query, setQuery] = useState('');
  const [mostrandoForm, setMostrandoForm] = useState(clientes.length === 0);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientes.slice(0, 20);
    return clientes
      .filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          (c.telefono ?? '').toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [clientes, query]);

  if (mostrandoForm) {
    return (
      <div className='space-y-4'>
        {clientes.length > 0 && (
          <button
            type='button'
            onClick={() => setMostrandoForm(false)}
            className='text-sm text-kuati-petroleo hover:underline'
          >
            ← Volver a la búsqueda
          </button>
        )}
        <ClienteForm
          action={crearCliente}
          title='Nuevo cliente'
          onSuccess={(data) => {
            const nuevo: ClienteRecepcion = {
              id: data.id,
              nombre: data.nombre,
              telefono: null,
            };
            onSeleccionar(nuevo);
          }}
        />
      </div>
    );
  }

  return (
    <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
      <h2 className='text-2xl font-bold text-kuati-petroleo mb-4'>Paso 1: Cliente</h2>

      <div className='relative mb-4'>
        <IconSearch
          size={18}
          className='absolute left-3 top-1/2 -translate-y-1/2 text-kuati-grafito/40'
        />
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Buscar por nombre o teléfono...'
          autoFocus
          className='w-full border border-kuati-borde rounded-lg pl-10 pr-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
        />
      </div>

      {filtrados.length === 0 ? (
        <div className='text-center py-8 space-y-3'>
          <p className='text-kuati-grafito/70 text-sm'>
            {query ? `No se encontraron clientes para "${query}".` : 'No hay clientes cargados todavía.'}
          </p>
          <button
            type='button'
            onClick={() => setMostrandoForm(true)}
            className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors text-sm'
          >
            <IconUserPlus size={18} />
            Crear cliente nuevo
          </button>
        </div>
      ) : (
        <>
          <ul className='divide-y divide-kuati-borde border border-kuati-borde rounded-lg overflow-hidden'>
            {filtrados.map((c) => (
              <li key={c.id}>
                <button
                  type='button'
                  onClick={() => onSeleccionar(c)}
                  className='w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-kuati-fondo transition-colors text-left'
                >
                  <div className='min-w-0'>
                    <p className='font-medium text-kuati-grafito truncate'>{c.nombre}</p>
                    {c.telefono && (
                      <p className='text-xs text-kuati-grafito/60'>{c.telefono}</p>
                    )}
                  </div>
                  <IconChevronRight size={18} className='text-kuati-grafito/40 shrink-0' />
                </button>
              </li>
            ))}
          </ul>

          <button
            type='button'
            onClick={() => setMostrandoForm(true)}
            className='mt-4 inline-flex items-center gap-2 text-kuati-petroleo hover:underline text-sm font-medium'
          >
            <IconUserPlus size={18} />
            ¿No está? Crear cliente nuevo
          </button>
        </>
      )}
    </div>
  );
}