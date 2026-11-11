'use client';

import { IconPrinter } from '@tabler/icons-react';

export default function BotonImprimir() {
  return (
    <button
      type='button'
      onClick={() => window.print()}
      className='no-print inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
    >
      <IconPrinter size={18} />
      Imprimir / PDF
    </button>
  );
}