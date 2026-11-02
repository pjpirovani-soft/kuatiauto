import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import AyudaRolCard from '@/components/ayuda/AyudaRolCard';
import { HUB_TITULO, HUB_SUBTITULO, HUB_ROLES, HUB_FAQS, HUB_CONTACTO } from '@/lib/ayuda/hub';

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

        <section className='bg-kuati-petroleo text-kuati-blanco rounded-xl p-8 md:p-10'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-2xl font-bold mb-3'>¿Necesitás más ayuda?</h2>
            <p className='text-kuati-blanco/80 mb-6'>
              Nuestro equipo de soporte te responde en horario laboral.
            </p>
            <div className='grid sm:grid-cols-2 gap-4 text-sm text-kuati-blanco/90'>
              <div>
                <p className='font-semibold text-kuati-blanco'>Email</p>
                <a href={'mailto:' + HUB_CONTACTO.email} className='hover:text-kuati-lima transition-colors'>
                  {HUB_CONTACTO.email}
                </a>
              </div>
              <div>
                <p className='font-semibold text-kuati-blanco'>WhatsApp</p>
                <p>{HUB_CONTACTO.whatsapp}</p>
              </div>
            </div>
            <p className='text-xs text-kuati-blanco/60 mt-6'>{HUB_CONTACTO.horario}</p>
            <a
              href={'mailto:' + HUB_CONTACTO.email}
              className='inline-block mt-6 bg-kuati-lima text-kuati-petroleo font-bold px-6 py-2.5 rounded-lg hover:bg-kuati-lima/90 transition-colors'
            >
              Contactar soporte
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}