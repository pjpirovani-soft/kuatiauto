'use client';

import { useState } from "react";
import { proponerHistorial } from "@/lib/conductor-actions";

export default function ProponerHistorialForm({ vehiculoId }: { vehiculoId: string }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true); setMsg(null);
    const res = await proponerHistorial({ conductor_email: email, vehiculo_empresa_id: vehiculoId });
    setPending(false);
    if (!res.ok) { setMsg("Error: " + res.error); return; }
    setMsg("Invitación generada. Enviá este token al conductor: " + res.data.token);
  }

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="font-semibold mb-2">Compartir historial con conductor</h3>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email del conductor" required className="border px-2 py-1 rounded text-sm flex-1" />
        <button type="submit" disabled={pending} className="bg-blue-600 text-white px-4 py-1 rounded text-sm">{pending ? "..." : "Generar Link"}</button>
      </form>
      {msg && <p className="text-sm mt-2 text-gray-700 bg-gray-100 p-2 rounded break-all">{msg}</p>}
    </div>
  );
}
