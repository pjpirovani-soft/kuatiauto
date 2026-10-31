import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-4">KuatiAuto</h1>
        <p className="text-gray-600 mb-8">
          Plataforma SaaS multiempresa para mantenimiento automotor en Paraguay.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Iniciar sesion
          </Link>
          <Link href="/register" className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100">
            Registrarse
          </Link>
          <Link href="/directorio" className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100">
            Directorio
          </Link>
        </div>
      </div>
    </main>
  );
}
