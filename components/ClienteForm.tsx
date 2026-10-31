'use client';

import { useState } from 'react';
import Link from 'next/link';

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
}

export function ClienteForm({ action, initialData, title, redirectTo = '/clientes' }: ClienteFormProps) {
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
      window.location.href = redirectTo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre *</label>
          <input id="nombre" name="nombre" type="text" required defaultValue={initialData?.nombre ?? ''} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" defaultValue={initialData?.email ?? ''} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium mb-1">Telefono</label>
          <input id="telefono" name="telefono" type="text" defaultValue={initialData?.telefono ?? ''} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="notas" className="block text-sm font-medium mb-1">Notas</label>
          <textarea id="notas" name="notas" rows={3} defaultValue={initialData?.notas ?? ''} className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <Link href={redirectTo} className="text-gray-600 hover:underline text-sm">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
