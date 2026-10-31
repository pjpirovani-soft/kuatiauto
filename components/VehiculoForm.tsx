'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearVehiculo, editarVehiculo } from '@/lib/vehiculos-actions';

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
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Cliente</label>
        <select
          name="cliente_id"
          required
          defaultValue={initialData?.cliente_id ?? ''}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
        >
          <option value="" disabled>
            Elegí un cliente
          </option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Marca</label>
          <input
            name="marca"
            required
            maxLength={60}
            defaultValue={initialData?.marca ?? ''}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Modelo</label>
          <input
            name="modelo"
            required
            maxLength={60}
            defaultValue={initialData?.modelo ?? ''}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <input
            name="anio"
            type="number"
            min={1900}
            max={2100}
            defaultValue={initialData?.anio ?? ''}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Patente</label>
          <input
            name="patente"
            maxLength={20}
            defaultValue={initialData?.patente ?? ''}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Km actual</label>
          <input
            name="km_actual"
            type="number"
            min={0}
            defaultValue={initialData?.km_actual ?? ''}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea
          name="notas"
          maxLength={500}
          rows={3}
          defaultValue={initialData?.notas ?? ''}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? 'Guardando...' : modo === 'crear' ? 'Crear vehículo' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}