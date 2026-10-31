'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearEstablecimiento, editarEstablecimiento } from "@/lib/establecimiento-actions";

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

export default function EstablecimientoForm({ modo, initialData }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const pub = modo === "editar" ? normalizarPublico(initialData.establecimiento_publico) : null;
  const serviciosIniciales = Array.isArray(pub?.servicios_ofrecidos)
    ? (pub!.servicios_ofrecidos as string[]).join(", ")
    : "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const serviciosRaw = String(fd.get("servicios_ofrecidos") ?? "").trim();
    const servicios = serviciosRaw
      ? serviciosRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : null;

    const lat = fd.get("lat_aproximada") ? Number(fd.get("lat_aproximada")) : null;
    const lng = fd.get("lng_aproximada") ? Number(fd.get("lng_aproximada")) : null;

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
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Datos del establecimiento</legend>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            name="nombre"
            required
            maxLength={120}
            defaultValue={initialData?.nombre ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              name="direccion"
              maxLength={300}
              defaultValue={initialData?.direccion ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              name="telefono"
              maxLength={40}
              defaultValue={initialData?.telefono ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t pt-4">
        <legend className="text-lg font-semibold">Datos públicos del directorio</legend>
        <p className="text-sm text-gray-600">
          Estos datos aparecen en el directorio público cuando el establecimiento esté publicado. Las coordenadas son aproximadas (~1 km).
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            maxLength={1000}
            rows={3}
            defaultValue={pub?.descripcion ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Barrio</label>
            <input
              name="barrio"
              maxLength={120}
              defaultValue={pub?.barrio ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              name="ciudad"
              maxLength={120}
              defaultValue={pub?.ciudad ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <input
              name="departamento"
              maxLength={120}
              defaultValue={pub?.departamento ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono público</label>
          <input
            name="telefono_publico"
            maxLength={40}
            defaultValue={pub?.telefono ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Servicios ofrecidos (separados por coma)</label>
          <input
            name="servicios_ofrecidos"
            placeholder="cambio de aceite, frenos, alineación"
            defaultValue={serviciosIniciales}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Latitud aproximada</label>
            <input
              name="lat_aproximada"
              type="number"
              step="0.00001"
              min={-90}
              max={90}
              defaultValue={pub?.lat_aproximada ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitud aproximada</label>
            <input
              name="lng_aproximada"
              type="number"
              step="0.00001"
              min={-180}
              max={180}
              defaultValue={pub?.lng_aproximada ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "Guardando..." : modo === "crear" ? "Crear establecimiento" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
