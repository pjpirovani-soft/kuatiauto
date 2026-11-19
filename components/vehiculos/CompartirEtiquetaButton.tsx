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

      // 1. Si hay URL publica, generamos el QR y lo inyectamos en el div #qr-container
      if (urlPublica) {
        const qrUrl = await QRCode.toDataURL(urlPublica, { width: 300, margin: 1 });
        const qrContainer = document.getElementById('qr-container');
        if (qrContainer) {
          qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR" width="150" height="150" style="border-radius: 8px;" />`;
        }
      }

      // 2. Esperar un poco a que la imagen del QR cargue
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 3. Capturar
      const dataUrl = await toPng(node, {
        width: 800,
        height: 1200,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
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
        className="inline-flex items-center gap-2 rounded-lg bg-kuati-petroleo px-4 py-2 text-sm font-semibold text-kuati-blanco hover:bg-kuati-petroleo/90 disabled:opacity-50"
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
            className="max-h-[90vh] w-full max-w-sm overflow-auto rounded-xl bg-kuati-blanco p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-kuati-grafito mb-3">Etiqueta generada</h3>
            <img src={png} alt="Etiqueta generada" className="mx-auto w-full rounded border border-kuati-borde shadow-sm" />
            
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={descargar} className="flex items-center justify-center gap-1 rounded bg-kuati-petroleo px-3 py-2 text-sm font-semibold text-kuati-blanco hover:bg-kuati-petroleo/90">
                ⬇️ Descargar
              </button>
              <button onClick={copiar} className="flex items-center justify-center gap-1 rounded border border-kuati-borde bg-kuati-blanco px-3 py-2 text-sm font-semibold text-kuati-grafito hover:bg-kuati-fondo">
                📋 Copiar
              </button>
              <button onClick={whatsapp} className="flex items-center justify-center gap-1 rounded bg-kuati-lima px-3 py-2 text-sm font-semibold text-kuati-petroleo hover:bg-kuati-lima/90">
                💬 WhatsApp
              </button>
              {urlPublica && (
                <a
                  href={urlPublica}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded border border-kuati-petroleo px-3 py-2 text-sm font-semibold text-kuati-petroleo hover:bg-kuati-petroleo/5"
                >
                  🔗 Ver ficha
                </a>
              )}
            </div>
            
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full rounded border border-kuati-borde px-3 py-2 text-sm text-kuati-grafito hover:bg-kuati-fondo"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}