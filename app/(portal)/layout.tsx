import SidebarConductor from '@/components/SidebarConductor';
import MobileSidebarWrapper from '@/components/MobileSidebarWrapper';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-kuati-fondo'>
      <MobileSidebarWrapper>
        <SidebarConductor />
      </MobileSidebarWrapper>
      <main className='flex-1 p-4 md:p-8 overflow-y-auto w-full'>
        {children}
      </main>
    </div>
  );
}
