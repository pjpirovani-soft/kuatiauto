import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IconArrowLeft, IconHelpCircle } from '@tabler/icons-react';
import { obtenerPerfil, type Rol } from '@/lib/perfil-actions';
import PerfilForm from '@/components/perfil/PerfilForm';

const ROL_LABEL: Record<Rol, string> = {
  propietario: 'Propietario',
  conductor: 'Conductor',
  admin_general: 'Administrador',
  empleado: 'Empleado',
};

const AYUDA_HREF: Record<Rol, string> = {
  propietario: '/ayuda/propietario',
  conductor: '/ayuda/conductor',
  admin_general: '/ayuda/admin',
  empleado: '/ayuda',
};

export default async function PerfilPage() {
  const perfil = await obtenerPerfil();
  if (!perfil) redirect('/login');

  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-kuati-grafito/60 hover:text-kuati-petroleo text-sm transition-colors'
          >
            <IconArrowLeft size={16} /> Volver al inicio
          </Link>
          <Link
            href={AYUDA_HREF[perfil.rol]}
            className='inline-flex items-center gap-2 text-kuati-grafito/60 hover:text-kuati-petroleo text-sm transition-colors'
          >
            <IconHelpCircle size={16} /> Ayuda
          </Link>
        </div>

        <h1 className='text-3xl font-bold text-kuati-petroleo mb-2'>Mi perfil</h1>
        <p className='text-kuati-grafito/70 mb-8'>
          Gestioná tu información personal y tu contraseña.
        </p>

        <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm mb-6'>
          <h2 className='text-sm font-semibold uppercase tracking-wide text-kuati-grafito/50 mb-4'>
            Cuenta
          </h2>
          <dl className='space-y-3 text-sm'>
            <div className='flex justify-between gap-4'>
              <dt className='text-kuati-grafito/60'>Email</dt>
              <dd className='font-medium text-kuati-petroleo break-all text-right'>
                {perfil.email}
              </dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt className='text-kuati-grafito/60'>Rol</dt>
              <dd className='font-medium text-kuati-petroleo text-right'>
                {ROL_LABEL[perfil.rol]}
              </dd>
            </div>
          </dl>
        </section>

        <PerfilForm nombreInicial={perfil.nombre} />
      </div>
    </div>
  );
}