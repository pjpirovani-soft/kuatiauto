'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconCar,
  IconUsers,
  IconTool,
  IconCalendarEvent,
  IconSettings,
} from '@tabler/icons-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard },
  { name: 'Vehículos', href: '/vehiculos', icon: IconCar },
  { name: 'Clientes', href: '/clientes', icon: IconUsers },
  { name: 'Servicios', href: '/catalogo/servicios', icon: IconTool },
  { name: 'Órdenes', href: '/ordenes', icon: IconCalendarEvent },
  { name: 'Configuración', href: '/admin', icon: IconSettings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-kuati-petroleo text-kuati-blanco flex flex-col">
      <div className="p-6 text-2xl font-bold tracking-wider border-b border-kuati-petroleo/50">
        KuatiAuto
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-kuati-lima text-kuati-petroleo font-semibold'
                  : 'hover:bg-kuati-petroleo/80 text-kuati-blanco/80 hover:text-kuati-blanco'
              }`}
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