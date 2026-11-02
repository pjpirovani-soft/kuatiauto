"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearServicioEmpresa, editarServicioEmpresa } from "@/lib/servicios-empresa-actions";
import { IconLoader2 } from "@tabler/icons-react";

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
    <form onSubmit={handleSubmit} className='space-y-5 max-w-xl bg-kuati-blanco p-6 md:p-8 rounded-xl border border-kuati-borde shadow-sm'>
      <div>
        <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='nombre'>
          Nombre
        </label>
        <input
          id='nombre'
          type='text'
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={120}
          required
          disabled={enviando}
          placeholder='Ej. Cambio de aceite de motor'
        />
      </div>

      <div>
        <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='descripcion'>
          Descripción (opcional)
        </label>
        <textarea
          id='descripcion'
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all min-h-[100px] resize-y'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={500}
          disabled={enviando}
          placeholder='Detalles del servicio...'
        />
      </div>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>
          {error}
        </div>
      )}

      <div className='pt-2'>
        <button 
          type='submit' 
          disabled={enviando} 
          className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
        >
          {enviando && <IconLoader2 size={18} className='animate-spin' />}
          {enviando ? 'Guardando...' : (props.modo === 'crear' ? 'Crear servicio' : 'Guardar cambios')}
        </button>
      </div>
    </form>
  );
}
