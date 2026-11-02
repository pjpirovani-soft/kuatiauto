'use client';

import { useState, useMemo } from 'react';
import { IconSearch, IconCar, IconChevronRight, IconArrowLeft } from '@tabler/icons-react';
import VehiculoForm from '@/components/VehiculoForm';
import type {
  ClienteRecepcion,
  VehiculoRecepcion,
} from '@/app/(dashboard)/recepcion/page';

type Props = {
  cliente: ClienteRecepcion;
  vehiculos: VehiculoRecepcion[];
  onSeleccionar: (vehiculo: VehiculoRecepcion) => void;
  onVolver: () => void;
};

export default function PasoVehiculo({ cliente, vehiculos, onSeleccionar, onVolver }: Props) {
  const [query, setQuery] = useState('');
  const [mostrandoForm, setMostrandoForm] = useState(false);

  const vehiculosCliente = useMemo(
    () => vehiculos.filter((v) => v.cliente_id === cliente.id),
    [vehiculos, cliente.id],
  );

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehiculosCliente;
    return vehiculosCliente.filter(
      (v) =>
        (v.patente ?? '').toLowerCase().includes(q) ||
        (v.marca ?? '').toLowerCase().includes(q) ||
        (v.modelo ?? '').toLowerCase().includes(q),
    );
  }, [vehiculosCliente, query]);

  if (mostrandoForm) {
    return (
      <div className='space-y-4'>
        <button
          type='button'
          onClick={() => setMostrandoForm(false)}
          className='text-sm text-kuati-petroleo hover:underline'
        >
          ← Volver a la búsqueda
        </button>
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
          <h2 className='text-2xl font-bold text-kuati-petroleo mb-4'>Nuevo vehículo</h2>
          <p className='text-sm text-kuati-grafito/70 mb-4'>Cliente: {cliente.nombre}</p>
          <VehiculoForm
            modo='crear'
            clientes={[cliente]}
            onSuccess={(data) => {
              onSeleccionar({
                id: data.id,
                cliente_id: cliente.id,
                marca: null,
                modelo: null,
                patente: null,
                anio: null,
                km_actual: null,
              });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold text-kuati-petroleo'>Paso 2: Vehículo</h2>
        <button
          type='button'
          onClick={onVolver}
          className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors'
        >
          <IconArrowLeft size={16} /> Volver
        </button>
      </div>

      <p className='text-sm text-kuati-grafito/70 mb-4'>Cliente: {cliente.nombre}</p>

      <div className='relative mb-4'>
        <IconSearch
          size={18}
          className='absolute left-3 top-1/2 -translate-y-1/2 text-kuati-grafito/40'
        />
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Buscar por patente, marca o modelo...'
          autoFocus
          className='w-full border border-kuati-borde rounded-lg pl-10 pr-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
        />
      </div>

      {filtrados.length === 0 ? (
        <div className='text-center py-8 space-y-3'>
          <IconCar size={40} className='mx-auto text-kuati-grafito/30' />
          <p className='text-kuati-grafito/70 text-sm'>
            {vehiculosCliente.length === 0
              ? 'Este cliente no tiene vehículos cargados.'
              : `No se encontraron vehículos para "${query}".`}
          </p>
          <button
            type='button'
            onClick={() => setMostrandoForm(true)}
            className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors text-sm'
          >
            <IconCar size={18} />
            Crear vehículo nuevo
          </button>
        </div>
      ) : (
        <>
          <ul className='divide-y divide-kuati-borde border border-kuati-borde rounded-lg overflow-hidden'>
            {filtrados.map((v) => (
              <li key={v.id}>
                <button
                  type='button'
                  onClick={() => onSeleccionar(v)}
                  className='w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-kuati-fondo transition-colors text-left'
                >
                  <div className='min-w-0'>
                    <p className='font-medium text-kuati-grafito truncate'>
                      {v.marca ?? '?'} {v.modelo ?? '?'}
                      {v.anio ? ` (${v.anio})` : ''}
                    </p>
                    {v.patente && (
                      <p className='text-xs text-kuati-grafito/60 font-mono'>{v.patente}</p>
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
            <IconCar size={18} />
            ¿No está? Crear vehículo nuevo
          </button>
        </>
      )}
    </div>
  );
}