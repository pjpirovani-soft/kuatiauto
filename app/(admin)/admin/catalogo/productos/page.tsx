import Link from "next/link";
import { listarProductosGlobalesAdmin } from "@/lib/admin-actions";
import { EliminarProductoGlobalButton } from "@/components/EliminarProductoGlobalButton";

export const dynamic = "force-dynamic";

export default async function AdminProductosGlobalesPage() {
  const res = await listarProductosGlobalesAdmin();
  if (!res.ok) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Productos globales</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  const productos = res.data;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/catalogo" className="text-sm text-blue-700 hover:underline">
        Volver a Catalogo
      </Link>

      <div className="flex items-center justify-between mt-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Productos globales</h1>
          <p className="text-sm text-gray-600 mt-1">
            {productos.length} {productos.length === 1 ? "producto" : "productos"}
          </p>
        </div>
        <Link
          href="/admin/catalogo/productos/nuevo"
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
        >
          Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No hay productos globales cargados.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Marca</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Viscosidad</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/catalogo/productos/${p.id}`}
                      className="text-blue-700 hover:underline font-medium"
                    >
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.marca ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.tipo ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.viscosidad ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <EliminarProductoGlobalButton id={p.id} nombre={p.nombre} />
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