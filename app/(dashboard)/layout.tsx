import SidebarPropietario from '@/components/SidebarPropietario';
import MobileSidebarWrapper from '@/components/MobileSidebarWrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden bg-kuati-fondo'>
      {/* Skip link para usuarios de teclado */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-kuati-petroleo focus:text-kuati-blanco focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold'
      >
        Saltar al contenido principal
      </a>
      <MobileSidebarWrapper>
        <SidebarPropietario />
      </MobileSidebarWrapper>
      <main id='main-content' tabIndex={-1} className='flex-1 h-screen overflow-y-auto pt-16 md:pt-0 p-4 md:p-8 w-full outline-none'>
        {children}
      </main>
    </div>
  );
}