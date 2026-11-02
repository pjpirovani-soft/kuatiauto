import Link from "next/link";
import { listarServiciosGlobalesAdmin } from "@/lib/admin-actions";
import { EliminarServicioGlobalButton } from "@/components/EliminarServicioGlobalButton";

export const dynamic = "force-dynamic";

export default async function AdminServiciosGlobalesPage() {
  const res = await listarServiciosGlobalesAdmin();
  if (!res.ok) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Servicios globales</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  const servicios = res.data;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/catalogo" className="text-sm text-blue-700 hover:underline">
        Volver a Catalogo
      </Link>

      <div className="flex items-center justify-between mt-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Servicios globales</h1>
          <p className="text-sm text-gray-600 mt-1">
            {servicios.length} {servicios.length === 1 ? "servicio" : "servicios"}
          </p>
        </div>
        <Link
          href="/admin/catalogo/servicios/nuevo"
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
        >
          Nuevo servicio
        </Link>
      </div>

      {servicios.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No hay servicios globales cargados.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Descripcion</th>
                <th className="text-right px-4 py-3 font-medium">Km</th>
                <th className="text-right px-4 py-3 font-medium">Meses</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/catalogo/servicios/${s.id}`}
                      className="text-blue-700 hover:underline font-medium"
                    >
                      {s.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-md truncate">
                    {s.descripcion ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.intervalo_km_sugerido ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.intervalo_meses_sugerido ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <EliminarServicioGlobalButton id={s.id} nombre={s.nombre} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}