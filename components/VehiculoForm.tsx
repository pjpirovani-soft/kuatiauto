'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearVehiculo, editarVehiculo } from '@/lib/vehiculos-actions';
import { IconLoader2 } from '@tabler/icons-react';

type Cliente = { id: string; nombre: string };

type VehiculoData = {
  id: string;
  cliente_id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  patente: string | null;
  km_actual: number | null;
  notas: string | null;
};

type Props =
  | { modo: 'crear'; clientes: Cliente[]; initialData?: undefined }
  | { modo: 'editar'; clientes: Cliente[]; initialData: VehiculoData };

export default function VehiculoForm({ modo, clientes, initialData }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      cliente_id: String(fd.get('cliente_id') ?? ''),
      marca: String(fd.get('marca') ?? ''),
      modelo: String(fd.get('modelo') ?? ''),
      anio: fd.get('anio') ? String(fd.get('anio')) : null,
      patente: fd.get('patente') ? String(fd.get('patente')) : null,
      km_actual: fd.get('km_actual') ? String(fd.get('km_actual')) : undefined,
      notas: fd.get('notas') ? String(fd.get('notas')) : null,
    };

    const res =
      modo === 'crear'
        ? await crearVehiculo(payload)
        : await editarVehiculo({ ...payload, id: initialData.id });

    setPending(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    router.push('/vehiculos');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className='space-y-5'>
      <div>
        <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Cliente</label>
        <select
          name='cliente_id'
          required
          defaultValue={initialData?.cliente_id ?? ''}
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito bg-kuati-blanco focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
        >
          <option value='' disabled>
            Elegí un cliente
          </option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Marca</label>
          <input
            name='marca'
            required
            maxLength={60}
            defaultValue={initialData?.marca ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            placeholder='Ej. Toyota'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Modelo</label>
          <input
            name='modelo'
            required
            maxLength={60}
            defaultValue={initialData?.modelo ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            placeholder='Ej. Corolla'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Año</label>
          <input
            name='anio'
            type='number'
            min={1900}
            max={2100}
            defaultValue={initialData?.anio ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            placeholder='2020'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Patente</label>
          <input
            name='patente'
            maxLength={20}
            defaultValue={initialData?.patente ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all uppercase'
            placeholder='ABC123'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Km actual</label>
          <input
            name='km_actual'
            type='number'
            min={0}
            defaultValue={initialData?.km_actual ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            placeholder='120000'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Notas</label>
        <textarea
          name='notas'
          maxLength={500}
          rows={3}
          defaultValue={initialData?.notas ?? ''}
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all min-h-[100px] resize-y'
          placeholder='Detalles adicionales del vehículo...'
        />
      </div>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>{error}</div>
      )}

      <div className='flex flex-col sm:flex-row items-center gap-3 pt-2'>
        <button
          type='submit'
          disabled={pending}
          className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
        >
          {pending && <IconLoader2 size={18} className='animate-spin' />}
          {pending ? 'Guardando...' : modo === 'crear' ? 'Crear vehículo' : 'Guardar cambios'}
        </button>
        <button
          type='button'
          onClick={() => router.back()}
          className='w-full sm:w-auto text-center border border-kuati-borde text-kuati-grafito px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-fondo transition-colors'
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
