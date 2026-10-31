"use client";

import { useRouter } from "next/navigation";
import OrdenForm from "./OrdenForm";
import { crearOrden } from "@/lib/ordenes-actions";

type ServicioOpcion = { id: string; nombre: string; origen: "global" | "empresa" };
type ProductoOpcion = { id: string; nombre: string; origen: "global" | "empresa" };

type Props = {
  vehiculos: { id: string; etiqueta: string }[];
  servicioOpciones: ServicioOpcion[];
  productoOpciones: ProductoOpcion[];
  vehiculoIdInicial?: string;
};

export default function NuevaOrdenClient({ vehiculos, servicioOpciones, productoOpciones, vehiculoIdInicial }: Props) {
  const router = useRouter();

  async function onSubmit(payload: Parameters<typeof OrdenForm>[0]["onSubmit"] extends (p: infer P) => unknown ? P : never) {
    const res = await crearOrden(payload);
    if (!res.ok) {
      return { ok: false, error: res.error ?? "No se pudo crear la orden" };
    }
    if (res.data?.id) {
      router.push("/ordenes/" + res.data.id);
      return { ok: true, id: res.data.id };
    }
    return { ok: false, error: "Respuesta inesperada del servidor" };
  }

  return (
    <OrdenForm
      modo="crear"
      initialData={vehiculoIdInicial ? { vehiculo_id: vehiculoIdInicial, fecha: "", km_servicio: "0", observaciones: "", estado: "borrador", servicios: [], productos: [] } : undefined}
      vehiculos={vehiculos}
      servicioOpciones={servicioOpciones}
      productoOpciones={productoOpciones}
      onSubmit={onSubmit}
    />
  );
}