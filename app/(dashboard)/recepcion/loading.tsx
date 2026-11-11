export default function RecepcionLoading() {
  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6'>
        <div className='h-8 w-48 bg-kuati-borde animate-pulse rounded mb-2' />
        <div className='h-4 w-64 bg-kuati-borde animate-pulse rounded' />
      </header>
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8'>
        <div className='h-6 w-32 bg-kuati-borde animate-pulse rounded mb-4' />
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-12 w-full bg-kuati-borde animate-pulse rounded-lg' />
          ))}
        </div>
      </div>
    </div>
  );
}