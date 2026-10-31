import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import Link from 'next/link';

const NAV = [
  { href: '/dashboard', label: 'Panel' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/vehiculos', label: 'Vehículos' },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: usuario } = await supabase
    .from('usuario')
    .select('nombre, rol')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <Link href="/dashboard" className="block">
            <span className="text-xl font-bold">KuatiAuto</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {usuario?.nombre ?? user.email}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/directorio"
            className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Directorio
          </a>
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}