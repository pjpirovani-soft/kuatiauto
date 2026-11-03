'use client';

import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import pkg from '@/package.json';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconBuilding,
  IconUsers,
  IconBox, IconChartBar, IconHelpCircle,
  IconLogout
} from '@tabler/icons-react';
import { logoutAction } from '@/lib/auth-actions';

const menuItems = [
  { name: 'Panel', href: '/admin', icon: IconLayoutDashboard, exact: true },
  { name: 'Empresas', href: '/admin/empresas', icon: IconBuilding },
  { name: 'Usuarios', href: '/admin/usuarios', icon: IconUsers },
  { name: 'Catálogo', href: '/admin/catalogo', icon: IconBox },
  { name: 'Métricas', href: '/admin/analytics', icon: IconChartBar },
  { name: 'Ayuda', href: '/ayuda/admin', icon: IconHelpCircle },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside className='w-64 h-screen sticky top-0 bg-kuati-petroleo text-kuati-blanco flex flex-col'>
      <div className='p-6 border-b border-white/20 flex items-center gap-3 shrink-0'><Logo variant='isotipo' theme='dark' showText={false} href='/admin' /><span className='text-xs uppercase tracking-widest text-kuati-blanco/60 font-semibold'>Admin</span></div>
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {menuItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');

          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all ' +
                (isActive
                  ? 'bg-kuati-lima text-kuati-petroleo font-semibold'
                  : 'hover:bg-kuati-petroleo/80 text-kuati-blanco/80 hover:text-kuati-blanco')
              }
            >
              <Icon
                size={20}
                stroke={isActive ? 2.5 : 1.5}
                className={isActive ? 'drop-shadow-[0_0_8px_rgba(163,217,0,0.6)]' : ''}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className='px-4 pb-2 text-center text-xs text-kuati-blanco/40 font-mono shrink-0'>
        v{pkg.version}
      </div>
      <div className='p-4 border-t border-white/20 shrink-0'>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-colors'
        >
          <IconLogout size={20} stroke={1.5} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}