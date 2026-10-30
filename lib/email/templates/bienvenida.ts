// lib/email/templates/bienvenida.ts

export type BienvenidaInput = {
  nombre: string;
  establecimientoNombre: string;
};

export function renderBienvenida(input: BienvenidaInput) {
  const subject = "Bienvenido a KuatiAuto";
  const html = `
    <p>Hola ${input.nombre},</p>
    <p>Tu establecimiento <strong>${input.establecimientoNombre}</strong> ya está dado de alta en KuatiAuto.</p>
    <p>Desde el panel podés gestionar clientes, vehículos, servicios e inventario.</p>
    <p>— KuatiAuto</p>
  `.trim();
  const text = `Hola ${input.nombre}, tu establecimiento ${input.establecimientoNombre} ya está en KuatiAuto. — KuatiAuto`;
  return { subject, html, text };
}