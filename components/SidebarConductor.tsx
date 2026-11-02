'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconCar, IconHistory, IconHome } from '@tabler/icons-react';

const menuItems = [
  { name: 'Mis Vehículos', href: '/mi-garage/vehiculos', icon: IconCar },
  { name: 'Historial', href: '/mi-garage/historial', icon: IconHistory },
];

export default function SidebarConductor() {
  const pathname = usePathname();

  return (
    <aside className='w-64 min-h-screen bg-kuati-petroleo text-kuati-blanco flex flex-col'>
      <div className='p-6 text-2xl font-bold tracking-wider border-b border-white/20'>
        Mi Garage
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
      <div className='p-4 border-t border-white/20'>
        <Link href='/' className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-kuati-petroleo/80 text-kuati-blanco/80 hover:text-kuati-blanco transition-colors'>
          <IconHome size={20} stroke={1.5} />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </aside>
  );
}
