import Link from "next/link";
import { listarEstablecimientos } from "@/lib/establecimiento-actions";

type Publico = { id: string; publicado: boolean; ciudad: string | null; barrio: string | null; departamento: string | null };

type Establecimiento = {
  id: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  establecimiento_publico: Publico | Publico[] | null;
};

function normalizarPublico(p: Establecimiento["establecimiento_publico"]): Publico | null {
  if (!p) return null;
  if (Array.isArray(p)) return p[0] ?? null;
  return p;
}

export const dynamic = "force-dynamic";

export default async function EstablecimientosPage() {
  const res = await listarEstablecimientos();
  if (!res.ok) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Establecimientos</h1>
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{res.error}</div>
      </div>
    );
  }

  const establecimientos = res.data as Establecimiento[];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Establecimientos</h1>
        <Link href="/establecimientos/nuevo" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Nuevo establecimiento
        </Link>
      </header>

      {establecimientos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
          No hay establecimientos cargados todavía.
        </div>
      ) : (
        <ul className="space-y-3">
          {establecimientos.map((e) => {
            const pub = normalizarPublico(e.establecimiento_publico);
            return (
              <li key={e.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <Link href={`/establecimientos/${e.id}`} className="text-lg font-semibold hover:underline">
                    {e.nombre}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {[pub?.barrio, pub?.ciudad, pub?.departamento].filter(Boolean).join(", ") || e.direccion || "Sin ubicación"}
                  </div>
                </div>
                <div>
                  {pub?.publicado ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Publicado</span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">No publicado</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
