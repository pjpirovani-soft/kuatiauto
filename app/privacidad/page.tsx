import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export default function PrivacidadPage() {
  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-3xl mx-auto bg-kuati-blanco p-8 md:p-12 rounded-xl shadow-sm border border-kuati-borde'>
        <Link href='/' className='inline-flex items-center gap-2 text-kuati-grafito/60 hover:text-kuati-petroleo mb-6 text-sm transition-colors'>
          <IconArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo mb-6'>Política de Privacidad</h1>
        
        <div className='space-y-6 text-kuati-grafito/80 leading-relaxed'>
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-PY')}</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>1. Datos que Recopilamos</h2>
          <p>Recopilamos la información que nos proporcionás al registrarte (email, nombre, teléfono), así como los datos operativos de tu empresa (clientes, vehículos, órdenes de trabajo).</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>2. Uso de los Datos</h2>
          <p>Utilizamos tus datos exclusivamente para prestar el servicio de gestión de lubricentro, enviar notificaciones relacionadas con el mantenimiento vehicular y garantizar la seguridad de la plataforma.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>3. Aislamiento Multiempresa (RLS)</h2>
          <p>Implementamos políticas de Row Level Security (RLS) a nivel de base de datos. Esto garantiza que los datos de tu empresa sean completamente inaccesibles para otras empresas que utilicen KuatiAuto.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>4. Derechos del Titular</h2>
          <p>De acuerdo con la Ley N° 6534/2020 de Paraguay, tenés derecho a acceder, rectificar, eliminar y oponerte al tratamiento de tus datos personales. Podés ejercer estos derechos desde tu perfil o contactándonos.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>5. Retención y Seguridad</h2>
          <p>Los datos se conservan mientras tu cuenta esté activa. Utilizamos encriptación HTTPS, contraseñas hasheadas y auditoría de accesos para proteger la información.</p>
          
          <h2 className='text-xl font-semibold text-kuati-petroleo mt-8'>6. Notificación de Incidentes</h2>
          <p>En caso de una brecha de seguridad que afecte datos personales, notificaremos a los usuarios afectados dentro de las 72 horas posteriores a la detección, conforme a la legislación vigente.</p>
          
          <p className='mt-12 text-sm text-kuati-grafito/60 border-t border-kuati-borde pt-6'>Para ejercer tus derechos o consultas sobre privacidad, contactanos a través de los canales oficiales.</p>
        </div>
      </div>
    </div>
  );
}
