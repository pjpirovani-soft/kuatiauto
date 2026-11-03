import AyudaBreadcrumb from '@/components/ayuda/AyudaBreadcrumb';
import AyudaSeccion from '@/components/ayuda/AyudaSeccion';
import AyudaIndiceLateral from '@/components/ayuda/AyudaIndiceLateral';
import AyudaContacto from '@/components/ayuda/AyudaContacto';
import { GUIA_ADMIN } from '@/lib/ayuda/admin';

export const metadata = {
  title: 'Guía del administrador — Centro de Ayuda — KuatiAuto',
  description: GUIA_ADMIN.subtitulo,
};

export default function AyudaAdminPage() {
  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        <AyudaBreadcrumb items={[{ label: 'Guía del administrador' }]} />

        <header className='mb-10 mt-4'>
          <h1 className='text-4xl font-bold text-kuati-petroleo mb-3'>
            {GUIA_ADMIN.titulo}
          </h1>
          <p className='text-kuati-grafito/70 text-lg max-w-3xl'>
            {GUIA_ADMIN.subtitulo}
          </p>
        </header>

        <div className='grid lg:grid-cols-[1fr_280px] gap-8'>
          <main className='space-y-12 min-w-0'>
            {GUIA_ADMIN.secciones.map((seccion) => (
              <AyudaSeccion key={seccion.id} seccion={seccion} />
            ))}

            <AyudaContacto />
          </main>

          <AyudaIndiceLateral secciones={GUIA_ADMIN.secciones} />
        </div>
      </div>
    </div>
  );
}