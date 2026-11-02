'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconLayoutDashboard, IconBuilding, IconUsers, IconBox } from '@tabler/icons-react';

const menuItems = [
  { name: 'Panel', href: '/admin', icon: IconLayoutDashboard },
  { name: 'Empresas', href: '/admin/empresas', icon: IconBuilding },
  { name: 'Usuarios', href: '/admin/usuarios', icon: IconUsers },
  { name: 'Catálogo', href: '/admin/catalogo', icon: IconBox },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className='w-64 min-h-screen bg-kuati-petroleo text-kuati-blanco flex flex-col'>
      <div className='p-6 text-2xl font-bold tracking-wider border-b border-white/20'>
        KuatiAuto Admin
      </div>
      <nav className='flex-1 p-4 space-y-2'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ' +
                (isActive
                  ? 'bg-kuati-lima text-kuati-petroleo font-semibold'
                  : 'hover:bg-kuati-petroleo/80 text-kuati-blanco/80 hover:text-kuati-blanco')
              }
            >
              <Icon size={20} stroke={isActive ? 2 : 1.5} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
