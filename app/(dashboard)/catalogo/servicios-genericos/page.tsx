import Link from 'next/link';
import { listarServiciosGenericos } from '@/lib/genericos-actions';
import { IconArrowLeft, IconTool } from '@tabler/icons-react';

export default async function ServiciosGenericosPage() {
  const res = await listarServiciosGenericos();
  const servicios = res.ok ? res.data : [];

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6'>
        <Link href='/catalogo' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
          <IconArrowLeft size={16} /> Volver al catálogo
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo flex items-center gap-2'>
          Servicios genéricos
          <span className='text-sm bg-kuati-petroleo/10 text-kuati-petroleo px-2 py-1 rounded'>[G]</span>
        </h1>
        <p className='text-kuati-grafito/70 text-sm mt-1'>
          Los servicios estándar de KuatiAuto. No podés editarlos, pero podés usarlos en tus órdenes.
        </p>
      </header>

      {servicios.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-8 text-center'>
          <p className='text-kuati-grafito/60'>No hay servicios genéricos cargados todavía.</p>
        </div>
      ) : (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-kuati-fondo text-kuati-grafito border-b border-kuati-borde'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Nombre</th>
                <th className='px-6 py-4 font-semibold'>Descripción</th>
                <th className='px-6 py-4 font-semibold'>Intervalo</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-kuati-borde'>
              {servicios.map((s) => (
                <tr key={s.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                  <td className='px-6 py-4 font-medium text-kuati-petroleo'>
                    <span className='text-xs text-kuati-petroleo/60 mr-2'>[G]</span>
                    {s.nombre}
                  </td>
                  <td className='px-6 py-4 text-kuati-grafito/80'>{s.descripcion ?? '—'}</td>
                  <td className='px-6 py-4 text-kuati-grafito/80'>
                    {s.intervalo_km_sugerido ? `${s.intervalo_km_sugerido.toLocaleString('es-PY')} km` : ''}
                    {s.intervalo_km_sugerido && s.intervalo_meses_sugerido ? ' · ' : ''}
                    {s.intervalo_meses_sugerido ? `${s.intervalo_meses_sugerido} meses` : ''}
                    {!s.intervalo_km_sugerido && !s.intervalo_meses_sugerido ? '—' : ''}
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