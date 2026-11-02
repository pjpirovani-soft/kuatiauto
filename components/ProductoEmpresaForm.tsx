"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearProductoEmpresa, editarProductoEmpresa } from "@/lib/productos-empresa-actions";
import { IconLoader2 } from "@tabler/icons-react";

type ProductoData = {
  id?: string;
  nombre: string;
  marca: string;
  tipo: string;
  viscosidad: string;
  unidad: string;
  stock_actual: string;
  stock_minimo: string;
};

type Props =
  | { modo: "crear" }
  | { modo: "editar"; initialData: ProductoData & { id: string } };

export default function ProductoEmpresaForm(props: Props) {
  const router = useRouter();
  const initial = props.modo === "editar" ? props.initialData : {
    nombre: "", marca: "", tipo: "", viscosidad: "", unidad: "unidad", stock_actual: "0", stock_minimo: "0",
  };
  const [nombre, setNombre] = useState(initial.nombre);
  const [marca, setMarca] = useState(initial.marca);
  const [tipo, setTipo] = useState(initial.tipo);
  const [viscosidad, setViscosidad] = useState(initial.viscosidad);
  const [unidad, setUnidad] = useState(initial.unidad);
  const [stockActual, setStockActual] = useState(initial.stock_actual);
  const [stockMinimo, setStockMinimo] = useState(initial.stock_minimo);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const payload = {
        nombre,
        marca: marca.trim() === "" ? null : marca,
        tipo: tipo.trim() === "" ? null : tipo,
        viscosidad: viscosidad.trim() === "" ? null : viscosidad,
        unidad: unidad.trim() === "" ? "unidad" : unidad,
        stock_actual: stockActual,
        stock_minimo: stockMinimo,
      };
      const res = props.modo === "editar"
        ? await editarProductoEmpresa({ id: props.initialData.id, ...payload })
        : await crearProductoEmpresa(payload);
      if (!res.ok) {
        setError(res.error);
      } else {
        router.push("/catalogo/productos");
        router.refresh();
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5 max-w-2xl bg-kuati-blanco p-6 md:p-8 rounded-xl border border-kuati-borde shadow-sm'>
      <div>
        <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='nombre'>Nombre</label>
        <input
          id='nombre'
          type='text'
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={120}
          required
          disabled={enviando}
          placeholder='Ej. Aceite Mobil 5W-30'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='marca'>Marca (opcional)</label>
          <input
            id='marca'
            type='text'
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            maxLength={80}
            disabled={enviando}
            placeholder='Mobil, Shell, etc.'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='tipo'>Tipo (opcional)</label>
          <input
            id='tipo'
            type='text'
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            maxLength={40}
            disabled={enviando}
            placeholder='aceite, filtro, etc.'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='viscosidad'>Viscosidad (opcional)</label>
          <input
            id='viscosidad'
            type='text'
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            value={viscosidad}
            onChange={(e) => setViscosidad(e.target.value)}
            maxLength={20}
            disabled={enviando}
            placeholder='5W-30, 10W-40...'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='unidad'>Unidad</label>
          <input
            id='unidad'
            type='text'
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            maxLength={20}
            disabled={enviando}
            placeholder='unidad, litros, etc.'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='stock_actual'>Stock actual</label>
          <input
            id='stock_actual'
            type='number'
            min='0'
            step='1'
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            value={stockActual}
            onChange={(e) => setStockActual(e.target.value)}
            disabled={enviando}
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='stock_minimo'>Stock mínimo</label>
          <input
            id='stock_minimo'
            type='number'
            min='0'
            step='1'
            className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            disabled={enviando}
          />
        </div>
      </div>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>{error}</div>
      )}

      <div className='pt-2'>
        <button 
          type='submit' 
          disabled={enviando} 
          className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
        >
          {enviando && <IconLoader2 size={18} className='animate-spin' />}
          {enviando ? 'Guardando...' : (props.modo === 'crear' ? 'Crear producto' : 'Guardar cambios')}
        </button>
      </div>
    </form>
  );
}
