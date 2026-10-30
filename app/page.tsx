export default function HomePage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Web App Blueprint</h1>
      <p className="mb-6 text-gray-700">
        Blueprint con auth (login/register/logout) y CRUD de clientes con RLS. Listo para clonar y
        extender.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-gray-600">
        <li>Next.js 16 + React 19 + Tailwind 4</li>
        <li>Supabase (auth + DB + RLS) implementado</li>
        <li>Zod para validacion en cliente y servidor</li>
      </ul>
    </main>
  );
}
