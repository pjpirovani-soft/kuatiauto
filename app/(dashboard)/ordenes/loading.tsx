export default function OrdenesLoading() {
  return (
    <div className='max-w-6xl mx-auto'>
      <header className='mb-6 flex items-center justify-between'>
        <div>
          <div className='h-8 w-32 bg-kuati-borde animate-pulse rounded mb-2' />
        </div>
        <div className='h-10 w-36 bg-kuati-borde animate-pulse rounded-lg' />
      </header>
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
        <div className='bg-kuati-fondo border-b border-kuati-borde px-6 py-4'>
          <div className='h-4 w-full bg-kuati-borde animate-pulse rounded' />
        </div>
        <div className='divide-y divide-kuati-borde'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='px-6 py-4 flex gap-4'>
              <div className='h-4 w-16 bg-kuati-borde animate-pulse rounded' />
              <div className='h-4 w-24 bg-kuati-borde animate-pulse rounded' />
              <div className='h-4 flex-1 bg-kuati-borde animate-pulse rounded' />
              <div className='h-4 w-20 bg-kuati-borde animate-pulse rounded' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}