import SidebarPropietario from '@/components/SidebarPropietario';
import MobileSidebarWrapper from '@/components/MobileSidebarWrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-kuati-fondo'>
      <MobileSidebarWrapper>
        <SidebarPropietario />
      </MobileSidebarWrapper>
      <main className='flex-1 p-4 md:p-8 overflow-y-auto w-full'>
        {children}
      </main>
    </div>
  );
}
