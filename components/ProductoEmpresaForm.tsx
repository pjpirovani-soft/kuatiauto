"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearProductoEmpresa, editarProductoEmpresa } from "@/lib/productos-empresa-actions";

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
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

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Marca (opcional)</span>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            maxLength={80}
            disabled={enviando}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Tipo (opcional)</span>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            maxLength={40}
            placeholder="aceite, filtro, repuesto..."
            disabled={enviando}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Viscosidad (opcional)</span>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={viscosidad}
            onChange={(e) => setViscosidad(e.target.value)}
            maxLength={20}
            placeholder="5W-30"
            disabled={enviando}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Unidad</span>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            maxLength={20}
            disabled={enviando}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Stock actual</span>
          <input
            type="number"
            min="0"
            step="1"
            className="border rounded px-2 py-1"
            value={stockActual}
            onChange={(e) => setStockActual(e.target.value)}
            disabled={enviando}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Stock mínimo</span>
          <input
            type="number"
            min="0"
            step="1"
            className="border rounded px-2 py-1"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            disabled={enviando}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

      <button type="submit" disabled={enviando} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
        {enviando ? "Guardando..." : (props.modo === "crear" ? "Crear producto" : "Guardar cambios")}
      </button>
    </form>
  );
}