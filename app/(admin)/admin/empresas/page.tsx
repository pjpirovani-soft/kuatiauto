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
        <p className="text-red-700">Error: {res.error}</p>
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
          <p className="text-sm text-kuati-grafito/80 mt-1">
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
                    ? "bg-kuati-petroleo text-white border-kuati-petroleo"
                    : "bg-kuati-blanco text-kuati-grafito/80 border-kuati-borde hover:bg-kuati-fondo")
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {empresas.length === 0 ? (
        <div className="bg-kuati-blanco p-8 rounded-xl border border-kuati-borde text-center text-kuati-grafito/80">
          No hay empresas{filtroEstado ? ` en estado ${filtroEstado}` : ""}.
        </div>
      ) : (
        <div className="bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-kuati-fondo text-kuati-grafito/80">
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
                <tr key={e.id} className="border-t border-kuati-borde/50 hover:bg-kuati-fondo">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/empresas/${e.id}`}
                      className="text-kuati-petroleo hover:underline font-medium"
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
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-kuati-borde text-kuati-grafito/80">
                        Desactivada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{e.usuarios}</td>
                  <td className="px-4 py-3 text-right">{e.clientes}</td>
                  <td className="px-4 py-3 text-right">{e.vehiculos}</td>
                  <td className="px-4 py-3 text-right">{e.ordenes}</td>
                  <td className="px-4 py-3 text-kuati-grafito/80">
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