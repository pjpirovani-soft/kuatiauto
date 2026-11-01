'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearVehiculoConductor } from "@/lib/conductor-actions";

export default function VehiculoConductorForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      marca: String(fd.get("marca")),
      modelo: String(fd.get("modelo")),
      anio: fd.get("anio") ? Number(fd.get("anio")) : null,
      patente: fd.get("patente") ? String(fd.get("patente")) : null,
      km_actual: fd.get("km_actual") ? Number(fd.get("km_actual")) : 0,
    };
    const res = await crearVehiculoConductor(payload);
    setPending(false);
    if (!res.ok) { setError(res.error); return; }
    router.push("/mi-garage/vehiculos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <div><label className="block text-sm font-medium mb-1">Marca</label><input name="marca" required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-medium mb-1">Modelo</label><input name="modelo" required className="w-full border rounded px-3 py-2" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-sm font-medium mb-1">Año</label><input name="anio" type="number" className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Patente</label><input name="patente" className="w-full border rounded px-3 py-2" /></div>
      </div>
      <div><label className="block text-sm font-medium mb-1">Km actual</label><input name="km_actual" type="number" defaultValue={0} className="w-full border rounded px-3 py-2" /></div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" disabled={pending} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{pending ? "Guardando..." : "Guardar Vehículo"}</button>
    </form>
  );
}
