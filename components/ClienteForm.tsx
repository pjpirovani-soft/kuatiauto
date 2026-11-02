'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconLoader2 } from '@tabler/icons-react';

type ActionResult = { ok: true; data: { id: string } } | { ok: false; error: string };

interface ClienteFormProps {
  action: (input: unknown) => Promise<ActionResult>;
  initialData?: {
    id?: string;
    nombre: string;
    email: string | null;
    telefono: string | null;
    notas: string | null;
  };
  title: string;
  redirectTo?: string;
  /** Si se pasa, se llama al crear/editar exitosamente en vez de redirigir. */
  onSuccess?: (data: { id: string; nombre: string }) => void;
}

export function ClienteForm({
  action,
  initialData,
  title,
  redirectTo = '/clientes',
  onSuccess,
}: ClienteFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const input: Record<string, unknown> = {
        nombre: String(formData.get('nombre') ?? ''),
        email: String(formData.get('email') ?? '') || null,
        telefono: String(formData.get('telefono') ?? '') || null,
        notas: String(formData.get('notas') ?? '') || null,
      };
      if (initialData?.id) input.id = initialData.id;

      const result = await action(input);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (onSuccess) {
        onSuccess({ id: result.data.id, nombre: String(input.nombre) });
        return;
      }
      window.location.href = redirectTo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
      <h2 className='text-2xl font-bold text-kuati-petroleo mb-6'>{title}</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='nombre' className='block text-sm font-semibold text-kuati-grafito mb-1.5'>
            Nombre *
          </label>
          <input
            id='nombre'
            name='nombre'
            type='text'
            required
            defaultValue={initialData?.nombre ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
          />
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-semibold text-kuati-grafito mb-1.5'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            defaultValue={initialData?.email ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
          />
        </div>

        <div>
          <label htmlFor='telefono' className='block text-sm font-semibold text-kuati-grafito mb-1.5'>
            Teléfono
          </label>
          <input
            id='telefono'
            name='telefono'
            type='text'
            defaultValue={initialData?.telefono ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
          />
        </div>

        <div>
          <label htmlFor='notas' className='block text-sm font-semibold text-kuati-grafito mb-1.5'>
            Notas
          </label>
          <textarea
            id='notas'
            name='notas'
            rows={3}
            defaultValue={initialData?.notas ?? ''}
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all min-h-[100px] resize-y'
          />
        </div>

        {error && (
          <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>{error}</div>
        )}

        <div className='flex flex-col sm:flex-row items-center gap-3 pt-4'>
          <button
            type='submit'
            disabled={loading}
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
          >
            {loading && <IconLoader2 size={18} className='animate-spin' />}
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <Link href={redirectTo} className='w-full sm:w-auto text-center text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors font-medium text-sm py-2'>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}