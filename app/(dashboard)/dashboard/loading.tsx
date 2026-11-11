export default function DashboardLoading() {
  return (
    <div className='max-w-5xl mx-auto'>
      {/* Header skeleton */}
      <header className='mb-8'>
        <div className='h-8 w-64 bg-kuati-borde animate-pulse rounded mb-2' />
        <div className='h-4 w-48 bg-kuati-borde animate-pulse rounded' />
      </header>

      {/* Cards skeleton */}
      <section className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-4 shadow-sm'>
            <div className='h-4 w-20 bg-kuati-borde animate-pulse rounded mb-2' />
            <div className='h-8 w-16 bg-kuati-borde animate-pulse rounded' />
          </div>
        ))}
      </section>

      {/* Botones skeleton */}
      <section className='flex flex-col sm:flex-row gap-3 mb-8'>
        <div className='flex-1 h-12 bg-kuati-borde animate-pulse rounded-lg' />
        <div className='flex-1 h-12 bg-kuati-borde animate-pulse rounded-lg' />
      </section>

      {/* Últimas órdenes skeleton */}
      <section className='bg-kuati-blanco rounded-xl border border-kuati-borde shadow-sm overflow-hidden'>
        <div className='px-4 py-3 border-b border-kuati-borde'>
          <div className='h-5 w-40 bg-kuati-borde animate-pulse rounded' />
        </div>
        <div className='divide-y divide-kuati-borde'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='px-4 py-3'>
              <div className='flex items-center justify-between gap-2 mb-2'>
                <div className='h-4 w-32 bg-kuati-borde animate-pulse rounded' />
                <div className='h-4 w-20 bg-kuati-borde animate-pulse rounded' />
              </div>
              <div className='flex items-center justify-between'>
                <div className='h-3 w-48 bg-kuati-borde animate-pulse rounded' />
                <div className='h-3 w-16 bg-kuati-borde animate-pulse rounded' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}