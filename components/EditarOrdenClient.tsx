"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrdenForm, { type OrdenFormData } from "./OrdenForm";
import { editarOrden, completarOrden, anularOrden, eliminarOrdenBorrador } from "@/lib/ordenes-actions";

type ServicioOpcion = { id: string; nombre: string; origen: "global" | "empresa" };
type ProductoOpcion = { id: string; nombre: string; origen: "global" | "empresa" };

type Props = {
  id: string;
  estado: string;
  initialData: OrdenFormData;
  vehiculos: { id: string; etiqueta: string }[];
  servicioOpciones: ServicioOpcion[];
  productoOpciones: ProductoOpcion[];
};

export default function EditarOrdenClient(props: Props) {
  const { id, estado, initialData, vehiculos, servicioOpciones, productoOpciones } = props;
  const router = useRouter();
  const [anulando, setAnulando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [accionError, setAccionError] = useState<string | null>(null);
  const [accionando, setAccionando] = useState(false);

  const editable = estado === "borrador" || estado === "en_curso";

  async function onSubmit(payload: Parameters<typeof editarOrden>[0]) {
    const res = await editarOrden(payload);
    if (res.ok) {
      router.refresh();
      return { ok: true, id };
    }
    return { ok: false, error: res.error ?? "No se pudo guardar" };
  }

  async function handleCompletar() {
    if (!confirm("¿Marcar esta orden como completada? Se calculará el importe total y el próximo mantenimiento.")) return;
    setAccionError(null);
    setAccionando(true);
    try {
      const res = await completarOrden({ id });
      if (!res.ok) setAccionError(res.error ?? "No se pudo completar");
      else router.refresh();
    } finally {
      setAccionando(false);
    }
  }

  async function handleAnular() {
    if (!confirm("¿Anular esta orden? Esta acción no se puede deshacer.")) return;
    setAccionError(null);
    setAccionando(true);
    try {
      const motivoLimpio = motivo.trim() === "" ? null : motivo;
      const res = await anularOrden({ id, motivo: motivoLimpio });
      if (!res.ok) setAccionError(res.error ?? "No se pudo anular");
      else { setAnulando(false); setMotivo(""); router.refresh(); }
    } finally {
      setAccionando(false);
    }
  }

  async function handleEliminar() {
    if (!confirm("¿Eliminar definitivamente este borrador? Esta acción no se puede deshacer.")) return;
    setAccionError(null);
    setAccionando(true);
    try {
      const res = await eliminarOrdenBorrador({ id });
      if (!res.ok) setAccionError(res.error ?? "No se pudo eliminar");
      else router.push("/ordenes");
    } finally {
      setAccionando(false);
    }
  }

  return (
    <div className="space-y-6">
      <OrdenForm
        modo="editar"
        initialData={initialData}
        vehiculos={vehiculos}
        servicioOpciones={servicioOpciones}
        productoOpciones={productoOpciones}
        onSubmit={onSubmit}
      />

      <section className="border rounded-xl bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">Acciones</h2>

        {accionError && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{accionError}</p>}

        {(estado === "borrador" || estado === "en_curso") && (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={accionando || !editable} onClick={handleCompletar} className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50">
              Completar orden
            </button>
            <button type="button" disabled={accionando} onClick={() => setAnulando((v) => !v)} className="px-3 py-1 rounded bg-amber-600 text-white disabled:opacity-50">
              Anular
            </button>
            {estado === "borrador" && (
              <button type="button" disabled={accionando} onClick={handleEliminar} className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50">
                Eliminar borrador
              </button>
            )}
          </div>
        )}

        {estado === "completada" && (
          <div>
            <p className="text-sm text-gray-600 mb-2">La orden está completada. Si necesitás revertirla, anulala con motivo.</p>
            <button type="button" disabled={accionando} onClick={() => setAnulando((v) => !v)} className="px-3 py-1 rounded bg-amber-600 text-white disabled:opacity-50">
              Anular
            </button>
          </div>
        )}

        {estado === "anulada" && (
          <p className="text-sm text-gray-600">Esta orden está anulada y no admite más acciones.</p>
        )}

        {anulando && (
          <div className="border-t pt-3 space-y-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Motivo de anulación (opcional, máx. 500)</span>
              <textarea
                className="border rounded px-2 py-1 min-h-[60px]"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                maxLength={500}
                disabled={accionando}
              />
            </label>
            <div className="flex gap-2">
              <button type="button" disabled={accionando} onClick={handleAnular} className="px-3 py-1 rounded bg-amber-700 text-white disabled:opacity-50">
                Confirmar anulación
              </button>
              <button type="button" disabled={accionando} onClick={() => { setAnulando(false); setMotivo(""); }} className="px-3 py-1 rounded border">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}