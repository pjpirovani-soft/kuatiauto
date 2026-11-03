import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import AyudaRolCard from '@/components/ayuda/AyudaRolCard';
import AyudaContacto from '@/components/ayuda/AyudaContacto';
import { HUB_TITULO, HUB_SUBTITULO, HUB_ROLES, HUB_FAQS } from '@/lib/ayuda/hub';

export default function AyudaPage() {
  return (
    <div className='min-h-screen bg-kuati-fondo py-12 px-4'>
      <div className='max-w-5xl mx-auto'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-kuati-grafito/60 hover:text-kuati-petroleo mb-6 text-sm transition-colors'
        >
          <IconArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-kuati-petroleo mb-4'>{HUB_TITULO}</h1>
          <p className='text-kuati-grafito/70 text-lg max-w-2xl mx-auto'>{HUB_SUBTITULO}</p>
        </div>

        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-kuati-petroleo mb-6'>Elegí tu rol</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            {HUB_ROLES.map((rol) => (
              <AyudaRolCard key={rol.rol} data={rol} />
            ))}
          </div>
        </section>

        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-kuati-petroleo mb-6'>Preguntas frecuentes</h2>
          <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm space-y-3'>
            {HUB_FAQS.map((faq, i) => (
              <details key={i} className='group border-b border-kuati-borde last:border-b-0 pb-3 last:pb-0'>
                <summary className='flex items-center justify-between gap-3 cursor-pointer list-none py-2'>
                  <span className='font-medium text-kuati-grafito'>{faq.pregunta}</span>
                  <span className='text-kuati-grafito/40 group-open:rotate-180 transition-transform'>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <polyline points='6 9 12 15 18 9' />
                    </svg>
                  </span>
                </summary>
                <div className='text-sm text-kuati-grafito/80 whitespace-pre-line pt-2 pb-1'>
                  {faq.respuesta}
                </div>
              </details>
            ))}
          </div>
        </section>

        <AyudaContacto />
      </div>
    </div>
  );
}