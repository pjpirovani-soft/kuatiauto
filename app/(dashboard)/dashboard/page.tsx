import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  IconUsers,
  IconCar,
  IconPlus,
  IconClipboardList,
  IconCalendarStats,
  IconClockHour4,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { obtenerMetricasPropietario, obtenerVehiculosProximos } from '@/lib/propietario-metricas-actions';

const ESTADO_LABEL: Record<string, { label: string; clase: string }> = {
  borrador: { label: 'Pendiente', clase: 'bg-amber-100 text-amber-800' },
  completada: { label: 'Completada', clase: 'bg-emerald-100 text-emerald-800' },
  anulada: { label: 'Anulada', clase: 'bg-gray-100 text-gray-600' },
};

function formatearGs(n: number | null): string {
  if (n == null) return '—';
  return 'Gs. ' + n.toLocaleString('es-PY');
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id, rol')
    .eq('id', user.id)
    .maybeSingle();

  const tieneEmpresa = Boolean(usuario?.empresa_id);

  if (!tieneEmpresa) {
    return (
      <div className='max-w-4xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Panel Principal</h1>
          <p className='text-kuati-grafito/80 text-sm'>Sesion iniciada como {user.email}</p>
        </header>
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 text-center shadow-sm space-y-6'>
          <div className='max-w-md mx-auto'>
            <h2 className='text-xl font-bold text-kuati-petroleo mb-2'>Empecemos</h2>
            <p className='text-kuati-grafito/80'>
              Todavia no tenes una empresa creada. Creala para empezar a gestionar tu lubricentro.
            </p>
          </div>
          <Link
            href='/crear-empresa'
            className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-8 py-3 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors shadow-md'
          >
            <IconPlus size={20} aria-hidden='true' />
            Crear empresa
          </Link>
        </div>
      </div>
    );
  }

  const [metricas, proximos] = await Promise.all([
    obtenerMetricasPropietario(),
    obtenerVehiculosProximos(),
  ]);

  const cards = [
    { label: 'Clientes', valor: metricas.ok ? metricas.data.clientes : 0, Icon: IconUsers },
    { label: 'Vehiculos', valor: metricas.ok ? metricas.data.vehiculos : 0, Icon: IconCar },
    {
      label: 'Completadas (mes)',
      valor: metricas.ok ? metricas.data.ordenesCompletadasMes : 0,
      Icon: IconCalendarStats,
    },
    {
      label: 'Pendientes',
      valor: metricas.ok ? metricas.data.ordenesPendientes : 0,
      Icon: IconClockHour4,
    },
  ];

  const ultimas = metricas.ok ? metricas.ultimasOrdenes : [];

  return (
    <div className='max-w-5xl mx-auto'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Panel Principal</h1>
        <p className='text-kuati-grafito/80 text-sm'>Sesion iniciada como {user.email}</p>
      </header>

      {!metricas.ok && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3'>
          <span className='text-2xl'>⚠️</span>
          <div className='flex-1'>
            <p className='font-semibold text-red-800'>No se pudieron cargar las metricas</p>
            <p className='text-sm text-red-700 mt-1'>
              Hubo un problema al consultar los datos. Los numeros que ves abajo pueden estar desactualizados.
            </p>
            <p className='text-xs text-red-600 mt-2'>Error: {metricas.error}</p>
          </div>
          <a
            href='/dashboard'
            className='text-sm font-semibold text-red-700 hover:text-red-900 underline whitespace-nowrap'
          >
            Reintentar
          </a>
        </div>
      )}

      {!proximos.ok && (
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3'>
          <span className='text-2xl'>⚠️</span>
          <div className='flex-1'>
            <p className='font-semibold text-amber-800'>No se pudieron cargar las alertas de mantenimiento</p>
            <p className='text-sm text-amber-700 mt-1'>Hubo un problema al consultar los vehiculos proximos.</p>
          </div>
        </div>
      )}

      <section className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        {cards.map(({ label, valor, Icon }) => (
          <div
            key={label}
            className='bg-kuati-blanco rounded-xl border border-kuati-borde p-4 shadow-sm'
          >
            <div className='flex items-center gap-2 text-kuati-grafito/80 text-xs font-medium uppercase mb-2'>
              <Icon size={16} aria-hidden='true' />
              <span>{label}</span>
            </div>
            <p className='text-3xl font-bold text-kuati-petroleo'>{valor}</p>
          </div>
        ))}
      </section>

      {proximos.ok && proximos.data.length > 0 && (
        <section className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 shadow-sm'>
          <div className='flex items-center gap-2 mb-3'>
            <IconAlertTriangle size={20} aria-hidden='true' className='text-amber-600' />
            <h2 className='font-bold text-amber-900'>Vehiculos que requieren atencion</h2>
          </div>
          <div className='divide-y divide-amber-200'>
            {proximos.data.map((v) => (
              <Link
                key={v.id}
                href={'/vehiculos/' + v.id}
                className='flex items-center justify-between py-2 hover:bg-amber-100 transition-colors rounded px-2'
              >
                <div>
                  <p className='text-sm font-semibold text-amber-900'>
                    {v.marca} {v.modelo} {v.patente ? '(' + v.patente + ')' : ''}
                  </p>
                  <p className='text-xs text-amber-700'>
                    {v.cliente_nombre ?? 'Cliente sin nombre'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  {v.estado_alerta === 'vencido' && (
                    <span className='text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700'>
                      Vencido
                    </span>
                  )}
                  {v.estado_alerta === 'proximo' && (
                    <span className='text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800'>
                      Proximo
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className='flex flex-col sm:flex-row gap-3 mb-8'>
        <Link
          href='/ordenes/nuevo'
          className='flex-1 flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-3 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors shadow-md'
        >
          <IconPlus size={20} aria-hidden='true' />
          Nueva orden
        </Link>
        <Link
          href='/clientes/nuevo'
          className='flex-1 flex items-center justify-center gap-2 bg-kuati-lima text-kuati-petroleo px-6 py-3 rounded-lg font-bold hover:bg-kuati-lima/90 transition-colors shadow-[0_0_15px_rgba(163,217,0,0.3)]'
        >
          <IconPlus size={20} aria-hidden='true' />
          Nuevo cliente
        </Link>
      </section>

      {ultimas.length > 0 && (
        <section className='bg-kuati-blanco rounded-xl border border-kuati-borde shadow-sm overflow-hidden'>
          <div className='px-4 py-3 border-b border-kuati-borde flex items-center justify-between'>
            <h2 className='font-semibold text-kuati-petroleo flex items-center gap-2'>
              <IconClipboardList size={18} aria-hidden='true' />
              Ultimas ordenes
            </h2>
            <Link href='/ordenes' className='text-sm text-kuati-petroleo hover:underline'>
              Ver todas
            </Link>
          </div>
          <div className='divide-y divide-kuati-borde'>
            {ultimas.map((o) => {
              const est = ESTADO_LABEL[o.estado] ?? ESTADO_LABEL.borrador;
              return (
                <Link
                  key={o.id}
                  href={'/ordenes/' + o.id}
                  className='block px-4 py-3 hover:bg-kuati-borde/20 transition-colors'
                >
                  <div className='flex items-center justify-between gap-2 mb-1'>
                    <span className='text-sm font-medium text-kuati-grafito'>
                      {o.cliente_nombre ?? 'Cliente sin nombre'}
                    </span>
                    <span className={'text-xs px-2 py-0.5 rounded-full font-semibold ' + est.clase}>
                      {est.label}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-xs text-kuati-grafito/80 gap-2'>
                    <span>
                      {o.fecha} · {o.vehiculo_marca ?? ''} {o.vehiculo_modelo ?? ''}{' '}
                      {o.vehiculo_patente ? '(' + o.vehiculo_patente + ')' : ''}
                    </span>
                    <span className='font-semibold text-kuati-grafito'>
                      {formatearGs(o.importe_total)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {ultimas.length === 0 && metricas.ok && (
        <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-8 text-center shadow-sm'>
          <IconClipboardList size={40} aria-hidden='true' className='mx-auto text-kuati-grafito/30 mb-3' />
          <p className='text-kuati-grafito/80 text-sm'>
            Todavia no hay ordenes registradas. Crea la primera con el boton de arriba.
          </p>
        </section>
      )}

      {ultimas.length === 0 && !metricas.ok && (
        <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-8 text-center shadow-sm'>
          <IconClipboardList size={40} aria-hidden='true' className='mx-auto text-kuati-grafito/30 mb-3' />
          <p className='text-kuati-grafito/80 text-sm'>
            No se pudieron cargar las ultimas ordenes. Reintenta recargando la pagina.
          </p>
        </section>
      )}
    </div>
  );
}