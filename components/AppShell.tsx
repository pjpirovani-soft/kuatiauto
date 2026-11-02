'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Rutas públicas que NO deben mostrar el sidebar
  const publicRoutes = ['/login', '/register', '/register-conductor'];
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublic) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}