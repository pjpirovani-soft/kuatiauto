export default function CatalogoLoading() {
  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6'>
        <div className='h-8 w-40 bg-kuati-borde animate-pulse rounded mb-2' />
        <div className='h-4 w-64 bg-kuati-borde animate-pulse rounded' />
      </header>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        {[1, 2].map((i) => (
          <div key={i} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6'>
            <div className='h-6 w-32 bg-kuati-borde animate-pulse rounded mb-2' />
            <div className='h-4 w-full bg-kuati-borde animate-pulse rounded' />
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {[1, 2].map((i) => (
          <div key={i} className='bg-kuati-fondo rounded-xl border border-kuati-borde p-6'>
            <div className='h-6 w-40 bg-kuati-borde animate-pulse rounded mb-2' />
            <div className='h-4 w-full bg-kuati-borde animate-pulse rounded' />
          </div>
        ))}
      </div>
    </div>
  );
}