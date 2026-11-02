"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  crearServicioGlobal,
  editarServicioGlobal,
  type ServicioGlobalRow,
} from "@/lib/admin-actions";

type Props =
  | { modo: "crear" }
  | { modo: "editar"; initialData: ServicioGlobalRow };

export function ServicioGlobalForm(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const esEditar = props.modo === "editar";
  const init = esEditar ? props.initialData : null;

  const [nombre, setNombre] = useState(init?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(init?.descripcion ?? "");
  const [km, setKm] = useState(init?.intervalo_km_sugerido?.toString() ?? "");
  const [meses, setMeses] = useState(init?.intervalo_meses_sugerido?.toString() ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const payload = {
        nombre,
        descripcion: descripcion || undefined,
        intervalo_km_sugerido: km ? Number(km) : undefined,
        intervalo_meses_sugerido: meses ? Number(meses) : undefined,
      };
      const r = esEditar
        ? await editarServicioGlobal({ ...payload, id: init!.id })
        : await crearServicioGlobal(payload);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.push("/admin/catalogo/servicios");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl border border-gray-200 max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo km</label>
          <input
            type="number"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            min={1}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo meses</label>
          <input
            type="number"
            value={meses}
            onChange={(e) => setMeses(e.target.value)}
            min={1}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {pending ? "Guardando..." : esEditar ? "Guardar cambios" : "Crear servicio"}
        </button>
      </div>
    </form>
  );
}