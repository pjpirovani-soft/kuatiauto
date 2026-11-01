import Link from "next/link";
import { registerConductor } from "@/lib/auth-actions";
import { redirect } from "next/navigation";

export default function RegisterConductorPage() {
  async function handleRegister(formData: FormData) {
    "use server";
    const res = await registerConductor(formData);
    if (res?.error) { /* manejar error en client real */ }
    else redirect("/login?registered=1");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Registro de Conductor</h1>
        <form action={handleRegister} className="space-y-4">
          <div><label className="block text-sm mb-1">Nombre</label><input name="nombre" required className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm mb-1">Email</label><input name="email" type="email" required className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm mb-1">Contraseña</label><input name="password" type="password" required className="w-full border rounded px-3 py-2" /></div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded">Crear cuenta</button>
        </form>
        <p className="mt-4 text-sm text-center"><Link href="/login" className="underline">Volver al login</Link></p>
      </div>
    </div>
  );
}
