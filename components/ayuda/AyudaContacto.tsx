import { IconBrandWhatsapp, IconWorld, IconMail, IconClock, IconUserCircle } from '@tabler/icons-react';
import { HUB_FUNDADOR } from '@/lib/ayuda/hub';

export default function AyudaContacto() {
  return (
    <section className='bg-kuati-petroleo text-kuati-blanco rounded-xl p-6 md:p-10'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-12 h-12 rounded-full bg-kuati-lima/20 flex items-center justify-center'>
            <IconUserCircle size={28} className='text-kuati-lima' />
          </div>
          <div>
            <h2 className='text-2xl font-bold'>{HUB_FUNDADOR.nombre}</h2>
            <p className='text-kuati-blanco/70 text-sm'>{HUB_FUNDADOR.rol}</p>
          </div>
        </div>

        <p className='text-kuati-blanco/80 mb-6'>
          ¿Tenés una consulta sobre KuatiAuto? Escribime directamente. Respondo personalmente en horario laboral.
        </p>

        <div className='grid sm:grid-cols-3 gap-4'>
          <a
            href={HUB_FUNDADOR.whatsappLink}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 bg-kuati-blanco/10 hover:bg-kuati-blanco/20 rounded-lg p-4 transition-colors group'
          >
            <IconBrandWhatsapp size={24} className='text-kuati-lima shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-kuati-blanco/60 uppercase tracking-wide'>WhatsApp</p>
              <p className='text-sm font-semibold truncate group-hover:text-kuati-lima transition-colors'>
                {HUB_FUNDADOR.whatsapp}
              </p>
            </div>
          </a>

          <a
            href={'mailto:' + HUB_FUNDADOR.email}
            className='flex items-center gap-3 bg-kuati-blanco/10 hover:bg-kuati-blanco/20 rounded-lg p-4 transition-colors group'
          >
            <IconMail size={24} className='text-kuati-lima shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-kuati-blanco/60 uppercase tracking-wide'>Email</p>
              <p className='text-sm font-semibold truncate group-hover:text-kuati-lima transition-colors'>
                {HUB_FUNDADOR.email}
              </p>
            </div>
          </a>

          <a
            href={HUB_FUNDADOR.portfolio}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 bg-kuati-blanco/10 hover:bg-kuati-blanco/20 rounded-lg p-4 transition-colors group'
          >
            <IconWorld size={24} className='text-kuati-lima shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-kuati-blanco/60 uppercase tracking-wide'>Portfolio</p>
              <p className='text-sm font-semibold truncate group-hover:text-kuati-lima transition-colors'>
                pjpirovani
              </p>
            </div>
          </a>
        </div>

        <div className='flex items-center gap-2 mt-6 text-xs text-kuati-blanco/60'>
          <IconClock size={14} />
          <span>{HUB_FUNDADOR.horario}</span>
        </div>
      </div>
    </section>
  );
}