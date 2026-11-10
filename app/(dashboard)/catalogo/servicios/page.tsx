import Link from 'next/link';
import { listarServiciosEmpresa, toggleServicioEmpresa } from '@/lib/servicios-empresa-actions';
import { IconPlus, IconArrowLeft, IconTool } from '@tabler/icons-react';

type ServicioRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  activo: boolean;
};

export default async function ServiciosPage() {
  const res = await listarServiciosEmpresa();
  const servicios: ServicioRow[] = res.ok ? (res.data as ServicioRow[]) : [];

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <div>
          <Link href='/catalogo' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
            <IconArrowLeft size={16} /> Volver al catálogo
          </Link>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Servicios</h1>
        </div>
        <Link 
          href='/catalogo/servicios/nuevo' 
          className='inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
        >
          <IconPlus size={18} />
          Nuevo servicio
        </Link>
      </header>

      {servicios.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center text-kuati-grafito/70 shadow-sm space-y-4'>
          <p>Todavía no cargaste servicios propios. Los servicios globales siguen disponibles en las órdenes.</p>
          <Link href='/catalogo/servicios/nuevo' className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2 rounded-lg hover:bg-kuati-petroleo/90 transition-colors'>
            Crear el primero
          </Link>
        </div>
      ) : (
        <>
          {/* VISTA ESCRITORIO: Tabla */}
          <div className='hidden md:block bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-kuati-fondo text-kuati-grafito border-b border-kuati-borde'>
                <tr>
                  <th className='px-6 py-4 font-semibold'>Nombre</th>
                  <th className='px-6 py-4 font-semibold'>Descripción</th>
                  <th className='px-6 py-4 font-semibold text-right'>Acciones</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {servicios.map((s) => (
                  <tr key={s.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                    <td className='px-6 py-4 font-medium text-kuati-petroleo'>{s.nombre}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{s.descripcion ?? '—'}</td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-3'>
                        <Link href={`/catalogo/servicios/${s.id}`} className='text-kuati-petroleo font-semibold hover:text-kuati-lima transition-colors text-sm'>
                          Editar
                        </Link>
                        <form action={async () => { 'use server'; await toggleServicioEmpresa({ id: s.id, activo: !s.activo }); }}>
                          <button type='submit' className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${s.activo ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            {s.activo ? 'Desactivar' : 'Reactivar'}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA CELULAR: Tarjetas */}
          <div className='grid md:hidden gap-4'>
            {servicios.map((s) => (
              <div key={s.id} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-5 shadow-sm flex flex-col gap-3'>
                <div className='flex items-center gap-3 border-b border-kuati-borde pb-3'>
                  <div className='w-10 h-10 bg-kuati-petroleo/5 rounded-full flex items-center justify-center text-kuati-petroleo'>
                    <IconTool size={20} />
                  </div>
                  <h3 className='font-bold text-kuati-petroleo text-lg'>{s.nombre}</h3>
                </div>
                <p className='text-sm text-kuati-grafito/80'>
                  {s.descripcion ?? 'Sin descripción'}
                </p>
                <div className='pt-2 flex justify-end gap-2'>
                  <form action={async () => { 'use server'; await toggleServicioEmpresa({ id: s.id, activo: !s.activo }); }}>
                    <button type='submit' className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${s.activo ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                      {s.activo ? 'Desactivar' : 'Reactivar'}
                    </button>
                  </form>
                  <Link 
                    href={`/catalogo/servicios/${s.id}`} 
                    className='text-kuati-petroleo font-bold text-sm bg-kuati-fondo px-4 py-2 rounded-lg hover:bg-kuati-borde transition-colors'
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}