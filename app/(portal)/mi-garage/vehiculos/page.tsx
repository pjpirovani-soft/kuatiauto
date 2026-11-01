import Link from "next/link";
import { listarVehiculosConductor } from "@/lib/conductor-actions";

export const dynamic = "force-dynamic";

export default async function MisVehiculosPage() {
  const res = await listarVehiculosConductor();
  const vehiculos = res.ok ? res.data : [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Vehículos</h1>
        <Link href="/mi-garage/vehiculos/nuevo" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Agregar vehículo</Link>
      </header>
      {vehiculos.length === 0 ? (
        <p className="text-gray-600">No tienes vehículos registrados.</p>
      ) : (
        <ul className="space-y-3">
          {vehiculos.map((v: any) => (
            <li key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <p className="font-semibold">{v.marca} {v.modelo} {v.anio ? `(${v.anio})` : ""}</p>
                <p className="text-sm text-gray-600">Patente: {v.patente || "Sin patente"} | Km: {v.km_actual}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
