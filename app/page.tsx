import Link from 'next/link';
import { 
  IconTool, 
  IconMapPin, 
  IconCar, 
  IconShieldCheck 
} from '@tabler/icons-react';

export default function Home() {
  return (
    <div className='min-h-screen bg-kuati-fondo flex flex-col'>
      
      {/* Navbar simple */}
      <header className='bg-kuati-petroleo text-kuati-blanco p-4 md:px-8 flex justify-between items-center'>
        <div className='text-2xl font-bold tracking-wider'>KuatiAuto</div>
        <div className='flex gap-4'>
          <Link href='/login' className='px-4 py-2 text-sm font-medium hover:text-kuati-lima transition-colors'>
            Iniciar Sesión
          </Link>
          <Link href='/register' className='bg-kuati-lima text-kuati-petroleo px-4 py-2 rounded-lg text-sm font-bold hover:bg-kuati-lima/90 transition-colors'>
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1'>
        <section className='bg-kuati-petroleo text-kuati-blanco py-20 px-4 text-center'>
          <div className='max-w-3xl mx-auto'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 tracking-tight'>
              El sistema definitivo para tu <span className='text-kuati-lima'>Lubricentro</span>
            </h1>
            <p className='text-lg md:text-xl text-kuati-blanco/80 mb-10 max-w-2xl mx-auto'>
              Gestioná clientes, vehículos y órdenes de trabajo. Conectá con tus clientes a través del portal del conductor y potenciá tu negocio en Paraguay.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/register' className='bg-kuati-lima text-kuati-petroleo font-bold px-8 py-3 rounded-lg text-lg hover:bg-kuati-lima/90 transition-all shadow-[0_0_15px_rgba(163,217,0,0.3)] hover:shadow-[0_0_25px_rgba(163,217,0,0.5)]'>
                Comenzar ahora
              </Link>
              <Link href='/directorio' className='border border-kuati-blanco/30 px-8 py-3 rounded-lg text-lg hover:bg-kuati-blanco/10 transition-colors'>
                Ver Directorio
              </Link>
            </div>
          </div>
        </section>

        {/* Características */}
        <section className='py-20 px-4 max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-kuati-petroleo mb-4'>Todo lo que necesitás en un solo lugar</h2>
            <p className='text-kuati-grafito/70'>Diseñado específicamente para las necesidades del sector automotor.</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Card 1 */}
            <div className='bg-kuati-blanco p-8 rounded-xl border border-kuati-borde shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-kuati-petroleo/5 rounded-lg flex items-center justify-center mb-6 text-kuati-petroleo'>
                <IconTool size={28} />
              </div>
              <h3 className='text-xl font-bold text-kuati-petroleo mb-2'>Gestión Integral</h3>
              <p className='text-kuati-grafito/70 text-sm leading-relaxed'>
                Controlá órdenes de trabajo, stock de productos, servicios y el historial completo de cada vehículo.
              </p>
            </div>

            {/* Card 2 */}
            <div className='bg-kuati-blanco p-8 rounded-xl border border-kuati-borde shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-kuati-petroleo/5 rounded-lg flex items-center justify-center mb-6 text-kuati-petroleo'>
                <IconMapPin size={28} />
              </div>
              <h3 className='text-xl font-bold text-kuati-petroleo mb-2'>Directorio Público</h3>
              <p className='text-kuati-grafito/70 text-sm leading-relaxed'>
                Aparecé en nuestro directorio y permití que nuevos clientes encuentren tu lubricentro por ubicación y servicios.
              </p>
            </div>

            {/* Card 3 */}
            <div className='bg-kuati-blanco p-8 rounded-xl border border-kuati-borde shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-kuati-petroleo/5 rounded-lg flex items-center justify-center mb-6 text-kuati-petroleo'>
                <IconCar size={28} />
              </div>
              <h3 className='text-xl font-bold text-kuati-petroleo mb-2'>Portal del Conductor</h3>
              <p className='text-kuati-grafito/70 text-sm leading-relaxed'>
                Tus clientes pueden ver el historial de mantenimiento de sus vehículos y recibir recordatorios automáticos.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-kuati-borde py-8 text-center text-sm text-kuati-grafito/60'>
        <p className='flex items-center justify-center gap-2'>
          <IconShieldCheck size={16} />
          KuatiAuto &copy; {new Date().getFullYear()} - Plataforma SaaS para el sector automotor.
        </p>
      </footer>
    </div>
  );
}
