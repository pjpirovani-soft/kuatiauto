"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearServicioEmpresa, editarServicioEmpresa } from "@/lib/servicios-empresa-actions";

type ServicioData = {
  id?: string;
  nombre: string;
  descripcion: string;
};

type Props =
  | { modo: "crear" }
  | { modo: "editar"; initialData: ServicioData & { id: string } };

export default function ServicioEmpresaForm(props: Props) {
  const router = useRouter();
  const initial = props.modo === "editar" ? props.initialData : { nombre: "", descripcion: "" };
  const [nombre, setNombre] = useState(initial.nombre);
  const [descripcion, setDescripcion] = useState(initial.descripcion);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const payload = { nombre, descripcion: descripcion.trim() === "" ? null : descripcion };
      const res = props.modo === "editar"
        ? await editarServicioEmpresa({ id: props.initialData.id, ...payload })
        : await crearServicioEmpresa(payload);
      if (!res.ok) {
        setError(res.error);
      } else {
        router.push("/catalogo/servicios");
        router.refresh();
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nombre</span>
        <input
          type="text"
          className="border rounded px-2 py-1"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={120}
          required
          disabled={enviando}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Descripción (opcional)</span>
        <textarea
          className="border rounded px-2 py-1 min-h-[80px]"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={500}
          disabled={enviando}
        />
      </label>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

      <button type="submit" disabled={enviando} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
        {enviando ? "Guardando..." : (props.modo === "crear" ? "Crear servicio" : "Guardar cambios")}
      </button>
    </form>
  );
}