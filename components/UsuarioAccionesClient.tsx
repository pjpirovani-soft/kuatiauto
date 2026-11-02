"use client";

import { useState, useTransition } from "react";
import { cambiarRolUsuario, desactivarUsuario } from "@/lib/admin-actions";

const ROLES = ["propietario", "empleado", "conductor"] as const;

export function UsuarioAccionesClient({
  userId,
  rolActual,
  activo,
  esPropio,
  esAdminGeneral,
  empresaId,
}: {
  userId: string;
  rolActual: string;
  activo: boolean;
  esPropio: boolean;
  esAdminGeneral: boolean;
  empresaId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rolSel, setRolSel] = useState(rolActual);

  if (esPropio) {
    return <span className="text-xs text-gray-400">(vos)</span>;
  }
  if (esAdminGeneral) {
    return <span className="text-xs text-gray-400">admin_general</span>;
  }

  // Si no tiene empresa, no se puede asignar ningun rol de empresa.
  // Se muestra texto plano en lugar del selector.
  const bloqueado = empresaId === null;
  const opcionesValidas = ROLES.filter(() => empresaId !== null);

  const onCambiarRol = (nuevoRol: string) => {
    setRolSel(nuevoRol);
    setError(null);
    startTransition(async () => {
      const r = await cambiarRolUsuario(userId, nuevoRol);
      if (!r.ok) {
        setError(r.error);
        setRolSel(rolActual);
      }
    });
  };

  const onToggleActivo = () => {
    setError(null);
    startTransition(async () => {
      const r = await desactivarUsuario(userId, !activo);
      if (!r.ok) setError(r.error);
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {bloqueado ? (
          <span className="text-xs text-gray-500 italic">
            {rolActual} (sin empresa)
          </span>
        ) : (
          <select
            value={rolSel}
            disabled={pending}
            onChange={(e) => onCambiarRol(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white disabled:opacity-50"
          >
            {opcionesValidas.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={onToggleActivo}
          disabled={pending}
          className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          {activo ? "Desactivar" : "Reactivar"}
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}