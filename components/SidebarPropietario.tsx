'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import pkg from '@/package.json';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconUsers,
  IconCar,
  IconClipboardList,
  IconBox,
  IconBuildingStore,
  IconBolt,
  IconHelpCircle,
  IconLogout,
  IconUser,
  IconChartBar,
} from '@tabler/icons-react';
import { logoutAction } from '@/lib/auth-actions';

type MenuItem = {
  name: string;
  href: string;
  icon: any;
  exact?: boolean;
  destacado?: boolean;
};

const GROUPS: MenuItem[][] = [
  [
    { name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard, exact: true },
    { name: 'Clientes', href: '/clientes', icon: IconUsers },
    { name: 'Vehículos', href: '/vehiculos', icon: IconCar },
    { name: 'Órdenes', href: '/ordenes', icon: IconClipboardList },
    { name: 'Catálogo', href: '/catalogo', icon: IconBox, exact: true },
  ],
  [
    { name: 'Recepción rápida', href: '/recepcion', icon: IconBolt, destacado: true },
    { name: 'Reportes', href: '/reportes', icon: IconChartBar },
  ],
  [
    { name: 'Establecimientos', href: '/establecimientos', icon: IconBuildingStore },
    { name: 'Ayuda', href: '/ayuda/propietario', icon: IconHelpCircle },
  ],
];

export default function SidebarPropietario() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <aside className='w-full h-full md:h-screen bg-kuati-petroleo text-kuati-blanco flex flex-col'>
      <div className='p-6 border-b border-white/20 shrink-0'>
        <Logo variant='isotipo' theme='dark' showText={true} href='/dashboard' />
      </div>
      <nav aria-label='Navegación principal' className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className={groupIndex > 0 ? 'pt-2 border-t border-white/10' : ''}>
            <div className='space-y-2'>
              {group.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + '/');

                const Icon = item.icon;
                const esDestacado = item.destacado === true;

                // Clases base comunes
                const baseClasses = 'btn-press flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-kuati-petroleo';

                // Clases condicionales según el tipo de botón
                let varianteClasses = '';
                if (esDestacado) {
                  // Botón destacado (dorado): siempre dorado, se aclara al hover
                  varianteClasses = 'bg-kuati-dorado text-kuati-petroleo font-bold hover:bg-kuati-dorado-hover focus-visible:ring-kuati-dorado shadow-[0_0_15px_rgba(212,175,55,0.3)]';
                } else if (isActive) {
                  // Botón activo normal (lima)
                  varianteClasses = 'bg-kuati-lima text-kuati-petroleo font-semibold focus-visible:ring-kuati-lima';
                } else {
                  // Botón normal
                  varianteClasses = 'hover:bg-kuati-petroleo/80 text-kuati-blanco/80 hover:text-kuati-blanco focus-visible:ring-kuati-lima';
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={baseClasses + ' ' + varianteClasses}
                  >
                    <Icon
                      size={20}
                      stroke={esDestacado || isActive ? 2.5 : 1.5}
                      className={
                        esDestacado
                          ? 'drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]'
                          : isActive
                          ? 'drop-shadow-[0_0_8px_rgba(163,217,0,0.6)]'
                          : ''
                      }
                      aria-hidden='true'
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className='px-4 pb-2 text-center text-xs text-kuati-blanco/70 font-mono shrink-0'>
        v{pkg.version}
      </div>
      <div className='p-4 border-t border-white/20 shrink-0'>
        <Link
          href='/perfil'
          className='btn-press w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-kuati-petroleo/80 text-kuati-blanco/80 hover:text-kuati-blanco transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuati-lima focus-visible:ring-offset-2 focus-visible:ring-offset-kuati-petroleo'
        >
          <IconUser size={20} stroke={1.5} aria-hidden='true' />
          <span>Mi perfil</span>
        </Link>
        <button
          type='button'
          onClick={handleLogout}
          disabled={isPending}
          className='btn-press w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-kuati-petroleo'
        >
          <IconLogout size={20} stroke={1.5} aria-hidden='true' />
          <span>{isPending ? 'Cerrando...' : 'Cerrar Sesión'}</span>
        </button>
      </div>
    </aside>
  );
}