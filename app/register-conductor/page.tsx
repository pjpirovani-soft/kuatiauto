import Link from "next/link";
import { registerConductor } from "@/lib/auth-actions";
import { redirect } from "next/navigation";
import { IconCar, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

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
    <main className="min-h-screen flex items-center justify-center bg-kuati-grafito p-4">
      <div className="w-full max-w-md">
        <Link
          href="/empezar"
          className="inline-flex items-center gap-2 text-kuati-blanco/60 hover:text-kuati-lima mb-4 text-sm transition-colors"
        >
          <IconArrowLeft size={16} /> Volver
        </Link>

        <div className="bg-kuati-blanco rounded-xl shadow-xl p-8 border border-kuati-borde">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-kuati-lima flex items-center justify-center mx-auto mb-4">
              <IconCar size={32} className="text-kuati-petroleo" />
            </div>
            <h1 className="text-2xl font-bold text-kuati-petroleo mb-2">Crear cuenta de conductor</h1>
            <p className="text-kuati-grafito/70 text-sm">Tu garage digital en KuatiAuto.</p>
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
                minLength={8}
                className="w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-kuati-lima text-kuati-petroleo font-semibold py-2.5 rounded-lg hover:bg-kuati-lima/90 transition-colors"
            >
              Crear cuenta
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-kuati-borde space-y-3 text-sm text-center">
            <p className="text-kuati-grafito/70">
              ¿Sos lubricentro?{' '}
              <Link href="/register" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-kuati-lima/10 text-kuati-petroleo font-semibold hover:bg-kuati-lima/20 transition-all animate-pulse-slow">
                Registrate acá
                <IconArrowRight size={14} />
              </Link>
            </p>
            <p className="text-kuati-grafito/60 text-xs">
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" className="text-kuati-petroleo hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}