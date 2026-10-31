import Link from "next/link";

export default function CatalogoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black underline">← Panel</Link>
        <h1 className="text-3xl font-bold mt-2">Catálogo</h1>
        <p className="text-sm text-gray-600 mt-1">
          Servicios y productos propios de tu empresa. Se suman al catálogo global en las órdenes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/catalogo/servicios"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400"
        >
          <h2 className="text-xl font-semibold mb-1">Servicios</h2>
          <p className="text-sm text-gray-600">
            Mano de obra y tareas que ofrece tu taller.
          </p>
        </Link>

        <Link
          href="/catalogo/productos"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400"
        >
          <h2 className="text-xl font-semibold mb-1">Productos</h2>
          <p className="text-sm text-gray-600">
            Repuestos y lubricantes que usás o vendés. Lleva stock.
          </p>
        </Link>
      </div>
    </div>
  );
}