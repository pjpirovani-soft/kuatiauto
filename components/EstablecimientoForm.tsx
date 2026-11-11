'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearEstablecimiento, editarEstablecimiento } from "@/lib/establecimiento-actions";
import { IconLoader2 } from "@tabler/icons-react";
import LocationPicker from "./establecimiento/LocationPicker";

export type Publico = {
  id: string;
  descripcion: string | null;
  barrio: string | null;
  ciudad: string | null;
  departamento: string | null;
  telefono: string | null;
  servicios_ofrecidos: unknown;
  lat_aproximada: number | null;
  lng_aproximada: number | null;
  publicado: boolean;
};

export type EstablecimientoData = {
  id: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  horarios: unknown;
  establecimiento_publico: Publico | Publico[] | null;
};

type Props =
  | { modo: "crear"; initialData?: undefined }
  | { modo: "editar"; initialData: EstablecimientoData };

function normalizarPublico(p: EstablecimientoData["establecimiento_publico"]): Publico | null {
  if (!p) return null;
  if (Array.isArray(p)) return p[0] ?? null;
  return p;
}

const inputClass = "w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-petroleo focus:border-transparent transition-all";
const labelClass = "block text-sm font-semibold text-kuati-grafito mb-1.5";

export default function EstablecimientoForm({ modo, initialData }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const pub = modo === "editar" ? normalizarPublico(initialData.establecimiento_publico) : null;
  const serviciosIniciales = Array.isArray(pub?.servicios_ofrecidos)
    ? (pub!.servicios_ofrecidos as string[]).join(", ")
    : "";

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    pub && pub.lat_aproximada !== null && pub.lng_aproximada !== null
      ? { lat: pub.lat_aproximada, lng: pub.lng_aproximada }
      : null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const serviciosRaw = String(fd.get("servicios_ofrecidos") ?? "").trim();
    const servicios = serviciosRaw
      ? serviciosRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : null;

    const lat = coords?.lat ?? (fd.get("lat_aproximada") ? Number(fd.get("lat_aproximada")) : null);
    const lng = coords?.lng ?? (fd.get("lng_aproximada") ? Number(fd.get("lng_aproximada")) : null);

    const payload = {
      nombre: String(fd.get("nombre") ?? ""),
      direccion: fd.get("direccion") ? String(fd.get("direccion")) : null,
      telefono: fd.get("telefono") ? String(fd.get("telefono")) : null,
      horarios: null,
      descripcion: fd.get("descripcion") ? String(fd.get("descripcion")) : null,
      barrio: fd.get("barrio") ? String(fd.get("barrio")) : null,
      ciudad: fd.get("ciudad") ? String(fd.get("ciudad")) : null,
      departamento: fd.get("departamento") ? String(fd.get("departamento")) : null,
      telefono_publico: fd.get("telefono_publico") ? String(fd.get("telefono_publico")) : null,
      servicios_ofrecidos: servicios,
      lat_aproximada: lat,
      lng_aproximada: lng,
    };

    const res =
      modo === "crear"
        ? await crearEstablecimiento(payload)
        : await editarEstablecimiento({ ...payload, id: initialData.id });

    setPending(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    router.push("/establecimientos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className='space-y-8 max-w-3xl'>
      {/* Datos del establecimiento */}
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm space-y-4'>
        <h2 className='text-xl font-bold text-kuati-petroleo mb-4'>Datos del establecimiento</h2>

        <div>
          <label className={labelClass}>Nombre *</label>
          <input
            name='nombre'
            required
            maxLength={120}
            defaultValue={initialData?.nombre ?? ""}
            className={inputClass}
            placeholder='Ej. Lubricentro Central'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Dirección</label>
            <input
              name='direccion'
              maxLength={300}
              defaultValue={initialData?.direccion ?? ""}
              className={inputClass}
              placeholder='Av. Principal 123'
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input
              name='telefono'
              maxLength={40}
              defaultValue={initialData?.telefono ?? ""}
              className={inputClass}
              placeholder='+595 981 123 456'
            />
          </div>
        </div>
      </div>

      {/* Datos públicos del directorio */}
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm space-y-4'>
        <div>
          <h2 className='text-xl font-bold text-kuati-petroleo'>Datos públicos del directorio</h2>
          <p className='text-sm text-kuati-grafito/70 mt-1'>
            Estos datos aparecen en el directorio público cuando el establecimiento esté publicado. Las coordenadas son aproximadas (~1 km).
          </p>
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            name='descripcion'
            maxLength={1000}
            rows={3}
            defaultValue={pub?.descripcion ?? ""}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder='Especialistas en lubricación y mantenimiento preventivo...'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <label className={labelClass}>Barrio</label>
            <input
              name='barrio'
              maxLength={120}
              defaultValue={pub?.barrio ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input
              name='ciudad'
              maxLength={120}
              defaultValue={pub?.ciudad ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Departamento</label>
            <input
              name='departamento'
              maxLength={120}
              defaultValue={pub?.departamento ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Teléfono público</label>
          <input
            name='telefono_publico'
            maxLength={40}
            defaultValue={pub?.telefono ?? ""}
            className={inputClass}
            placeholder='+595 981 123 456'
          />
        </div>

        <div>
          <label className={labelClass}>Servicios ofrecidos (separados por coma)</label>
          <input
            name='servicios_ofrecidos'
            placeholder='cambio de aceite, frenos, alineación'
            defaultValue={serviciosIniciales}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Ubicación en el mapa</label>
          <LocationPicker
            lat={coords?.lat ?? null}
            lng={coords?.lng ?? null}
            onChange={setCoords}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Latitud aproximada</label>
            <input
              name='lat_aproximada'
              type='number'
              step='0.00001'
              min={-90}
              max={90}
              value={coords?.lat ?? ""}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : null;
                if (v !== null && coords?.lng !== undefined) {
                  setCoords({ lat: v, lng: coords.lng });
                }
              }}
              className={inputClass}
              placeholder='-25.28646'
            />
          </div>
          <div>
            <label className={labelClass}>Longitud aproximada</label>
            <input
              name='lng_aproximada'
              type='number'
              step='0.00001'
              min={-180}
              max={180}
              value={coords?.lng ?? ""}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : null;
                if (v !== null && coords?.lat !== undefined) {
                  setCoords({ lat: coords.lat, lng: v });
                }
              }}
              className={inputClass}
              placeholder='-57.64700'
            />
          </div>
        </div>
      </div>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>{error}</div>
      )}

      <div className='flex flex-col sm:flex-row items-center gap-3'>
        <button
          type='submit'
          disabled={pending}
          className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
        >
          {pending && <IconLoader2 size={18} className='animate-spin' />}
          {pending ? "Guardando..." : modo === "crear" ? "Crear establecimiento" : "Guardar cambios"}
        </button>
        <button
          type='button'
          onClick={() => router.back()}
          className='w-full sm:w-auto text-center border border-kuati-borde text-kuati-grafito px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-fondo transition-colors'
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}