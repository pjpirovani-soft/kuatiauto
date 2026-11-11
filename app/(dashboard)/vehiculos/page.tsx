import Link from 'next/link';
import { listarVehiculosEmpresa } from '@/lib/vehiculos-actions';
import { IconPlus, IconCar, IconCalendar, IconId, IconRoad } from '@tabler/icons-react';

type Vehiculo = {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  patente: string | null;
  km_actual: number | null;
  cliente: { nombre: string | null } | null;
};

export default async function VehiculosPage() {
  const res = await listarVehiculosEmpresa();
  const vehiculos: Vehiculo[] = res.ok ? (res.data as Vehiculo[]) : [];

  return (
    <div className='max-w-5xl mx-auto'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Vehículos</h1>
        <Link
          href='/vehiculos/nuevo'
          className='inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
        >
          <IconPlus size={18} />
          Nuevo vehículo
        </Link>
      </header>

      {!res.ok && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6'>
          {res.error}
        </div>
      )}

      {vehiculos.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center text-kuati-grafito/70 shadow-sm'>
          <p>Todavía no hay vehículos cargados.</p>
        </div>
      ) : (
        <>
          {/* VISTA ESCRITORIO: Tabla */}
          <div className='hidden md:block bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-kuati-fondo text-kuati-grafito border-b border-kuati-borde'>
                <tr>
                  <th className='px-6 py-4 font-semibold'>Vehículo</th>
                  <th className='px-6 py-4 font-semibold'>Dueño</th>
                  <th className='px-6 py-4 font-semibold'>Año</th>
                  <th className='px-6 py-4 font-semibold'>Patente</th>
                  <th className='px-6 py-4 font-semibold'>Km</th>
                  <th className='px-6 py-4 font-semibold text-right'>Acción</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {vehiculos.map((v) => (
                  <tr key={v.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                    <td className='px-6 py-4 font-medium text-kuati-petroleo'>{v.marca} {v.modelo}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{v.cliente?.nombre ?? '—'}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{v.anio ?? '—'}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{v.patente ?? '—'}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{v.km_actual != null ? v.km_actual.toLocaleString('es-PY') : '—'}</td>
                    <td className='px-6 py-4 text-right'>
                      <Link href={`/vehiculos/${v.id}`} className='text-kuati-petroleo font-semibold hover:text-kuati-lima transition-colors text-sm'>
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA CELULAR: Tarjetas */}
          <div className='grid md:hidden gap-4'>
            {vehiculos.map((v) => (
              <div key={v.id} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-5 shadow-sm flex flex-col gap-3'>
                <div className='flex items-center gap-3 border-b border-kuati-borde pb-3'>
                  <div className='w-10 h-10 bg-kuati-petroleo/5 rounded-full flex items-center justify-center text-kuati-petroleo'>
                    <IconCar size={20} />
                  </div>
                  <div>
                    <h3 className='font-bold text-kuati-petroleo text-lg'>{v.marca} {v.modelo}</h3>
                    <p className='text-xs text-kuati-grafito/70 mt-0.5'>{v.cliente?.nombre ?? 'Sin dueño'}</p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3 text-sm text-kuati-grafito/80'>
                  <p className='flex items-center gap-2'>
                    <IconCalendar size={16} className='text-kuati-grafito/50' />
                    Año: {v.anio ?? '—'}
                  </p>
                  <p className='flex items-center gap-2'>
                    <IconId size={16} className='text-kuati-grafito/50' />
                    {v.patente ?? 'Sin patente'}
                  </p>
                  <p className='col-span-2 flex items-center gap-2'>
                    <IconRoad size={16} className='text-kuati-grafito/50' />
                    {v.km_actual != null ? `${v.km_actual.toLocaleString('es-PY')} km` : 'Km no registrado'}
                  </p>
                </div>
                <div className='pt-2 flex justify-end'>
                  <Link 
                    href={`/vehiculos/${v.id}`} 
                    className='text-kuati-petroleo font-bold text-sm bg-kuati-fondo px-4 py-2 rounded-lg hover:bg-kuati-borde transition-colors'
                  >
                    Ver vehículo
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
