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
  empleados?: { id: string; nombre: string | null; email: string }[];
};

export default function EditarOrdenClient(props: Props) {
  const { id, estado, initialData, vehiculos, servicioOpciones, productoOpciones } = props;
  const router = useRouter();
  
  const [anulando, setAnulando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [accionError, setAccionError] = useState<string | null>(null);
  const [accionando, setAccionando] = useState<string | null>(null); 

  const [confirmarAccion, setConfirmarAccion] = useState<"completar" | "anular" | "eliminar" | null>(null);

  const editable = estado === "borrador" || estado === "en_curso";

  async function onSubmit(payload: Parameters<typeof editarOrden>[0]) {
    const res = await editarOrden(payload);
    if (res.ok) {
      router.refresh();
      return { ok: true, id };
    }
    return { ok: false, error: res.error ?? "No se pudo guardar" };
  }

  async function ejecutarCompletar() {
    setAccionError(null);
    setAccionando('completar');
    try {
      const res = await completarOrden({ id });
      if (!res.ok) setAccionError(res.error ?? "No se pudo completar");
      else router.refresh();
    } finally {
      setAccionando(null);
      setConfirmarAccion(null);
    }
  }

  async function ejecutarAnular() {
    setAccionError(null);
    setAccionando('anular');
    try {
      const motivoLimpio = motivo.trim() === "" ? null : motivo;
      const res = await anularOrden({ id, motivo: motivoLimpio });
      if (!res.ok) setAccionError(res.error ?? "No se pudo anular");
      else { setAnulando(false); setMotivo(""); router.refresh(); }
    } finally {
      setAccionando(null);
      setConfirmarAccion(null);
    }
  }

  async function ejecutarEliminar() {
    setAccionError(null);
    setAccionando('eliminar');
    try {
      const res = await eliminarOrdenBorrador({ id });
      if (!res.ok) setAccionError(res.error ?? "No se pudo eliminar");
      else router.push("/ordenes");
    } finally {
      setAccionando(null);
      setConfirmarAccion(null);
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
        empleados={props.empleados}
        onSubmit={onSubmit}
      />

      <section className="border border-kuati-borde rounded-xl bg-kuati-blanco p-6 space-y-3">
        <h2 className="text-lg font-semibold">Acciones</h2>

        {accionError && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{accionError}</p>}

        {(estado === "borrador" || estado === "en_curso") && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              type="button" 
              disabled={!!accionando || !editable} 
              onClick={() => setConfirmarAccion('completar')} 
              className="px-4 py-3 min-h-[44px] rounded bg-kuati-petroleo text-kuati-blanco font-medium disabled:opacity-50 active:scale-95 transition-transform"
            >
              {accionando === 'completar' ? 'Completando...' : 'Completar orden'}
            </button>
            <button 
              type="button" 
              disabled={!!accionando} 
              onClick={() => setAnulando((v) => !v)} 
              className="px-4 py-3 min-h-[44px] rounded bg-amber-600 text-white font-medium disabled:opacity-50 active:scale-95 transition-transform"
            >
              Anular
            </button>
            {estado === "borrador" && (
              <button 
                type="button" 
                disabled={!!accionando} 
                onClick={() => setConfirmarAccion('eliminar')} 
                className="px-4 py-3 min-h-[44px] rounded bg-red-600 text-white font-medium disabled:opacity-50 active:scale-95 transition-transform"
              >
                {accionando === 'eliminar' ? 'Eliminando...' : 'Eliminar borrador'}
              </button>
            )}
          </div>
        )}

        {estado === "completada" && (
          <div>
            <p className="text-sm text-kuati-grafito/80 mb-2">La orden está completada. Si necesitás revertirla, anulala con motivo.</p>
            <button 
              type="button" 
              disabled={!!accionando} 
              onClick={() => setAnulando((v) => !v)} 
              className="px-4 py-3 min-h-[44px] rounded bg-amber-600 text-white font-medium disabled:opacity-50"
            >
              Anular
            </button>
          </div>
        )}

        {estado === "anulada" && (
          <p className="text-sm text-kuati-grafito/80">Esta orden está anulada y no admite más acciones.</p>
        )}

        {anulando && (
          <div className="border-t pt-3 space-y-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Motivo de anulación (opcional, máx. 500)</span>
              <textarea
                className="border border-kuati-borde rounded-lg px-3 py-2 min-h-[60px]"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                maxLength={500}
                disabled={!!accionando}
              />
            </label>
            <div className="flex gap-2">
              <button 
                type="button" 
                disabled={!!accionando} 
                onClick={() => setConfirmarAccion('anular')} 
                className="px-4 py-3 min-h-[44px] rounded bg-amber-700 text-white font-medium disabled:opacity-50"
              >
                {accionando === 'anular' ? 'Anulando...' : 'Confirmar anulación'}
              </button>
              <button 
                type="button" 
                disabled={!!accionando} 
                onClick={() => { setAnulando(false); setMotivo(""); }} 
                className="px-4 py-3 min-h-[44px] rounded border font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>

      {confirmarAccion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-kuati-blanco rounded-xl p-6 w-full max-w-sm shadow-xl border border-kuati-borde">
            <h3 className="text-lg font-bold mb-2">Confirmar acción</h3>
            <p className="text-sm text-kuati-grafito/80 mb-6">
              {confirmarAccion === 'completar' && "¿Marcar esta orden como completada? Se calculará el importe total y el próximo mantenimiento."}
              {confirmarAccion === 'anular' && "¿Anular esta orden? Esta acción no se puede deshacer."}
              {confirmarAccion === 'eliminar' && "¿Eliminar definitivamente este borrador? Esta acción no se puede deshacer."}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmarAccion(null)} 
                disabled={!!accionando}
                className="flex-1 px-4 py-2 rounded border border-kuati-borde font-medium hover:bg-kuati-fondo"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarAccion === 'completar' ? ejecutarCompletar : confirmarAccion === 'anular' ? ejecutarAnular : ejecutarEliminar} 
                disabled={!!accionando}
                className={`flex-1 px-4 py-2 rounded text-white font-medium ${
                  confirmarAccion === 'completar' ? 'bg-kuati-petroleo hover:bg-kuati-petroleo/90' : 
                  confirmarAccion === 'anular' ? 'bg-amber-600 hover:bg-amber-700' : 
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}