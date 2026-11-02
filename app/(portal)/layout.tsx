import SidebarConductor from '@/components/SidebarConductor';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-kuati-fondo'>
      <SidebarConductor />
      <main className='flex-1 p-8 overflow-y-auto'>
        {children}
      </main>
    </div>
  );
}
