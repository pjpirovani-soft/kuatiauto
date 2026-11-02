import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { registerConductor } from "@/lib/auth-actions";
import { redirect } from "next/navigation";

export default function RegisterConductorPage() {
  async function handleRegister(formData: FormData) {
    "use server";
    const res = await registerConductor(formData);
    if (res?.error) {
      redirect(`/register-conductor?error=${encodeURIComponent(res.error)}`);
    } else {
      redirect("/login?registered=1");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-kuati-petroleo p-4">
      <div className="w-full max-w-md bg-kuati-blanco rounded-xl shadow-xl p-8 border border-kuati-borde">
        <div className="text-center mb-8">
          <Logo variant="horizontal" theme="light" priority size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-kuati-petroleo mb-2">Registro de Conductor</h1>
          <p className="text-kuati-grafito/70 text-sm">Creá tu cuenta para ver el historial de tus vehículos.</p>
        </div>

        <form action={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-kuati-grafito mb-1.5" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-kuati-grafito mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-kuati-grafito mb-1.5" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-kuati-lima text-kuati-petroleo font-bold px-6 py-3 rounded-lg hover:bg-kuati-lima/90 transition-all shadow-[0_0_15px_rgba(163,217,0,0.3)] hover:shadow-[0_0_25px_rgba(163,217,0,0.6)]"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-kuati-grafito/70">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-kuati-petroleo font-semibold underline hover:text-kuati-lima transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}