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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-2">Crear empresa</h2>
      <p className="text-gray-600 text-sm mb-6">
        Cargá los datos de tu lubricentro o taller. Después vas a poder gestionar clientes y vehículos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre de la empresa *</label>
          <input id="nombre" name="nombre" type="text" required minLength={2} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium mb-1">Teléfono</label>
          <input id="telefono" name="telefono" type="text" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="ruc" className="block text-sm font-medium mb-1">RUC</label>
          <input id="ruc" name="ruc" type="text" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="direccion" className="block text-sm font-medium mb-1">Dirección</label>
          <input id="direccion" name="direccion" type="text" className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear empresa'}
          </button>
        </div>
      </form>
    </div>
  );
}