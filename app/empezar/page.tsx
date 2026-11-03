import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IconArrowLeft, IconBuildingStore, IconCar, IconCheck, IconUserPlus } from '@tabler/icons-react';

export const metadata = {
  title: 'Crear cuenta — KuatiAuto',
  description: 'Elegí cómo querés usar KuatiAuto: gestionar tu lubricentro o consultar tu historial de mantenimiento.',
};

async function getRedireccionSiLogueado(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: usuario } = await supabase
    .from('usuario')
    .select('rol, empresa_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!usuario) return '/login';

  // Orden de redirects (consistente con auth-actions.ts)
  if (usuario.rol === 'admin_general') return '/admin';
  if (usuario.rol === 'conductor') return '/mi-garage';
  if (!usuario.empresa_id) return '/crear-empresa';
  return '/dashboard';
}

export default async function EmpezarPage() {
  const redirectTo = await getRedireccionSiLogueado();
  if (redirectTo) redirect(redirectTo);

  return (
    <main className='min-h-screen bg-kuati-petroleo py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-kuati-blanco/60 hover:text-kuati-lima mb-8 text-sm transition-colors'
        >
          <IconArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-kuati-blanco mb-3'>¿Cómo querés usar KuatiAuto?</h1>
          <p className='text-kuati-blanco/70 text-lg'>Elegí la opción que mejor te describa.</p>
        </div>

        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          {/* Tarjeta Lubricentro */}
          <Link
            href='/register'
            className='group bg-kuati-blanco rounded-2xl p-8 shadow-xl border-2 border-transparent hover:border-kuati-lima transition-all hover:-translate-y-1 hover:shadow-2xl'
          >
            <div className='w-16 h-16 rounded-2xl bg-kuati-petroleo flex items-center justify-center mb-5 group-hover:scale-110 transition-transform'>
              <IconBuildingStore size={32} className='text-kuati-lima' />
            </div>

            <h2 className='text-2xl font-bold text-kuati-petroleo mb-2'>Tengo un lubricentro</h2>
            <p className='text-kuati-grafito/70 text-sm mb-5'>
              Gestiono un taller o lubricentro y necesito administrar clientes, vehículos y órdenes de trabajo.
            </p>

            <ul className='space-y-2 mb-6'>
              {[
                'Gestionar clientes y vehículos',
                'Crear órdenes de trabajo',
                'Publicar en el directorio',
                'Ver métricas del negocio',
              ].map((item) => (
                <li key={item} className='flex items-center gap-2 text-sm text-kuati-grafito'>
                  <IconCheck size={16} className='text-kuati-lima shrink-0' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <span className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-5 py-2.5 rounded-lg font-semibold group-hover:bg-kuati-petroleo/90 transition-colors'>
              <IconUserPlus size={18} />
              Crear cuenta
            </span>
          </Link>

          {/* Tarjeta Conductor */}
          <Link
            href='/register-conductor'
            className='group bg-kuati-blanco rounded-2xl p-8 shadow-xl border-2 border-transparent hover:border-kuati-petroleo transition-all hover:-translate-y-1 hover:shadow-2xl'
          >
            <div className='w-16 h-16 rounded-2xl bg-kuati-lima flex items-center justify-center mb-5 group-hover:scale-110 transition-transform'>
              <IconCar size={32} className='text-kuati-petroleo' />
            </div>

            <h2 className='text-2xl font-bold text-kuati-petroleo mb-2'>Soy conductor</h2>
            <p className='text-kuati-grafito/70 text-sm mb-5'>
              Quiero ver el historial de mantenimiento de mis vehículos y autorizar a mi taller a compartirlo.
            </p>

            <ul className='space-y-2 mb-6'>
              {[
                'Ver mi historial de mantenimiento',
                'Autorizar o revocar talleres',
                'Recibir recordatorios',
                'Controlar mis datos',
              ].map((item) => (
                <li key={item} className='flex items-center gap-2 text-sm text-kuati-grafito'>
                  <IconCheck size={16} className='text-kuati-lima shrink-0' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <span className='inline-flex items-center gap-2 bg-kuati-lima text-kuati-petroleo px-5 py-2.5 rounded-lg font-semibold group-hover:bg-kuati-lima/90 transition-colors'>
              <IconUserPlus size={18} />
              Crear cuenta
            </span>
          </Link>
        </div>

        <div className='bg-kuati-blanco/5 border border-kuati-blanco/10 rounded-xl p-6 text-center'>
          <p className='text-kuati-blanco/70 text-sm'>
            ¿Ya tenés cuenta?{' '}
            <Link href='/login' className='text-kuati-lima font-semibold hover:underline'>
              Iniciar sesión
            </Link>
          </p>
          <p className='text-kuati-blanco/50 text-xs mt-3'>
            ¿Sos empleado de un lubricentro? Pedile al dueño que te invite desde su panel.
          </p>
        </div>
      </div>
    </main>
  );
}