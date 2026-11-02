import Link from "next/link";
import { listarUsuariosAdmin } from "@/lib/admin-actions";
import { UsuarioAccionesClient } from "@/components/UsuarioAccionesClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ROLES_FILTRO = [
  { key: "todos", label: "Todos" },
  { key: "admin_general", label: "Admin general" },
  { key: "propietario", label: "Propietario" },
  { key: "empleado", label: "Empleado" },
  { key: "conductor", label: "Conductor" },
];

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string }>;
}) {
  const sp = await searchParams;
  const filtroRol = sp.rol && sp.rol !== "todos" ? sp.rol : undefined;

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const currentUserId = currentUser?.id ?? "";

  const res = await listarUsuariosAdmin(filtroRol);
  if (!res.ok) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  const usuarios = res.data;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-sm text-gray-600 mt-1">
            {usuarios.length} {usuarios.length === 1 ? "usuario" : "usuarios"}
            {filtroRol ? ` (${filtroRol})` : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLES_FILTRO.map((f) => {
            const active = (filtroRol ?? "todos") === f.key;
            const href = f.key === "todos" ? "/admin/usuarios" : `/admin/usuarios?rol=${f.key}`;
            return (
              <Link
                key={f.key}
                href={href}
                className={
                  "px-3 py-1.5 text-sm rounded border " +
                  (active
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          No hay usuarios{filtroRol ? ` con rol ${filtroRol}` : ""}.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Rol</th>
                <th className="text-left px-4 py-3 font-medium">Empresa</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const esPropio = u.id === currentUserId;
                const esAdminGeneral = u.rol === "admin_general";
                return (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{u.nombre ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.empresa_id && u.empresa_nombre ? (
                        <Link
                          href={`/admin/empresas/${u.empresa_id}`}
                          className="text-blue-700 hover:underline"
                        >
                          {u.empresa_nombre}
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.activo ? (
                        <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <UsuarioAccionesClient
                        userId={u.id}
                        rolActual={u.rol}
                        activo={u.activo}
                        esPropio={esPropio}
                        esAdminGeneral={esAdminGeneral}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}