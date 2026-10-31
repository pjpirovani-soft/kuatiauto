import Link from "next/link";
import { listarServiciosEmpresa } from "@/lib/servicios-empresa-actions";

type ServicioRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
};

export default async function ServiciosPage() {
  const res = await listarServiciosEmpresa();
  const servicios: ServicioRow[] = res.ok ? (res.data as ServicioRow[]) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/catalogo" className="text-sm text-gray-600 hover:text-black underline">← Catálogo</Link>
          <h1 className="text-3xl font-bold mt-2">Servicios</h1>
        </div>
        <Link href="/catalogo/servicios/nuevo" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Nuevo servicio
        </Link>
      </header>

      {servicios.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-gray-600">Todavía no cargaste servicios propios. Los servicios globales siguen disponibles en las órdenes.</p>
          <Link href="/catalogo/servicios/nuevo" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 inline-block">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Descripción</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{s.nombre}</td>
                  <td className="px-4 py-2 text-gray-600">{s.descripcion ?? "—"}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/catalogo/servicios/${s.id}`} className="text-blue-600 hover:underline">Editar</Link>
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