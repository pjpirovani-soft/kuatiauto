'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MiUbicacionButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // DIR-4: preservar los filtros actuales al setear lat/lng/radio.
        const current = new URLSearchParams(searchParams.toString());
        current.set('lat', latitude.toString());
        current.set('lng', longitude.toString());
        current.set('radio', '50');
        // H-DIR-1: borrar 'ciudad' para que la ubicacion real tenga prioridad
        // sobre el filtro de ciudad (si no, el mapa ignoraria la geolocalizacion).
        current.delete('ciudad');
        router.push(`/directorio?${current.toString()}`);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'No pudimos obtener tu ubicación');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="border rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? 'Buscando...' : '📍 Mi ubicación'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}