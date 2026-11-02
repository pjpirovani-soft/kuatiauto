'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconLayoutDashboard, IconUsers, IconCar, IconClipboardList, IconBox, IconBuildingStore, IconLogout } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard, exact: true },
  { name: 'Clientes', href: '/clientes', icon: IconUsers },
  { name: 'Vehículos', href: '/vehiculos', icon: IconCar },
  { name: 'Órdenes', href: '/ordenes', icon: IconClipboardList },
  { name: 'Catálogo', href: '/catalogo', icon: IconBox, exact: true },
  { name: 'Establecimientos', href: '/establecimientos', icon: IconBuildingStore },
];

export default function SidebarPropietario() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className='w-64 min-h-screen bg-kuati-petroleo text-kuati-blanco flex flex-col'>
      <div className='p-6 text-2xl font-bold tracking-wider border-b border-white/20'>
        KuatiAuto
      </div>
      <nav className='flex-1 p-4 space-y-2'>
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
      <div className='p-4 border-t border-white/20'>
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
