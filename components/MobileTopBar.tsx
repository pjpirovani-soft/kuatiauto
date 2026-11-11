'use client';

import { IconMenu2 } from '@tabler/icons-react';

type Props = {
  onMenuClick: () => void;
  isOpen?: boolean;
};

export default function MobileTopBar({ onMenuClick, isOpen = false }: Props) {
  return (
    <div className='md:hidden fixed top-0 left-0 right-0 h-16 bg-kuati-petroleo text-kuati-blanco flex items-center px-4 z-40 shadow-md'>
      <button
        type='button'
        onClick={onMenuClick}
        className='p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors'
        aria-label='Abrir menú de navegación'
        aria-expanded={isOpen}
        aria-controls='mobile-sidebar'
      >
        <IconMenu2 size={24} />
      </button>
      <span className='ml-4 font-bold text-lg tracking-wider'>KuatiAuto</span>
    </div>
  );
}