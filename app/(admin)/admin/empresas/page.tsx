import Link from "next/link";
import { listarEmpresasAdmin } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

type SearchParams = { estado?: string };

export default async function AdminEmpresasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const estadoRaw = sp.estado;
  const filtroEstado =
    estadoRaw === "activa" || estadoRaw === "desactivada" ? estadoRaw : undefined;

  const res = await listarEmpresasAdmin(filtroEstado);
  if (!res.ok) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Empresas</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  const empresas = res.data;

  const filtros = [
    { key: undefined, label: "Todas" },
    { key: "activa" as const, label: "Activas" },
    { key: "desactivada" as const, label: "Desactivadas" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-sm text-gray-600 mt-1">
            {empresas.length} {empresas.length === 1 ? "empresa" : "empresas"}
            {filtroEstado ? ` (${filtroEstado}s)` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {filtros.map((f) => {
            const active = filtroEstado === f.key;
            const href = f.key ? `/admin/empresas?estado=${f.key}` : "/admin/empresas";
            return (
              <Link
                key={f.label}
                href={href}
                className={
                  "px-3 py-1.5 text-sm rounded border " +
                  (active
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {empresas.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No hay empresas{filtroEstado ? ` en estado ${filtroEstado}` : ""}.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Empresa</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-right px-4 py-3 font-medium">Usuarios</th>
                <th className="text-right px-4 py-3 font-medium">Clientes</th>
                <th className="text-right px-4 py-3 font-medium">Vehículos</th>
                <th className="text-right px-4 py-3 font-medium">Órdenes</th>
                <th className="text-left px-4 py-3 font-medium">Creada</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/empresas/${e.id}`}
                      className="text-blue-700 hover:underline font-medium"
                    >
                      {e.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {e.activa ? (
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                        Activa
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                        Desactivada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{e.usuarios}</td>
                  <td className="px-4 py-3 text-right">{e.clientes}</td>
                  <td className="px-4 py-3 text-right">{e.vehiculos}</td>
                  <td className="px-4 py-3 text-right">{e.ordenes}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(e.created_at).toLocaleDateString("es-PY")}
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