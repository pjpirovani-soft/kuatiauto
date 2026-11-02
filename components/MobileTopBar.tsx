'use client';

import { IconMenu2 } from '@tabler/icons-react';

export default function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className='md:hidden fixed top-0 left-0 right-0 h-16 bg-kuati-petroleo text-kuati-blanco flex items-center px-4 z-40 shadow-md'>
      <button
        onClick={onMenuClick}
        className='p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors'
        aria-label='Abrir menú'
      >
        <IconMenu2 size={24} />
      </button>
      <span className='ml-4 font-bold text-lg tracking-wider'>KuatiAuto</span>
    </div>
  );
}
