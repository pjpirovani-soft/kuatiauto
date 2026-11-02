import Link from 'next/link';
import { IconArrowLeft, IconUsers, IconCar, IconClipboardList, IconMapPin } from '@tabler/icons-react';

const guias = [
  { icon: IconUsers, title: 'Gestionar Clientes', desc: 'Aprendé a registrar y editar los datos de tus clientes.' },
  { icon: IconCar, title: 'Cargar Vehículos', desc: 'Cómo asociar vehículos a clientes y llevar el historial de kilometraje.' },
  { icon: IconClipboardList, title: 'Crear Órdenes', desc: 'Registrá servicios, productos y el estado de cada trabajo.' },
  { icon: IconMapPin, title: 'Directorio', desc: 'Publicá tu establecimiento para que nuevos clientes te encuentren.' },
];

export default function AyudaPage() {
  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <Link href='/' className='inline-flex items-center gap-2 text-kuati-grafito/60 hover:text-kuati-petroleo mb-6 text-sm transition-colors'>
          <IconArrowLeft size={16} /> Volver al inicio
        </Link>
        
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-kuati-petroleo mb-4'>Centro de Ayuda</h1>
          <p className='text-kuati-grafito/70'>Todo lo que necesitás para empezar a usar KuatiAuto.</p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {guias.map((guia, index) => {
            const Icon = guia.icon;
            return (
              <div key={index} className='bg-kuati-blanco p-6 rounded-xl border border-kuati-borde shadow-sm hover:shadow-md transition-shadow'>
                <div className='w-12 h-12 bg-kuati-petroleo/5 rounded-lg flex items-center justify-center mb-4 text-kuati-petroleo'>
                  <Icon size={24} />
                </div>
                <h3 className='text-lg font-bold text-kuati-petroleo mb-2'>{guia.title}</h3>
                <p className='text-kuati-grafito/70 text-sm'>{guia.desc}</p>
              </div>
            );
          })}
        </div>

        <div className='mt-12 bg-kuati-petroleo text-kuati-blanco p-8 rounded-xl text-center'>
          <h2 className='text-xl font-bold mb-2'>¿Necesitás más ayuda?</h2>
          <p className='text-kuati-blanco/80 mb-4'>Contactá a nuestro equipo de soporte.</p>
          <a href='mailto:soporte@kuatiauto.com.py' className='inline-block bg-kuati-lima text-kuati-petroleo font-bold px-6 py-2 rounded-lg hover:bg-kuati-lima/90 transition-colors'>
            Contactar Soporte
          </a>
        </div>
      </div>
    </div>
  );
}
