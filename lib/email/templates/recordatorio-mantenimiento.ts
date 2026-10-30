// lib/email/templates/recordatorio-mantenimiento.ts

export type RecordatorioMantenimientoInput = {
  clienteNombre: string;
  vehiculoDescripcion: string;
  proximoMantenimiento: string;
  establecimientoNombre: string;
};

export function renderRecordatorioMantenimiento(input: RecordatorioMantenimientoInput) {
  const subject = `Recordatorio de mantenimiento — ${input.vehiculoDescripcion}`;
  const html = `
    <p>Hola ${input.clienteNombre},</p>
    <p>Tu vehículo <strong>${input.vehiculoDescripcion}</strong> tiene un mantenimiento próximo:</p>
    <p><strong>${input.proximoMantenimiento}</strong></p>
    <p>Coordiná tu turno en <strong>${input.establecimientoNombre}</strong>.</p>
    <p>— KuatiAuto</p>
  `.trim();
  const text = `Hola ${input.clienteNombre}, tu ${input.vehiculoDescripcion} tiene mantenimiento próximo: ${input.proximoMantenimiento}. Coordiná en ${input.establecimientoNombre}. — KuatiAuto`;
  return { subject, html, text };
}