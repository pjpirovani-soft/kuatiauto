import Link from "next/link";
import { listarEstablecimientos } from "@/lib/establecimiento-actions";
import { IconPlus, IconBuildingStore } from "@tabler/icons-react";

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
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-kuati-petroleo mb-4'>Establecimientos</h1>
        <div role='alert' className='text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3'>{res.error}</div>
      </div>
    );
  }

  const establecimientos = res.data as Establecimiento[];

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Establecimientos</h1>
          <p className='text-kuati-grafito/80 text-sm mt-1'>Sucursales y locales de tu empresa.</p>
        </div>
        <Link
          href='/establecimientos/nuevo'
          className='btn-press inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
        >
          <IconPlus size={18} aria-hidden='true' />
          Nuevo establecimiento
        </Link>
      </header>

      {establecimientos.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center shadow-sm space-y-4'>
          <IconBuildingStore size={40} className='mx-auto text-kuati-grafito/30' aria-hidden='true' />
          <p className='text-kuati-grafito/80'>No hay establecimientos cargados todavía.</p>
          <Link
            href='/establecimientos/nuevo'
            className='btn-press inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2 rounded-lg hover:bg-kuati-petroleo/90 transition-colors'
          >
            <IconPlus size={18} aria-hidden='true' />
            Crear el primero
          </Link>
        </div>
      ) : (
        <ul className='space-y-3'>
          {establecimientos.map((e) => {
            const pub = normalizarPublico(e.establecimiento_publico);
            return (
              <li key={e.id} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex-1 min-w-0'>
                  <Link
                    href={`/establecimientos/${e.id}`}
                    className='text-lg font-semibold text-kuati-petroleo hover:text-kuati-lima transition-colors'
                  >
                    {e.nombre}
                  </Link>
                  <div className='text-sm text-kuati-grafito/80 mt-1 truncate'>
                    {[pub?.barrio, pub?.ciudad, pub?.departamento].filter(Boolean).join(", ") || e.direccion || "Sin ubicación"}
                  </div>
                </div>
                <div className='ml-4'>
                  {pub?.publicado ? (
                    <span className='inline-flex items-center gap-1 text-xs font-semibold bg-kuati-lima/20 text-kuati-petroleo border border-kuati-lima/50 px-2.5 py-1 rounded-md'>
                      Publicado
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 text-xs font-semibold bg-kuati-fondo text-kuati-grafito/80 border border-kuati-borde px-2.5 py-1 rounded-md'>
                      No publicado
                    </span>
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