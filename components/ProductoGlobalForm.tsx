"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  crearProductoGlobal,
  editarProductoGlobal,
  type ProductoGlobalRow,
} from "@/lib/admin-actions";

type Props =
  | { modo: "crear" }
  | { modo: "editar"; initialData: ProductoGlobalRow };

export function ProductoGlobalForm(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const esEditar = props.modo === "editar";
  const init = esEditar ? props.initialData : null;

  const [nombre, setNombre] = useState(init?.nombre ?? "");
  const [marca, setMarca] = useState(init?.marca ?? "");
  const [tipo, setTipo] = useState(init?.tipo ?? "");
  const [viscosidad, setViscosidad] = useState(init?.viscosidad ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const payload = {
        nombre,
        marca: marca || undefined,
        tipo: tipo || undefined,
        viscosidad: viscosidad || undefined,
      };
      const r = esEditar
        ? await editarProductoGlobal({ ...payload, id: init!.id })
        : await crearProductoGlobal(payload);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.push("/admin/catalogo/productos");
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            maxLength={80}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            maxLength={80}
            placeholder="Ej: Aceite, Filtro, Bujia"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Viscosidad</label>
        <input
          type="text"
          value={viscosidad}
          onChange={(e) => setViscosidad(e.target.value)}
          maxLength={40}
          placeholder="Ej: 10W-40, 5W-30"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {pending ? "Guardando..." : esEditar ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}