import Link from "next/link";
import { listarProductosEmpresa } from "@/lib/productos-empresa-actions";

type ProductoRow = {
  id: string;
  nombre: string;
  marca: string | null;
  tipo: string | null;
  viscosidad: string | null;
  unidad: string;
  stock_actual: number;
  stock_minimo: number;
};

export default async function ProductosPage() {
  const res = await listarProductosEmpresa();
  const productos: ProductoRow[] = res.ok ? (res.data as ProductoRow[]) : [];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/catalogo" className="text-sm text-gray-600 hover:text-black underline">← Catálogo</Link>
          <h1 className="text-3xl font-bold mt-2">Productos</h1>
        </div>
        <Link href="/catalogo/productos/nuevo" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Nuevo producto
        </Link>
      </header>

      {productos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-gray-600">Todavía no cargaste productos propios. Los productos globales siguen disponibles en las órdenes.</p>
          <Link href="/catalogo/productos/nuevo" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 inline-block">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Marca</th>
                <th className="px-4 py-2 font-medium">Tipo</th>
                <th className="px-4 py-2 font-medium">Visc.</th>
                <th className="px-4 py-2 font-medium">Unidad</th>
                <th className="px-4 py-2 font-medium">Stock</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const bajo = p.stock_actual <= p.stock_minimo;
                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2 text-gray-600">{p.marca ?? "—"}</td>
                    <td className="px-4 py-2 text-gray-600">{p.tipo ?? "—"}</td>
                    <td className="px-4 py-2 text-gray-600">{p.viscosidad ?? "—"}</td>
                    <td className="px-4 py-2 text-gray-600">{p.unidad}</td>
                    <td className={`px-4 py-2 ${bajo ? "text-red-700 font-medium" : ""}`}>
                      {p.stock_actual} / min {p.stock_minimo}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link href={`/catalogo/productos/${p.id}`} className="text-blue-600 hover:underline">Editar</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}