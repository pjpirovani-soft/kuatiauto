import AyudaBreadcrumb from '@/components/ayuda/AyudaBreadcrumb';
import AyudaSeccion from '@/components/ayuda/AyudaSeccion';
import AyudaIndiceLateral from '@/components/ayuda/AyudaIndiceLateral';
import { GUIA_PROPIETARIO } from '@/lib/ayuda/propietario';

export const metadata = {
  title: 'Guía del propietario — Centro de Ayuda — KuatiAuto',
  description: GUIA_PROPIETARIO.subtitulo,
};

export default function AyudaPropietarioPage() {
  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        <AyudaBreadcrumb items={[{ label: 'Guía del propietario' }]} />

        <header className='mb-10 mt-4'>
          <h1 className='text-4xl font-bold text-kuati-petroleo mb-3'>
            {GUIA_PROPIETARIO.titulo}
          </h1>
          <p className='text-kuati-grafito/70 text-lg max-w-3xl'>
            {GUIA_PROPIETARIO.subtitulo}
          </p>
        </header>

        <div className='grid lg:grid-cols-[1fr_280px] gap-8'>
          <main className='space-y-12 min-w-0'>
            {GUIA_PROPIETARIO.secciones.map((seccion) => (
              <AyudaSeccion key={seccion.id} seccion={seccion} />
            ))}

            <div className='bg-kuati-lima/10 border border-kuati-lima/30 rounded-xl p-6 text-center'>
              <p className='text-kuati-grafito/90'>
                Llegaste al final. Si todavia tenes dudas, escribinos a{' '}
                <a
                  href='mailto:soporte@kuatiauto.com.py'
                  className='text-kuati-petroleo font-semibold hover:underline'
                >
                  soporte@kuatiauto.com.py
                </a>
              </p>
            </div>
          </main>

          <AyudaIndiceLateral secciones={GUIA_PROPIETARIO.secciones} />
        </div>
      </div>
    </div>
  );
}