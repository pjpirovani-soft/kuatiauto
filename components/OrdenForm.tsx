"use client";

import { useState, useEffect } from "react";
import OrdenLineas, { type ServicioLineaUI, type ProductoLineaUI } from "./OrdenLineas";
import { IconLoader2 } from "@tabler/icons-react";

type ServicioOpcion = { id: string; nombre: string; origen: "global" | "empresa" };
type ProductoOpcion = { id: string; nombre: string; origen: "global" | "empresa" };
type EmpleadoOpcion = { id: string; nombre: string | null; email: string };

export type OrdenFormData = {
  id?: string;
  vehiculo_id: string;
  fecha: string;
  km_servicio: string;
  observaciones: string;
  estado: string;
  servicios: ServicioLineaUI[];
  productos: ProductoLineaUI[];
  proximo_mantenimiento_fecha?: string | null;
  proximo_mantenimiento_km?: string | null;
  empleado_id?: string | null;
  metodo_pago?: string | null;
};

type Props = {
  modo: "crear" | "editar";
  initialData?: OrdenFormData;
  vehiculos: { id: string; etiqueta: string }[];
  servicioOpciones: ServicioOpcion[];
  productoOpciones: ProductoOpcion[];
  empleados?: EmpleadoOpcion[];
  onSubmit: (payload: {
    id?: string;
    vehiculo_id: string;
    fecha: string;
    km_servicio: number;
    observaciones: string | null;
    servicios: { servicio_global_id: string | null; servicio_empresa_id: string | null; precio: number | null }[];
    productos: { producto_global_id: string | null; producto_empresa_id: string | null; cantidad: number; precio_unitario: number | null }[];
  }) => Promise<{ ok: boolean; error?: string; id?: string }>;
};

const inputClass = "w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito bg-kuati-blanco focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all";
const labelClass = "block text-sm font-semibold text-kuati-grafito mb-1.5";

export default function OrdenForm(props: Props) {
  const { modo, initialData, vehiculos, servicioOpciones, productoOpciones, onSubmit } = props;

  const [vehiculoId, setVehiculoId] = useState(initialData?.vehiculo_id ?? "");
  const [fecha, setFecha] = useState(initialData?.fecha ?? new Date().toISOString().slice(0, 10));
  const [kmServicio, setKmServicio] = useState(initialData?.km_servicio ?? "0");
  const [observaciones, setObservaciones] = useState(initialData?.observaciones ?? "");
  const [servicios, setServicios] = useState<ServicioLineaUI[]>(initialData?.servicios ?? []);
  const [productos, setProductos] = useState<ProductoLineaUI[]>(initialData?.productos ?? []);
  const [proximoFecha, setProximoFecha] = useState(initialData?.proximo_mantenimiento_fecha ?? "");
  const [proximoKm, setProximoKm] = useState(initialData?.proximo_mantenimiento_km?.toString() ?? "");
  
  // Banderas para saber si el usuario tocó los campos a mano
  const [fechaTocada, setFechaTocada] = useState(false);
  const [kmTocado, setKmTocado] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(initialData?.empleado_id ?? '');
  const [metodoPago, setMetodoPago] = useState(initialData?.metodo_pago ?? '');

  // Autocompletado de mantenimiento basado en el último servicio agregado
  useEffect(() => {
    if (initialData?.proximo_mantenimiento_fecha || initialData?.proximo_mantenimiento_km) return;
    if (servicios.length === 0) return;

    const ultimoServicio = servicios[servicios.length - 1];
    if (!ultimoServicio.servicio_global_id) return;

    const opcion = servicioOpciones.find((s) => s.id === ultimoServicio.servicio_global_id) as any;
    if (!opcion) return;

    const intervaloKm = opcion.intervalo_km_sugerido;
    const intervaloMeses = opcion.intervalo_meses_sugerido;

    // Solo autocompletar si el usuario NO tocó el campo manualmente
    if (intervaloKm && !kmTocado) {
      const nuevoKm = Number(kmServicio) + Number(intervaloKm);
      setProximoKm(String(nuevoKm));
    }

    if (intervaloMeses && !fechaTocada) {
      const base = new Date(fecha + 'T00:00:00Z');
      base.setUTCMonth(base.getUTCMonth() + Number(intervaloMeses));
      const nuevaFecha = base.toISOString().slice(0, 10);
      setProximoFecha(nuevaFecha);
    }
  }, [servicios, servicioOpciones, kmServicio, fecha, initialData, kmTocado, fechaTocada]);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const editable = modo === "crear" || (initialData?.estado === "borrador" || initialData?.estado === "en_curso");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const serviciosLimpios = servicios
        .filter((s) => s.servicio_global_id || s.servicio_empresa_id)
        .map((s) => ({
          servicio_global_id: s.servicio_global_id,
          servicio_empresa_id: s.servicio_empresa_id,
          precio: s.precio === "" ? null : Number(s.precio),
        }));
      const productosLimpios = productos
        .filter((p) => p.producto_global_id || p.producto_empresa_id)
        .map((p) => ({
          producto_global_id: p.producto_global_id,
          producto_empresa_id: p.producto_empresa_id,
          cantidad: Number(p.cantidad || "1"),
          precio_unitario: p.precio_unitario === "" ? null : Number(p.precio_unitario),
        }));
      const payload = {
        id: initialData?.id,
        vehiculo_id: vehiculoId,
        fecha,
        km_servicio: Number(kmServicio),
        observaciones: observaciones.trim() === "" ? null : observaciones,
        servicios: serviciosLimpios,
        productos: productosLimpios,
        proximo_mantenimiento_fecha: proximoFecha || null,
        proximo_mantenimiento_km: proximoKm ? Number(proximoKm) : null,
        empleado_id: empleadoId || null,
        metodo_pago: metodoPago || null,
      };
      const res = await onSubmit(payload);
      if (!res.ok) setError(res.error ?? "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-4xl'>
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
        <h2 className='text-xl font-bold text-kuati-petroleo mb-4'>Datos de la orden</h2>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Vehículo *</label>
            <select
              className={inputClass}
              value={vehiculoId}
              onChange={(e) => setVehiculoId(e.target.value)}
              disabled={!editable}
              required
            >
              <option value=''>— Seleccionar —</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>{v.etiqueta}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={labelClass}>Fecha *</label>
            <input
              type='date'
              className={inputClass}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={!editable}
              required
            />
          </div>
          
          <div>
            <label className={labelClass}>Km al ingreso *</label>
            <input
              type='number'
              min='0'
              step='1'
              className={inputClass}
              value={kmServicio}
              onChange={(e) => setKmServicio(e.target.value)}
              disabled={!editable}
              required
            />
          </div>
          
          <div>
            <label className={labelClass}>Mecánico asignado</label>
            <select
              className={inputClass}
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
              disabled={!editable}
            >
              <option value=''>— Sin asignar —</option>
              {(props.empleados ?? []).map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre ?? emp.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={labelClass}>Método de pago</label>
            <select
              className={inputClass}
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              disabled={!editable}
            >
              <option value=''>— Sin especificar —</option>
              <option value='efectivo'>Efectivo</option>
              <option value='tarjeta'>Tarjeta</option>
              <option value='transferencia'>Transferencia</option>
              <option value='cuenta_corriente'>Cuenta corriente</option>
              <option value='otro'>Otro</option>
            </select>
          </div>
          
          <div className='sm:col-span-2'>
            <label className={labelClass}>Observaciones</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              disabled={!editable}
              maxLength={1000}
              placeholder='Detalles o notas de la orden...'
            />
          </div>
        </div>
      </div>

      {/* Sección Próximo Mantenimiento */}
      <div className='bg-kuati-fondo rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
        <div className='flex items-center gap-2 mb-4'>
          <h2 className='text-xl font-bold text-kuati-petroleo'>Próximo mantenimiento</h2>
          <span className='text-xs font-semibold text-kuati-petroleo/60 bg-kuati-petroleo/10 px-2 py-1 rounded'>Sugerido</span>
        </div>
        <p className='text-sm text-kuati-grafito/60 mb-4'>Se completa automáticamente al agregar un servicio. Podés modificarlo si el cliente lo pide.</p>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Fecha</label>
            <input
              type='date'
              className={inputClass}
              value={proximoFecha}
              onChange={(e) => {
                setProximoFecha(e.target.value);
                setFechaTocada(true);
              }}
              disabled={!editable}
            />
          </div>
          
          <div>
            <label className={labelClass}>Kilometraje</label>
            <input
              type='number'
              min='0'
              step='1'
              className={inputClass}
              value={proximoKm}
              onChange={(e) => {
                setProximoKm(e.target.value);
                setKmTocado(true);
              }}
              disabled={!editable}
              placeholder='Ej. 15000'
            />
          </div>
        </div>
      </div>

      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
        <h2 className='text-xl font-bold text-kuati-petroleo mb-4'>Servicios y productos</h2>
        <OrdenLineas
          servicios={servicios}
          productos={productos}
          servicioOpciones={servicioOpciones}
          productoOpciones={productoOpciones}
          onChange={(next) => { setServicios(next.servicios); setProductos(next.productos); }}
          disabled={!editable}
        />
      </div>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>{error}</div>
      )}

      {editable && (
        <div className='flex flex-col sm:flex-row items-center gap-3'>
          <button
            type='submit'
            disabled={enviando}
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
          >
            {enviando && <IconLoader2 size={18} className='animate-spin' />}
            {enviando ? "Guardando..." : (modo === "crear" ? "Crear orden" : "Guardar cambios")}
          </button>
        </div>
      )}
      
      {!editable && (
        <p className='text-sm text-kuati-grafito/60 bg-kuati-fondo p-4 rounded-lg border border-kuati-borde'>
          Esta orden está {initialData?.estado} y no se puede editar. Usá las acciones de la página.
        </p>
      )}
    </form>
  );
}
