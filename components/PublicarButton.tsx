'use client';

import { useState, useTransition } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { publicarMiEstablecimiento } from "@/lib/establecimiento-actions";

type Props = {
  establecimientoPublicoId: string;
  publicado: boolean;
};

export default function PublicarButton({ establecimientoPublicoId, publicado }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const res = await publicarMiEstablecimiento({
        establecimiento_publico_id: establecimientoPublicoId,
        publicado: !publicado,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={
          publicado
            ? "border border-red-300 text-red-700 px-4 py-2 rounded hover:bg-red-50 disabled:opacity-50"
            : "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        }
      >
        {pending && <IconLoader2 size={14} className="animate-spin" />}{pending ? "Procesando..." : publicado ? "Despublicar" : "Publicar en directorio"}
      </button>
      <span className="text-sm text-gray-600">
        {publicado ? "Publicado en el directorio" : "No publicado"}
      </span>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
