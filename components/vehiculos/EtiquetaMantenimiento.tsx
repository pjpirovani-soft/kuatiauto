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
        background: 'linear-gradient(160deg, #1e3a8a 0%, #2563eb 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        padding: 48,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header: empresa */}
      <div>
        <div style={{ fontSize: 14, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 2 }}>
          Etiqueta de mantenimiento
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, marginTop: 4 }}>{empresa.nombre}</div>
        {empresa.telefono && (
          <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4 }}>📞 {empresa.telefono}</div>
        )}
      </div>

      {/* Vehiculo */}
      <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 14, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 }}>Vehiculo</div>
        <div style={{ fontSize: 40, fontWeight: 700, marginTop: 4 }}>
          {vehiculo.marca} {vehiculo.modelo}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 22 }}>
          <div><span style={{ opacity: 0.8 }}>Patente:</span> <strong>{vehiculo.patente ?? '—'}</strong></div>
          {vehiculo.anio && <div><span style={{ opacity: 0.8 }}>Anio:</span> <strong>{vehiculo.anio}</strong></div>}
          {vehiculo.km_actual != null && <div><span style={{ opacity: 0.8 }}>Km:</span> <strong>{fmtKm(vehiculo.km_actual)}</strong></div>}
        </div>
      </div>

      {/* Ultimo mantenimiento */}
      {ultimo_mantenimiento ? (
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 }}>Ultimo mantenimiento</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>
            {fmtFecha(ultimo_mantenimiento.fecha)} — {fmtKm(ultimo_mantenimiento.km_servicio)}
          </div>
          {ultimo_mantenimiento.servicios.length > 0 && (
            <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: 18, lineHeight: 1.5 }}>
              {ultimo_mantenimiento.servicios.slice(0, 6).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 20, opacity: 0.7 }}>Sin mantenimientos registrados.</div>
      )}

      {/* Proximo mantenimiento (destacado) */}
      <div style={{ background: '#fbbf24', color: '#1e3a8a', borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Proximo mantenimiento</div>
        <div style={{ fontSize: 44, fontWeight: 900, marginTop: 4 }}>
          {proxFecha !== '—' ? proxFecha : 'A definir'}
        </div>
        {proxKm !== '—' && (
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>a los {proxKm}</div>
        )}
      </div>

      {/* Footer: QR + contacto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 14, opacity: 0.85, maxWidth: 500 }}>
          {empresa.direccion && <div>{empresa.direccion}</div>}
          {urlPublica && <div style={{ marginTop: 4, fontSize: 12 }}>{urlPublica}</div>}
        </div>
        {qrDataUrl && (
          <div style={{ background: '#fff', padding: 8, borderRadius: 8 }}>
            <img src={qrDataUrl} alt="QR ficha publica" width={160} height={160} />
          </div>
        )}
      </div>
    </div>
  );
}