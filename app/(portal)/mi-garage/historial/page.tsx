import { listarHistorialCompartido } from "@/lib/conductor-actions";
import HistorialAccionesClient from "@/components/HistorialAccionesClient";

export const dynamic = "force-dynamic";

export default async function HistorialPage() {
  const res = await listarHistorialCompartido();
  const historiales = res.ok ? res.data : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Historial Compartido</h1>
      <p className="text-sm text-gray-600 mb-4">Aquí ves qué talleres tienen permiso para ver el historial de tus vehículos. Puedes revocar el acceso en cualquier momento.</p>
      {historiales.length === 0 ? (
        <p className="text-gray-600">Ningún taller ha solicitado acceso todavía.</p>
      ) : (
        <ul className="space-y-3">
          {historiales.map((h: any) => (
            <li key={h.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <p className="font-semibold">{h.nombre_empresa || "Taller"}</p>
                <p className="text-sm text-gray-600">Vehículo: {h.vehiculo_marca} {h.vehiculo_modelo}</p>
                <p className={`text-xs font-bold ${h.autorizado ? "text-green-600" : "text-red-600"}`}>{h.autorizado ? "Autorizado" : "Pendiente de autorización"}</p>
              </div>
              <HistorialAccionesClient historialId={h.id} tokenPropuesta={h.token_propuesta ?? null} autorizado={h.autorizado} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
