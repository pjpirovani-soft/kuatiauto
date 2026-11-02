import SidebarAdmin from '@/components/SidebarAdmin';
import MobileSidebarWrapper from '@/components/MobileSidebarWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-kuati-fondo'>
      <MobileSidebarWrapper>
        <SidebarAdmin />
      </MobileSidebarWrapper>
      <main className='flex-1 pt-16 md:pt-0 p-4 md:p-8 overflow-y-auto w-full'>
        {children}
      </main>
    </div>
  );
}
