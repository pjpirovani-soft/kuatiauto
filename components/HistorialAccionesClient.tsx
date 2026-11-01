'use client';

import { useState } from "react";
import { aceptarHistorial, revocarHistorial } from "@/lib/conductor-actions";

type Props = {
  historialId: string;
  tokenPropuesta: string | null;
  autorizado: boolean;
};

export default function HistorialAccionesClient({ historialId, tokenPropuesta, autorizado }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAceptar() {
    if (!tokenPropuesta) { setError("Sin token de propuesta"); return; }
    setPending(true); setError(null);
    const res = await aceptarHistorial({ token: tokenPropuesta });
    setPending(false);
    if (!res.ok) setError(res.error);
  }

  async function onRevocar() {
    setPending(true); setError(null);
    const res = await revocarHistorial({ id: historialId });
    setPending(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {autorizado ? (
        <button
          type="button"
          onClick={onRevocar}
          disabled={pending}
          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? "..." : "Revocar"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onAceptar}
          disabled={pending || !tokenPropuesta}
          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {pending ? "..." : "Aceptar"}
        </button>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

