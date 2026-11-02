import { obtenerMetricasAdmin } from '@/lib/admin-metricas-actions';
import { IconBuilding, IconUsers, IconClipboardList, IconCar, IconUserCheck } from '@tabler/icons-react';

export default async function AdminAnalyticsPage() {
  const res = await obtenerMetricasAdmin();
  
  if (!res.ok || !res.data) {
    return (
      <div className='p-8 text-red-600'>
        <h1 className='text-2xl font-bold mb-2'>Error de acceso</h1>
        <p>No tenés permisos para ver esta página.</p>
      </div>
    );
  }

  const { data } = res;

  return (
    <div className='max-w-6xl mx-auto'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Métricas Globales</h1>
        <p className='text-kuati-grafito/70 mt-1'>Resumen del estado de la plataforma KuatiAuto.</p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Card: Empresas */}
        <div className='bg-kuati-blanco p-6 rounded-xl border border-kuati-borde shadow-sm flex items-center gap-4'>
          <div className='w-12 h-12 bg-kuati-petroleo/10 rounded-lg flex items-center justify-center text-kuati-petroleo'>
            <IconBuilding size={24} />
          </div>
          <div>
            <p className='text-sm text-kuati-grafito/60 font-medium'>Empresas</p>
            <p className='text-2xl font-bold text-kuati-petroleo'>{data.empresas}</p>
          </div>
        </div>

        {/* Card: Usuarios */}
        <div className='bg-kuati-blanco p-6 rounded-xl border border-kuati-borde shadow-sm flex items-center gap-4'>
          <div className='w-12 h-12 bg-kuati-lima/20 rounded-lg flex items-center justify-center text-kuati-petroleo'>
            <IconUsers size={24} />
          </div>
          <div>
            <p className='text-sm text-kuati-grafito/60 font-medium'>Usuarios Totales</p>
            <p className='text-2xl font-bold text-kuati-petroleo'>{data.usuarios}</p>
          </div>
        </div>

        {/* Card: Órdenes */}
        <div className='bg-kuati-blanco p-6 rounded-xl border border-kuati-borde shadow-sm flex items-center gap-4'>
          <div className='w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600'>
            <IconClipboardList size={24} />
          </div>
          <div>
            <p className='text-sm text-kuati-grafito/60 font-medium'>Órdenes Totales</p>
            <p className='text-2xl font-bold text-kuati-petroleo'>{data.ordenes}</p>
          </div>
        </div>

        {/* Card: Vehículos */}
        <div className='bg-kuati-blanco p-6 rounded-xl border border-kuati-borde shadow-sm flex items-center gap-4'>
          <div className='w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600'>
            <IconCar size={24} />
          </div>
          <div>
            <p className='text-sm text-kuati-grafito/60 font-medium'>Vehículos</p>
            <p className='text-2xl font-bold text-kuati-petroleo'>{data.vehiculos}</p>
          </div>
        </div>
      </div>

      {/* Desglose de Usuarios por Rol */}
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 shadow-sm'>
        <h2 className='text-lg font-bold text-kuati-petroleo mb-4 flex items-center gap-2'>
          <IconUserCheck size={20} /> Usuarios por Rol
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {Object.entries(data.usuariosPorRol).map(([rol, cantidad]) => (
            <div key={rol} className='bg-kuati-fondo p-4 rounded-lg border border-kuati-borde text-center'>
              <p className='text-sm text-kuati-grafito/60 capitalize'>{rol.replace('_', ' ')}</p>
              <p className='text-xl font-bold text-kuati-petroleo'>{cantidad}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

