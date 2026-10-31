// Líneas de servicio y producto de una orden.
// Schema real: orden_servicio { servicio_global_id XOR servicio_empresa_id, precio? }
//              orden_producto { producto_global_id XOR producto_empresa_id, cantidad, precio_unitario? }
// No hay descripcion ni cantidad en servicios. La UI respeta eso.

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
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Servicios</h3>
          <button type="button" onClick={addServicio} disabled={disabled} className="text-sm px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50">+ Agregar servicio</button>
        </div>
        {servicioOpciones.length === 0 && servicios.length > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-2">
            Catálogo de servicios vacío: el servicio se identifica por UUID. El seed del catálogo es deuda de E3.
          </p>
        )}
        <ul className="space-y-2">
          {servicios.map((s, i) => (
            <li key={s.key} className="grid grid-cols-12 gap-2 items-center border rounded p-2">
              <select
                className="col-span-7 border rounded px-2 py-1"
                value={valorActual(s.servicio_global_id, s.servicio_empresa_id)}
                disabled={disabled}
                onChange={(e) => {
                  const { globalId, empresaId } = parseValor(e.target.value);
                  updateServicio(i, { servicio_global_id: globalId, servicio_empresa_id: empresaId });
                }}
              >
                <option value="">— Servicio (UUID o catálogo) —</option>
                {servicioOpciones.map((o) => {
                  const { valor, seleccionado } = opcionesParaServicio(o, s.servicio_global_id, s.servicio_empresa_id);
                  return (
                    <option key={valor} value={valor} selected={seleccionado}>
                      {o.origen === "global" ? "[G] " : "[E] "}{o.nombre}
                    </option>
                  );
                })}
              </select>
              <input
                className="col-span-3 border rounded px-2 py-1"
                type="number" step="0.01" min="0" placeholder="Precio (opcional)"
                value={s.precio}
                disabled={disabled}
                onChange={(e) => updateServicio(i, { precio: e.target.value })}
              />
              <button type="button" onClick={() => removeServicio(i)} disabled={disabled} className="col-span-2 text-sm px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50">Quitar</button>
            </li>
          ))}
        </ul>
        {servicios.length === 0 && <p className="text-sm text-gray-500">Sin servicios cargados.</p>}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Productos</h3>
          <button type="button" onClick={addProducto} disabled={disabled} className="text-sm px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50">+ Agregar producto</button>
        </div>
        {productoOpciones.length === 0 && productos.length > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-2">
            Catálogo de productos vacío: el producto se identifica por UUID. El seed del catálogo es deuda de E3.
          </p>
        )}
        <ul className="space-y-2">
          {productos.map((p, i) => (
            <li key={p.key} className="grid grid-cols-12 gap-2 items-center border rounded p-2">
              <select
                className="col-span-5 border rounded px-2 py-1"
                value={valorActual(p.producto_global_id, p.producto_empresa_id)}
                disabled={disabled}
                onChange={(e) => {
                  const { globalId, empresaId } = parseValor(e.target.value);
                  updateProducto(i, { producto_global_id: globalId, producto_empresa_id: empresaId });
                }}
              >
                <option value="">— Producto (UUID o catálogo) —</option>
                {productoOpciones.map((o) => {
                  const { valor, seleccionado } = opcionesParaProducto(o, p.producto_global_id, p.producto_empresa_id);
                  return (
                    <option key={valor} value={valor} selected={seleccionado}>
                      {o.origen === "global" ? "[G] " : "[E] "}{o.nombre}
                    </option>
                  );
                })}
              </select>
              <input
                className="col-span-2 border rounded px-2 py-1"
                type="number" step="1" min="1" placeholder="Cant."
                value={p.cantidad}
                disabled={disabled}
                onChange={(e) => updateProducto(i, { cantidad: e.target.value })}
              />
              <input
                className="col-span-3 border rounded px-2 py-1"
                type="number" step="0.01" min="0" placeholder="P. unit. (opcional)"
                value={p.precio_unitario}
                disabled={disabled}
                onChange={(e) => updateProducto(i, { precio_unitario: e.target.value })}
              />
              <button type="button" onClick={() => removeProducto(i)} disabled={disabled} className="col-span-2 text-sm px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50">Quitar</button>
            </li>
          ))}
        </ul>
        {productos.length === 0 && <p className="text-sm text-gray-500">Sin productos cargados.</p>}
      </section>
    </div>
  );
}