import SidebarAdmin from '@/components/SidebarAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-kuati-fondo'>
      <SidebarAdmin />
      <main className='flex-1 p-8 overflow-y-auto'>
        {children}
      </main>
    </div>
  );
}
