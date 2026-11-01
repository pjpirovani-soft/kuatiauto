import Link from "next/link";
import { listarVehiculosConductor, listarHistorialCompartido } from "@/lib/conductor-actions";

export const dynamic = "force-dynamic";

export default async function MiGaragePage() {
  const [resVeh, resHist] = await Promise.all([listarVehiculosConductor(), listarHistorialCompartido()]);
  const vehiculos = resVeh.ok ? resVeh.data : [];
  const historial = resHist.ok ? resHist.data : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Garaje</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Mis Vehículos</h2>
          <p className="text-gray-600 mb-4">Tienes {vehiculos.length} vehículo(s) registrado(s).</p>
          <Link href="/mi-garage/vehiculos" className="text-blue-600 hover:underline">Gestionar vehículos →</Link>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Historial Compartido</h2>
          <p className="text-gray-600 mb-4">Tienes {historial.filter((h: any) => h.autorizado).length} historial(es) autorizado(s).</p>
          <Link href="/mi-garage/historial" className="text-blue-600 hover:underline">Ver historial →</Link>
        </div>
      </div>
    </div>
  );
}
