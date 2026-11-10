// Líneas de servicio y producto de una orden.

type ServicioOpcion = { id: string; nombre: string; origen: "global" | "empresa" };
type ProductoOpcion = { id: string; nombre: string; origen: "global" | "empresa" };

export type ServicioLineaUI = {
  key: string;
  servicio_global_id: string | null;
  servicio_empresa_id: string | null;
  precio: string;
};

export type ProductoLineaUI = {
  key: string;
  producto_global_id: string | null;
  producto_empresa_id: string | null;
  cantidad: string;
  precio_unitario: string;
};

type Props = {
  servicios: ServicioLineaUI[];
  productos: ProductoLineaUI[];
  servicioOpciones: ServicioOpcion[];
  productoOpciones: ProductoOpcion[];
  onChange: (next: { servicios: ServicioLineaUI[]; productos: ProductoLineaUI[] }) => void;
  disabled?: boolean;
};

const inputClass = "w-full border border-kuati-borde rounded-lg px-4 py-2 text-kuati-grafito bg-kuati-blanco focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all text-sm disabled:opacity-60";

function nuevaKey(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function opcionesParaServicio(o: ServicioOpcion, actualGlobal: string | null, actualEmpresa: string | null) {
  return {
    valor: o.origen === "global" ? `g:${o.id}` : `e:${o.id}`,
    seleccionado:
      (o.origen === "global" && actualGlobal === o.id) ||
      (o.origen === "empresa" && actualEmpresa === o.id),
  };
}

function opcionesParaProducto(o: ProductoOpcion, actualGlobal: string | null, actualEmpresa: string | null) {
  return {
    valor: o.origen === "global" ? `g:${o.id}` : `e:${o.id}`,
    seleccionado:
      (o.origen === "global" && actualGlobal === o.id) ||
      (o.origen === "empresa" && actualEmpresa === o.id),
  };
}

function parseValor(v: string): { globalId: string | null; empresaId: string | null } {
  if (!v) return { globalId: null, empresaId: null };
  if (v.startsWith("g:")) return { globalId: v.slice(2), empresaId: null };
  if (v.startsWith("e:")) return { globalId: null, empresaId: v.slice(2) };
  return { globalId: null, empresaId: null };
}

function valorActual(globalId: string | null, empresaId: string | null): string {
  if (globalId) return `g:${globalId}`;
  if (empresaId) return `e:${empresaId}`;
  return "";
}

export default function OrdenLineas(props: Props) {
  const { servicios, productos, servicioOpciones, productoOpciones, onChange, disabled } = props;

  function updateServicio(i: number, patch: Partial<ServicioLineaUI>) {
    const next = servicios.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange({ servicios: next, productos });
  }
  function removeServicio(i: number) {
    const next = servicios.filter((_, idx) => idx !== i);
    onChange({ servicios: next, productos });
  }
  function addServicio() {
    const next = [...servicios, { key: nuevaKey(), servicio_global_id: null, servicio_empresa_id: null, precio: "" }];
    onChange({ servicios: next, productos });
  }
  function updateProducto(i: number, patch: Partial<ProductoLineaUI>) {
    const next = productos.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    onChange({ servicios, productos: next });
  }
  function removeProducto(i: number) {
    const next = productos.filter((_, idx) => idx !== i);
    onChange({ servicios, productos: next });
  }
  function addProducto() {
    const next = [...productos, { key: nuevaKey(), producto_global_id: null, producto_empresa_id: null, cantidad: "1", precio_unitario: "" }];
    onChange({ servicios, productos: next });
  }

  return (
    <div className='space-y-8'>
      {/* SERVICIOS */}
      <section>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-bold text-kuati-petroleo'>Servicios</h3>
          <button 
            type='button' 
            onClick={addServicio} 
            disabled={disabled} 
            className='text-sm px-3 py-1.5 rounded-lg bg-kuati-petroleo/10 text-kuati-petroleo font-semibold hover:bg-kuati-petroleo/20 disabled:opacity-50 transition-colors'
          >
            + Agregar servicio
          </button>
        </div>
        
        {servicioOpciones.length === 0 && servicios.length > 0 && (
          <p className='text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3'>
            Catálogo de servicios vacío: el servicio se identifica por UUID. El seed del catálogo es deuda de E3.
          </p>
        )}
        
        <ul className='space-y-3'>
          {servicios.map((s, i) => (
            <li key={s.key} className='flex flex-col md:flex-row gap-3 items-start md:items-center bg-kuati-fondo p-3 rounded-lg border border-kuati-borde'>
              <div className='w-full md:flex-1'>
                <select
                  className={inputClass}
                  value={valorActual(s.servicio_global_id, s.servicio_empresa_id)}
                  disabled={disabled}
                  onChange={(e) => {
                    const { globalId, empresaId } = parseValor(e.target.value);
                    updateServicio(i, { servicio_global_id: globalId, servicio_empresa_id: empresaId });
                  }}
                >
                  <option value='' disabled hidden>— Seleccionar servicio —</option>
                  {servicioOpciones.map((o) => {
                    const valor = valorActual(o.origen === "global" ? o.id : null, o.origen === "empresa" ? o.id : null);
                    return (
                      <option key={valor} value={valor}>
                        {o.origen === "global" ? "[G] " : "[E] "}{o.nombre}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='w-full md:w-32'>
                <input
                  className={inputClass}
                  type='number' step='0.01' min='0' placeholder='Precio'
                  value={s.precio}
                  disabled={disabled}
                  onChange={(e) => updateServicio(i, { precio: e.target.value })}
                />
              </div>
              <button 
                type='button' 
                onClick={() => removeServicio(i)} 
                disabled={disabled} 
                className='w-full md:w-auto text-sm px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors'
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
        {servicios.length === 0 && <p className='text-sm text-kuati-grafito/50 mt-2'>Sin servicios cargados.</p>}
      </section>

      {/* PRODUCTOS */}
      <section>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-bold text-kuati-petroleo'>Productos</h3>
          <button 
            type='button' 
            onClick={addProducto} 
            disabled={disabled} 
            className='text-sm px-3 py-1.5 rounded-lg bg-kuati-petroleo/10 text-kuati-petroleo font-semibold hover:bg-kuati-petroleo/20 disabled:opacity-50 transition-colors'
          >
            + Agregar producto
          </button>
        </div>
        
        {productoOpciones.length === 0 && productos.length > 0 && (
          <p className='text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3'>
            Catálogo de productos vacío: el producto se identifica por UUID. El seed del catálogo es deuda de E3.
          </p>
        )}
        
        <ul className='space-y-3'>
          {productos.map((p, i) => (
            <li key={p.key} className='flex flex-col md:flex-row gap-3 items-start md:items-center bg-kuati-fondo p-3 rounded-lg border border-kuati-borde'>
              <div className='w-full md:flex-1'>
                <select
                  className={inputClass}
                  value={valorActual(p.producto_global_id, p.producto_empresa_id)}
                  disabled={disabled}
                  onChange={(e) => {
                    const { globalId, empresaId } = parseValor(e.target.value);
                    updateProducto(i, { producto_global_id: globalId, producto_empresa_id: empresaId });
                  }}
                >
                  <option value='' disabled hidden>— Seleccionar producto —</option>
                  {productoOpciones.map((o) => {
                    const valor = valorActual(o.origen === "global" ? o.id : null, o.origen === "empresa" ? o.id : null);
                    return (
                      <option key={valor} value={valor}>
                        {o.origen === "global" ? "[G] " : "[E] "}{o.nombre}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='w-full md:w-24'>
                <input
                  className={inputClass}
                  type='number' step='1' min='1' placeholder='Cant.'
                  value={p.cantidad}
                  disabled={disabled}
                  onChange={(e) => updateProducto(i, { cantidad: e.target.value })}
                />
              </div>
              <div className='w-full md:w-32'>
                <input
                  className={inputClass}
                  type='number' step='0.01' min='0' placeholder='P. unit.'
                  value={p.precio_unitario}
                  disabled={disabled}
                  onChange={(e) => updateProducto(i, { precio_unitario: e.target.value })}
                />
              </div>
              <button 
                type='button' 
                onClick={() => removeProducto(i)} 
                disabled={disabled} 
                className='w-full md:w-auto text-sm px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors'
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
        {productos.length === 0 && <p className='text-sm text-kuati-grafito/50 mt-2'>Sin productos cargados.</p>}
      </section>
    </div>
  );
}
