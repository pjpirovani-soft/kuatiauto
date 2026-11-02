'use client';

import { useState } from 'react';
import type {
  ClienteRecepcion,
  VehiculoRecepcion,
  ServicioRecepcion,
  ProductoRecepcion,
} from '@/app/(dashboard)/recepcion/page';
import PasoIndicador from './PasoIndicador';
import PasoCliente from './PasoCliente';
import PasoVehiculo from './PasoVehiculo';
import PasoOrden from './PasoOrden';

export type Step = 1 | 2 | 3;

export type WizardState = {
  paso: Step;
  cliente: ClienteRecepcion | null;
  vehiculo: VehiculoRecepcion | null;
};

type Props = {
  clientes: ClienteRecepcion[];
  vehiculos: VehiculoRecepcion[];
  servicios: ServicioRecepcion[];
  productos: ProductoRecepcion[];
};

export default function RecepcionWizard({ clientes, vehiculos, servicios, productos }: Props) {
  const [state, setState] = useState<WizardState>({
    paso: 1,
    cliente: null,
    vehiculo: null,
  });

  function onClienteSeleccionado(cliente: ClienteRecepcion) {
    setState({ paso: 2, cliente, vehiculo: null });
  }

  function onVehiculoSeleccionado(vehiculo: VehiculoRecepcion) {
    setState((s) => ({ ...s, paso: 3, vehiculo }));
  }

  function volverPaso1() {
    setState({ paso: 1, cliente: null, vehiculo: null });
  }

  function volverPaso2() {
    setState((s) => ({ ...s, paso: 2, vehiculo: null }));
  }

  function resetear() {
    setState({ paso: 1, cliente: null, vehiculo: null });
  }

  return (
    <div className='space-y-6'>
      <PasoIndicador paso={state.paso} />

      {state.paso === 1 && (
        <PasoCliente
          clientes={clientes}
          onSeleccionar={onClienteSeleccionado}
        />
      )}

      {state.paso === 2 && state.cliente && (
        <PasoVehiculo
          cliente={state.cliente}
          vehiculos={vehiculos}
          onSeleccionar={onVehiculoSeleccionado}
          onVolver={volverPaso1}
        />
      )}

      {state.paso === 3 && state.cliente && state.vehiculo && (
        <PasoOrden
          cliente={state.cliente}
          vehiculo={state.vehiculo}
          servicios={servicios}
          productos={productos}
          onVolver={volverPaso2}
          onCompletado={resetear}
        />
      )}
    </div>
  );
}