'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';

type Props = {
  etiquetaId?: string;
  urlPublica: string | null;
  clienteEmail?: string | null;
  clienteNombre?: string | null;
  empresaNombre: string;
  vehiculoDescripcion: string;
};

export default function CompartirEtiquetaButton({
  etiquetaId = 'etiqueta-mantenimiento',
  urlPublica,
  clienteEmail,
  clienteNombre,
  empresaNombre,
  vehiculoDescripcion,
}: Props) {
  const [png, setPng] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generar() {
    setLoading(true);
    setError(null);
    try {
      const node = document.getElementById(etiquetaId);
      if (!node) throw new Error('No se encontro la etiqueta en el DOM');

      // Generar QR si hay URL publica
      let qrUrl: string | null = null;
      if (urlPublica) {
        qrUrl = await QRCode.toDataURL(urlPublica, { width: 320, margin: 1 });
        // Reemplazar/inyectar QR en el DOM antes de capturar
        const qrTarget = node.querySelector('[data-qr-target]') as HTMLElement | null;
        if (qrTarget) {
          qrTarget.innerHTML = `<img src="${qrUrl}" alt="QR" width="160" height="160" />`;
        }
      }

      const dataUrl = await toPng(node, {
        width: 800,
        height: 1200,
        pixelRatio: 2,
        backgroundColor: '#1e3a8a',
      });
      setPng(dataUrl);
      setModalOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error generando imagen');
    } finally {
      setLoading(false);
    }
  }

  function descargar() {
    if (!png) return;
    const a = document.createElement('a');
    a.href = png;
    a.download = `mantenimiento-${vehiculoDescripcion.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  }

  async function copiar() {
    if (!png) return;
    try {
      const blob = await (await fetch(png)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      alert('Imagen copiada al portapapeles');
    } catch {
      alert('No se pudo copiar. Usa "Descargar".');
    }
  }

  function whatsapp() {
    const text = encodeURIComponent(
      `Hola${clienteNombre ? ' ' + clienteNombre : ''}! Te comparto la etiqueta de mantenimiento de tu ${vehiculoDescripcion} en ${empresaNombre}.`
    );
    if (urlPublica) {
      window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(urlPublica)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={generar}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generando...' : '📋 Compartir etiqueta de mantenimiento'}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {modalOpen && png && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={png} alt="Etiqueta generada" className="mx-auto w-full rounded" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={descargar} className="rounded bg-gray-800 px-3 py-2 text-sm text-white">
                ⬇️ Descargar
              </button>
              <button onClick={copiar} className="rounded bg-gray-800 px-3 py-2 text-sm text-white">
                📋 Copiar
              </button>
              <button onClick={whatsapp} className="rounded bg-green-600 px-3 py-2 text-sm text-white">
                💬 WhatsApp
              </button>
              {urlPublica && (
                <a
                  href={urlPublica}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-blue-600 px-3 py-2 text-center text-sm text-white"
                >
                  🔗 Ver ficha
                </a>
              )}
            </div>
            {clienteEmail && (
              <p className="mt-3 text-xs text-gray-500">
                Envio por email a {clienteEmail}: en desarrollo (requiere endpoint).
              </p>
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="mt-3 w-full rounded border px-3 py-2 text-sm text-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}