'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MiUbicacionButton() {
  const router = useRouter();
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
        router.push(`/directorio?lat=${latitude}&lng=${longitude}&radio=50`);
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