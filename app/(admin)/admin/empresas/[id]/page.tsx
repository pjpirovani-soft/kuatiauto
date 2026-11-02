import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerEmpresaAdmin } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminEmpresaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await obtenerEmpresaAdmin(id);

  if (!res.ok) {
    if (res.notFound) notFound();
    return (
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/empresas" className="text-sm text-blue-700 hover:underline">
          Volver a Empresas
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-6">Detalle de empresa</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  const e = res.data;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/empresas" className="text-sm text-blue-700 hover:underline">
        Volver a Empresas
      </Link>

      <div className="flex items-center justify-between mt-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{e.nombre}</h1>
          <p className="text-sm text-gray-600 mt-1">ID: {e.id}</p>
        </div>
        <div>
          {e.activa ? (
            <span className="inline-block px-3 py-1 text-sm rounded bg-green-100 text-green-800">
              Activa
            </span>
          ) : (
            <span className="inline-block px-3 py-1 text-sm rounded bg-gray-200 text-gray-700">
              Desactivada
            </span>
          )}
        </div>
      </div>

      <section className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">RUC</dt>
            <dd className="font-medium">{e.ruc ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Telefono</dt>
            <dd className="font-medium">{e.telefono ?? "—"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-gray-500">Direccion</dt>
            <dd className="font-medium">{e.direccion ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Creada</dt>
            <dd className="font-medium">{new Date(e.created_at).toLocaleString("es-PY")}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Actualizada</dt>
            <dd className="font-medium">{new Date(e.updated_at).toLocaleString("es-PY")}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Contadores</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Usuarios</p>
            <p className="text-2xl font-bold mt-1">{e.contadores.usuarios}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Clientes</p>
            <p className="text-2xl font-bold mt-1">{e.contadores.clientes}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Vehiculos</p>
            <p className="text-2xl font-bold mt-1">{e.contadores.vehiculos}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Ordenes</p>
            <p className="text-2xl font-bold mt-1">{e.contadores.ordenes}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500">Establ. publicados</p>
            <p className="text-2xl font-bold mt-1">{e.contadores.establecimientosPublicados}</p>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Usuarios</h2>
        {e.usuarios.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-500">
            Sin usuarios.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Rol</th>
                </tr>
              </thead>
              <tbody>
                {e.usuarios.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{u.nombre ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                        {u.rol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Establecimientos</h2>
        {e.establecimientos.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-500">
            Sin establecimientos.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium">Ciudad</th>
                  <th className="text-left px-4 py-3 font-medium">Publicado</th>
                </tr>
              </thead>
              <tbody>
                {e.establecimientos.map((s) => (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{s.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{s.ciudad ?? "—"}</td>
                    <td className="px-4 py-3">
                      {s.publicado ? (
                        <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                          Si
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}