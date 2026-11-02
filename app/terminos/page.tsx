import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export default function TerminosPage() {
  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-3xl mx-auto bg-kuati-blanco p-8 md:p-12 rounded-xl shadow-sm border border-kuati-borde'>
        <Link href='/' className='inline-flex items-center gap-2 text-kuati-grafito/60 hover:text-kuati-petroleo mb-6 text-sm transition-colors'>
          <IconArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo mb-6'>Términos y Condiciones</h1>
        
        <div className='space-y-6 text-kuati-grafito/80 leading-relaxed'>
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-PY')}</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar KuatiAuto, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo, por favor no utilices la plataforma.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>2. Descripción del Servicio</h2>
          <p>KuatiAuto es una plataforma SaaS (Software como Servicio) diseñada para la gestión de lubricentros, talleres y mantenimiento preventivo de vehículos en Paraguay.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>3. Registro y Cuentas</h2>
          <p>Para utilizar ciertas funcionalidades, debés registrarte y proporcionar información veraz. Sos responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran en tu cuenta.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>4. Uso Aceptable</h2>
          <p>Te comprometés a no utilizar la plataforma para fines ilícitos, a no intentar acceder a datos de otras empresas (cross-tenant) y a no realizar actividades que puedan dañar la infraestructura del servicio.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>5. Propiedad Intelectual</h2>
          <p>Todo el contenido, código, diseño y marcas de KuatiAuto son propiedad de sus respectivos dueños y están protegidos por las leyes de propiedad intelectual de Paraguay.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>6. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia al ser publicadas en esta página.</p>
          
          <p className='mt-12 text-sm text-kuati-grafito/60 border-t border-kuati-borde pt-6'>Para consultas sobre estos términos, contactanos a través de los canales oficiales.</p>
        </div>
      </div>
    </div>
  );
}
