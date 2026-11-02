'use client';

import { useState } from 'react';
import { IconChevronDown, IconBulb, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import type { AyudaBloque, AyudaSeccionData } from '@/lib/ayuda/types';

function AyudaFAQItem({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className='border border-kuati-borde rounded-lg overflow-hidden'>
      <button
        type='button'
        onClick={() => setAbierto(!abierto)}
        className='w-full flex items-center justify-between gap-3 px-4 py-3 bg-kuati-fondo hover:bg-kuati-borde/40 transition-colors text-left'
        aria-expanded={abierto}
      >
        <span className='font-medium text-kuati-grafito'>{pregunta}</span>
        <IconChevronDown
          size={18}
          className={'text-kuati-grafito/60 shrink-0 transition-transform ' + (abierto ? 'rotate-180' : '')}
        />
      </button>
      {abierto && (
        <div className='px-4 py-3 text-sm text-kuati-grafito/80 whitespace-pre-line bg-kuati-blanco'>
          {respuesta}
        </div>
      )}
    </div>
  );
}

function renderBloque(bloque: AyudaBloque, idx: number) {
  switch (bloque.tipo) {
    case 'parrafo':
      return (
        <p key={idx} className='text-kuati-grafito/80 leading-relaxed'>
          {bloque.texto}
        </p>
      );

    case 'lista':
      return (
        <ul key={idx} className='list-disc list-inside space-y-1.5 text-kuati-grafito/80 ml-2'>
          {bloque.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case 'pasos':
      return (
        <ol key={idx} className='space-y-3'>
          {bloque.items.map((paso, i) => (
            <li key={i} className='flex gap-3'>
              <div className='w-7 h-7 rounded-full bg-kuati-petroleo text-kuati-blanco text-sm font-bold flex items-center justify-center shrink-0'>
                {i + 1}
              </div>
              <div className='flex-1 pt-0.5'>
                <p className='font-medium text-kuati-grafito'>{paso.titulo}</p>
                {paso.descripcion && (
                  <p className='text-sm text-kuati-grafito/70 mt-1'>{paso.descripcion}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      );

    case 'tip':
      return (
        <div key={idx} className='flex gap-3 bg-kuati-lima/10 border border-kuati-lima/30 rounded-lg p-4'>
          <IconBulb size={20} className='text-kuati-petroleo shrink-0 mt-0.5' />
          <p className='text-sm text-kuati-grafito/90'>
            <span className='font-semibold'>Tip: </span>
            {bloque.texto}
          </p>
        </div>
      );

    case 'advertencia':
      return (
        <div key={idx} className='flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4'>
          <IconAlertTriangle size={20} className='text-amber-600 shrink-0 mt-0.5' />
          <p className='text-sm text-amber-900'>{bloque.texto}</p>
        </div>
      );

    case 'tabla':
      return (
        <div key={idx} className='overflow-x-auto border border-kuati-borde rounded-lg'>
          <table className='w-full text-sm'>
            <thead className='bg-kuati-fondo'>
              <tr>
                {bloque.headers.map((h, i) => (
                  <th key={i} className='px-4 py-2 text-left font-semibold text-kuati-grafito'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-kuati-borde'>
              {bloque.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className='px-4 py-2 text-kuati-grafito/80'>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'faq':
      return (
        <div key={idx} className='space-y-2'>
          {bloque.items.map((item, i) => (
            <AyudaFAQItem key={i} pregunta={item.pregunta} respuesta={item.respuesta} />
          ))}
        </div>
      );

    case 'captura':
      return (
        <figure key={idx} className='space-y-2'>
          <div className='bg-kuati-fondo border border-kuati-borde rounded-lg p-8 text-center text-kuati-grafito/50 text-sm'>
            Captura: {bloque.alt}
          </div>
          {bloque.caption && (
            <figcaption className='text-xs text-kuati-grafito/60 text-center'>{bloque.caption}</figcaption>
          )}
        </figure>
      );

    case 'link':
      return (
        <a
          key={idx}
          href={bloque.href}
          className='inline-flex items-center gap-1 text-kuati-petroleo font-medium hover:underline'
        >
          <IconCheck size={16} />
          {bloque.texto}
        </a>
      );

    default:
      return null;
  }
}

type Props = {
  seccion: AyudaSeccionData;
};

export default function AyudaSeccion({ seccion }: Props) {
  return (
    <section id={seccion.id} className='scroll-mt-24 space-y-4'>
      <h2 className='text-2xl font-bold text-kuati-petroleo pb-2 border-b border-kuati-borde'>
        {seccion.titulo}
      </h2>
      <div className='space-y-4'>
        {seccion.bloques.map((b, i) => renderBloque(b, i))}
      </div>
    </section>
  );
}