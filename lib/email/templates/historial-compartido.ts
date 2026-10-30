// lib/email/templates/historial-compartido.ts

export type HistorialCompartidoInput = {
  conductorNombre: string;
  vehiculoDescripcion: string;
  establecimientoNombre: string;
  accion: "autorizado" | "revocado";
};

export function renderHistorialCompartido(input: HistorialCompartidoInput) {
  const subject = `Historial ${input.accion} — ${input.vehiculoDescripcion}`;
  const html = `
    <p>Hola ${input.conductorNombre},</p>
    <p>El establecimiento <strong>${input.establecimientoNombre}</strong> ha <strong>${input.accion}</strong> el acceso al historial de tu vehículo <strong>${input.vehiculoDescripcion}</strong>.</p>
    <p>— KuatiAuto</p>
  `.trim();
  const text = `Hola ${input.conductorNombre}, ${input.establecimientoNombre} ha ${input.accion} el acceso al historial de tu ${input.vehiculoDescripcion}. — KuatiAuto`;
  return { subject, html, text };
}