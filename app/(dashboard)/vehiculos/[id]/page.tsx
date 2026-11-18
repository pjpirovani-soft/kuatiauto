import Link from 'next/link';
import { notFound } from 'next/navigation';
import VehiculoForm from '@/components/VehiculoForm';
import ProponerHistorialForm from '@/components/ProponerHistorialForm';
import { listarClientes } from '@/lib/clientes-actions';
import { createClient } from '@/lib/supabase/server';
import { obtenerDatosEtiqueta } from '@/lib/etiqueta-mantenimiento';
import EtiquetaMantenimiento from '@/components/vehiculos/EtiquetaMantenimiento';
import CompartirEtiquetaButton from '@/components/vehiculos/CompartirEtiquetaButton';

type Cliente = { id: string; nombre: string };

export default async function VehiculoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: vehiculo } = await supabase
    .from('vehiculo')
    .select('id, cliente_id, marca, modelo, anio, patente, km_actual, notas, activo')
    .eq('id', id)
    .eq('activo', true)
    .maybeSingle();

  if (!vehiculo) notFound();

  const res = await listarClientes();
  const clientes: Cliente[] = res.ok ? (res.data as Cliente[]) : [];

  // H-DIR-2: datos para etiqueta de mantenimiento (solo si hay orden completada)
  let etiquetaData = null;
  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id')
    .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .maybeSingle();
  const empresaId = usuario?.empresa_id ?? null;
  if (empresaId) {
    etiquetaData = await obtenerDatosEtiqueta(supabase, vehiculo.id, empresaId);
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/vehiculos" className="text-sm text-kuati-grafito/80 hover:text-kuati-petroleo underline">
          Volver a vehículos
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          {vehiculo.marca} {vehiculo.modelo}
        </h1>
        <div className="mt-3">
          <Link href={"/ordenes/nuevo?vehiculo_id=" + vehiculo.id} className="text-sm bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded hover:bg-kuati-petroleo/90 inline-block">
            Nueva orden para este vehículo
          </Link>
        </div>
      </header>

      <div className="bg-kuati-blanco rounded-xl border border-kuati-borde p-6">
        <VehiculoForm modo="editar" clientes={clientes} initialData={vehiculo} />
      </div>

      <div className="bg-kuati-blanco rounded-xl border border-kuati-borde p-6 mt-6">
        <ProponerHistorialForm vehiculoId={vehiculo.id} />
      </div>

      {etiquetaData && etiquetaData.ultimo_mantenimiento && (
        <div className="bg-kuati-blanco rounded-xl border border-kuati-borde p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3">Compartir etiqueta de mantenimiento</h2>
          <p className="text-sm text-kuati-grafito/80 mb-4">
            Genera una imagen con los datos del vehiculo y el proximo mantenimiento. Incluye QR a la ficha publica.
          </p>
          <CompartirEtiquetaButton
            urlPublica={
              appUrl && etiquetaData.token_publico
                ? `${appUrl}/v/${etiquetaData.token_publico}`
                : null
            }
            clienteEmail={etiquetaData.cliente?.email ?? null}
            clienteNombre={etiquetaData.cliente?.nombre ?? null}
            empresaNombre={etiquetaData.empresa.nombre}
            vehiculoDescripcion={`${etiquetaData.vehiculo.marca} ${etiquetaData.vehiculo.modelo}`}
          />
          <div style={{ display: 'none' }}>
            <EtiquetaMantenimiento id="etiqueta-mantenimiento" datos={etiquetaData} appUrl={appUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
