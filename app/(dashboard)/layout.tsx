import SidebarPropietario from '@/components/SidebarPropietario';
import MobileSidebarWrapper from '@/components/MobileSidebarWrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden bg-kuati-fondo'>
      <MobileSidebarWrapper>
        <SidebarPropietario />
      </MobileSidebarWrapper>
      <main className='flex-1 h-screen overflow-y-auto pt-16 md:pt-0 p-4 md:p-8 w-full'>
        {children}
      </main>
    </div>
  );
}