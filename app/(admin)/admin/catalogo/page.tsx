import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminCatalogoPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Catalogo global</h1>
      <p className="text-sm text-gray-600 mb-6">
        Servicios y productos compartidos por todas las empresas. Solo admin_general puede editarlos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/catalogo/servicios"
          className="block bg-white p-6 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold mb-1">Servicios</h2>
          <p className="text-sm text-gray-600">
            Mano de obra, mantenimiento, revisiones. Se usan en ordenes de trabajo.
          </p>
        </Link>
        <Link
          href="/admin/catalogo/productos"
          className="block bg-white p-6 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold mb-1">Productos</h2>
          <p className="text-sm text-gray-600">
            Repuestos, lubricantes, filtros. Se usan en ordenes de trabajo.
          </p>
        </Link>
      </div>
    </div>
  );
}