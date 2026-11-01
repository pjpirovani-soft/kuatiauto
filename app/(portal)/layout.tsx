import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: conductor } = await supabase.from("conductor").select("nombre").eq("id", user.id).maybeSingle();
  if (!conductor) redirect("/dashboard"); // Si no es conductor, mandarlo a su panel

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b"><span className="text-xl font-bold">Mi Garaje</span><p className="text-xs text-gray-500 mt-1">{conductor.nombre}</p></div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/mi-garage" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">Panel</Link>
          <Link href="/mi-garage/vehiculos" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">Mis Vehículos</Link>
          <Link href="/mi-garage/historial" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">Historial</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
