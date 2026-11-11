import Link from "next/link";

export default function CatalogoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black underline">← Panel</Link>
        <h1 className="text-3xl font-bold mt-2">Catálogo</h1>
        <p className="text-sm text-gray-600 mt-1">
          Servicios y productos propios de tu empresa, más los genéricos que administra KuatiAuto.
        </p>
      </header>

      {/* Mis items (editables) */}
      <h2 className="text-lg font-bold text-kuati-petroleo mb-3">Mis servicios y productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/catalogo/servicios"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-kuati-lima transition-colors"
        >
          <h2 className="text-xl font-semibold mb-1 text-kuati-petroleo">Servicios</h2>
          <p className="text-sm text-gray-600">
            Mano de obra y tareas que ofrece tu taller.
          </p>
        </Link>

        <Link
          href="/catalogo/productos"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-kuati-lima transition-colors"
        >
          <h2 className="text-xl font-semibold mb-1 text-kuati-petroleo">Productos</h2>
          <p className="text-sm text-gray-600">
            Repuestos y lubricantes que usás o vendés. Lleva stock.
          </p>
        </Link>
      </div>

      {/* Genéricos (solo lectura) */}
      <h2 className="text-lg font-bold text-kuati-petroleo mb-3">Genéricos (solo lectura)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/catalogo/servicios-genericos"
          className="block bg-kuati-fondo rounded-xl border border-kuati-borde p-6 hover:border-kuati-petroleo/30 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-1 text-kuati-petroleo flex items-center gap-2">
            Servicios genéricos
            <span className="text-xs bg-kuati-petroleo/10 text-kuati-petroleo px-2 py-0.5 rounded">[G]</span>
          </h2>
          <p className="text-sm text-kuati-grafito/70">
            Los servicios estándar de KuatiAuto. No podés editarlos, pero podés usarlos en tus órdenes.
          </p>
        </Link>

        <Link
          href="/catalogo/productos-genericos"
          className="block bg-kuati-fondo rounded-xl border border-kuati-borde p-6 hover:border-kuati-petroleo/30 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-1 text-kuati-petroleo flex items-center gap-2">
            Productos genéricos
            <span className="text-xs bg-kuati-petroleo/10 text-kuati-petroleo px-2 py-0.5 rounded">[G]</span>
          </h2>
          <p className="text-sm text-kuati-grafito/70">
            Los productos estándar de KuatiAuto. No podés editarlos, pero podés usarlos en tus órdenes.
          </p>
        </Link>
      </div>
    </div>
  );
}