'use client';

import type { DatosEtiqueta } from '@/lib/etiqueta-mantenimiento';

type Props = {
  id?: string;
  datos: DatosEtiqueta;
  qrDataUrl?: string | null;
  appUrl?: string;
};

function fmtFecha(f: string | null): string {
  if (!f) return '—';
  const [y, m, d] = f.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

function fmtKm(k: number | null): string {
  if (k == null) return '—';
  return k.toLocaleString('es-PY') + ' km';
}

const C = {
  petroleo: '#123C46',
  lima: '#A3D900',
  grafito: '#30363B',
  blanco: '#FFFFFF',
  fondo: '#F4F7F6',
  borde: '#E1E8E6',
  dorado: '#D4AF37',
  doradoHover: '#B8962E',
};

export default function EtiquetaMantenimiento({ id, datos, qrDataUrl, appUrl }: Props) {
  const { vehiculo, empresa, ultimo_mantenimiento, token_publico } = datos;
  const proxFecha = fmtFecha(ultimo_mantenimiento?.proximo_mantenimiento_fecha ?? null);
  const proxKm = fmtKm(ultimo_mantenimiento?.proximo_mantenimiento_km ?? null);
  const urlPublica = appUrl && token_publico ? `${appUrl}/v/${token_publico}` : null;

  return (
    <div
      id={id ?? 'etiqueta-mantenimiento'}
      style={{
        width: 800,
        height: 1200,
        backgroundColor: C.blanco,
        color: C.grafito,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        border: `2px solid ${C.borde}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Marca de agua (Logo) - Fondo */}
      <img 
        src="/icons/icon-512.png" 
        alt="" 
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '500px', 
          opacity: 0.04, 
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />

      {/* Header */}
      <div
        style={{
          backgroundColor: C.petroleo,
          color: C.blanco,
          padding: '40px 48px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.85 }}>
          Etiqueta de mantenimiento
        </div>
        <div style={{ fontSize: 38, fontWeight: 800, marginTop: 6 }}>{empresa.nombre}</div>
        {empresa.telefono && (
          <div style={{ fontSize: 16, opacity: 0.9, marginTop: 6 }}>📞 {empresa.telefono}</div>
        )}
      </div>

      {/* Body con padding */}
      <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
        
        {/* Vehiculo */}
        <div
          style={{
            backgroundColor: C.fondo,
            borderRadius: 12,
            padding: 24,
            border: `1px solid ${C.borde}`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.petroleo, fontWeight: 700 }}>
            Vehiculo
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6, color: C.grafito }}>
            {vehiculo.marca} {vehiculo.modelo}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 20, color: C.grafito }}>
            <div>
              <span style={{ color: C.grafito, opacity: 0.7 }}>Patente:</span>{' '}
              <strong style={{ color: C.petroleo }}>{vehiculo.patente ?? '—'}</strong>
            </div>
            {vehiculo.anio && (
              <div>
                <span style={{ opacity: 0.7 }}>Año:</span> <strong>{vehiculo.anio}</strong>
              </div>
            )}
            {vehiculo.km_actual != null && (
              <div>
                <span style={{ opacity: 0.7 }}>Km:</span> <strong>{fmtKm(vehiculo.km_actual)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Ultimo mantenimiento */}
        {ultimo_mantenimiento ? (
          <div
            style={{
              backgroundColor: C.blanco,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${C.borde}`,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.petroleo, fontWeight: 700 }}>
              Último mantenimiento
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6, color: C.grafito }}>
              {fmtFecha(ultimo_mantenimiento.fecha)} — {fmtKm(ultimo_mantenimiento.km_servicio)}
            </div>
            {ultimo_mantenimiento.servicios.length > 0 && (
              <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: 18, lineHeight: 1.5, color: C.grafito }}>
                {ultimo_mantenimiento.servicios.slice(0, 6).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 20, opacity: 0.7, textAlign: 'center', padding: 24, position: 'relative', zIndex: 2 }}>
            Sin mantenimientos registrados.
          </div>
        )}

        {/* Proximo mantenimiento (destacado, dorado) */}
        <div
          style={{
            backgroundColor: C.dorado,
            color: C.petroleo,
            borderRadius: 12,
            padding: 24,
            border: `1px solid ${C.doradoHover}`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>
            Próximo mantenimiento
          </div>
          <div style={{ fontSize: 44, fontWeight: 900, marginTop: 6, lineHeight: 1.1 }}>
            {proxFecha !== '—' ? proxFecha : 'A definir'}
          </div>
          {proxKm !== '—' && (
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>a los {proxKm}</div>
          )}
        </div>

        {/* Footer: contacto + QR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 14, color: C.grafito, opacity: 0.8, maxWidth: 500 }}>
            {empresa.direccion && <div>{empresa.direccion}</div>}
            {urlPublica && <div style={{ marginTop: 4, fontSize: 12 }}>{urlPublica}</div>}
          </div>
          
          {/* El QR se inyecta desde el botón antes de capturar */}
          <div
            id="qr-container"
            style={{
              backgroundColor: C.blanco,
              padding: 8,
              borderRadius: 8,
              border: `1px solid ${C.borde}`,
              minWidth: 150,
              minHeight: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {qrDataUrl && <img src={qrDataUrl} alt="QR ficha publica" width={150} height={150} />}
          </div>
        </div>
      </div>
    </div>
  );
}