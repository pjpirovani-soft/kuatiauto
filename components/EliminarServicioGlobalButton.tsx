"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { eliminarServicioGlobal } from "@/lib/admin-actions";

export function EliminarServicioGlobalButton({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (!confirm(`Eliminar "${nombre}"? Esta accion no se puede deshacer.`)) return;
    startTransition(async () => {
      const r = await eliminarServicioGlobal(id);
      if (!r.ok) {
        alert(r.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}