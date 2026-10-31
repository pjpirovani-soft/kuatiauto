"use client";

import { useState } from "react";
import OrdenLineas, { type ServicioLineaUI, type ProductoLineaUI } from "./OrdenLineas";

type ServicioOpcion = { id: string; nombre: string; origen: "global" | "empresa" };
type ProductoOpcion = { id: string; nombre: string; origen: "global" | "empresa" };

export type OrdenFormData = {
  id?: string;
  vehiculo_id: string;
  fecha: string;
  km_servicio: string;
  observaciones: string;
  estado: string;
  servicios: ServicioLineaUI[];
  productos: ProductoLineaUI[];
};

type Props = {
  modo: "crear" | "editar";
  initialData?: OrdenFormData;
  vehiculos: { id: string; etiqueta: string }[];
  servicioOpciones: ServicioOpcion[];
  productoOpciones: ProductoOpcion[];
  onSubmit: (payload: {
    id?: string;
    vehiculo_id: string;
    fecha: string;
    km_servicio: number;
    observaciones: string | null;
    servicios: { servicio_global_id: string | null; servicio_empresa_id: string | null; precio: number | null }[];
    productos: { producto_global_id: string | null; producto_empresa_id: string | null; cantidad: number; precio_unitario: number | null }[];
  }) => Promise<{ ok: boolean; error?: string; id?: string }>;
};

function nuevaKey(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function OrdenForm(props: Props) {
  const { modo, initialData, vehiculos, servicioOpciones, productoOpciones, onSubmit } = props;

  const [vehiculoId, setVehiculoId] = useState(initialData?.vehiculo_id ?? "");
  const [fecha, setFecha] = useState(initialData?.fecha ?? new Date().toISOString().slice(0, 10));
  const [kmServicio, setKmServicio] = useState(initialData?.km_servicio ?? "0");
  const [observaciones, setObservaciones] = useState(initialData?.observaciones ?? "");
  const [servicios, setServicios] = useState<ServicioLineaUI[]>(initialData?.servicios ?? []);
  const [productos, setProductos] = useState<ProductoLineaUI[]>(initialData?.productos ?? []);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const editable = modo === "crear" || (initialData?.estado === "borrador" || initialData?.estado === "en_curso");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const serviciosLimpios = servicios
        .filter((s) => s.servicio_global_id || s.servicio_empresa_id)
        .map((s) => ({
          servicio_global_id: s.servicio_global_id,
          servicio_empresa_id: s.servicio_empresa_id,
          precio: s.precio === "" ? null : Number(s.precio),
        }));
      const productosLimpios = productos
        .filter((p) => p.producto_global_id || p.producto_empresa_id)
        .map((p) => ({
          producto_global_id: p.producto_global_id,
          producto_empresa_id: p.producto_empresa_id,
          cantidad: Number(p.cantidad || "1"),
          precio_unitario: p.precio_unitario === "" ? null : Number(p.precio_unitario),
        }));
      const payload = {
        id: initialData?.id,
        vehiculo_id: vehiculoId,
        fecha,
        km_servicio: Number(kmServicio),
        observaciones: observaciones.trim() === "" ? null : observaciones,
        servicios: serviciosLimpios,
        productos: productosLimpios,
      };
      const res = await onSubmit(payload);
      if (!res.ok) setError(res.error ?? "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Vehículo</span>
          <select
            className="border rounded px-2 py-1"
            value={vehiculoId}
            onChange={(e) => setVehiculoId(e.target.value)}
            disabled={!editable}
            required
          >
            <option value="">— Seleccionar —</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.etiqueta}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={!editable}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Km al ingreso</span>
          <input
            type="number" min="0" step="1"
            className="border rounded px-2 py-1"
            value={kmServicio}
            onChange={(e) => setKmServicio(e.target.value)}
            disabled={!editable}
            required
          />
        </label>
        <label className="flex flex-col gap-1 col-span-2">
          <span className="text-sm font-medium">Observaciones</span>
          <textarea
            className="border rounded px-2 py-1 min-h-[80px]"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            disabled={!editable}
            maxLength={1000}
          />
        </label>
      </div>

      <OrdenLineas
        servicios={servicios}
        productos={productos}
        servicioOpciones={servicioOpciones}
        productoOpciones={productoOpciones}
        onChange={(next) => { setServicios(next.servicios); setProductos(next.productos); }}
        disabled={!editable}
      />

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

      {editable && (
        <div className="flex gap-2">
          <button type="submit" disabled={enviando} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
            {enviando ? "Guardando..." : (modo === "crear" ? "Crear orden" : "Guardar cambios")}
          </button>
        </div>
      )}
      {!editable && (
        <p className="text-sm text-gray-600">Esta orden está {initialData?.estado} y no se puede editar. Usá las acciones de la página.</p>
      )}
    </form>
  );
}