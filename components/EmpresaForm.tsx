'use client';

import { useState } from 'react';

type ActionResult =
  | { ok: true; empresaId: string }
  | { ok: false; error: string };

interface EmpresaFormProps {
  action: (input: unknown) => Promise<ActionResult>;
}

export function EmpresaForm({ action }: EmpresaFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const input = {
        nombre: String(formData.get('nombre') ?? '').trim(),
        telefono: String(formData.get('telefono') ?? '').trim() || null,
        ruc: String(formData.get('ruc') ?? '').trim() || null,
        direccion: String(formData.get('direccion') ?? '').trim() || null,
      };
      const result = await action(input);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.location.href = '/clientes';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito bg-kuati-blanco focus:outline-none focus:ring-2 focus:ring-kuati-petroleo focus:border-transparent transition-all';
  const labelClass = 'block text-sm font-semibold text-kuati-grafito mb-1.5';

  return (
    <div className='max-w-2xl mx-auto bg-kuati-blanco rounded-xl border border-kuati-borde p-8 shadow-sm'>
      <h2 className='text-2xl font-bold text-kuati-petroleo mb-2'>Crear empresa</h2>
      <p className='text-kuati-grafito/80 text-sm mb-6'>
        Cargá los datos de tu lubricentro o taller. Después vas a poder gestionar clientes y vehículos.
      </p>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='nombre' className={labelClass}>Nombre de la empresa *</label>
          <input id='nombre' name='nombre' type='text' required minLength={2} className={inputClass} />
        </div>

        <div>
          <label htmlFor='telefono' className={labelClass}>Teléfono</label>
          <input id='telefono' name='telefono' type='text' className={inputClass} />
        </div>

        <div>
          <label htmlFor='ruc' className={labelClass}>RUC</label>
          <input id='ruc' name='ruc' type='text' className={inputClass} />
        </div>

        <div>
          <label htmlFor='direccion' className={labelClass}>Dirección</label>
          <input id='direccion' name='direccion' type='text' className={inputClass} />
        </div>

        {error && (
          <p role='alert' className='text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm'>
            {error}
          </p>
        )}

        <div className='flex items-center gap-3 pt-4'>
          <button
            type='submit'
            disabled={loading}
            className='bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Creando...' : 'Crear empresa'}
          </button>
        </div>
      </form>
    </div>
  );
}