import { describe, it, expect } from 'vitest';
import {
  crearOrdenSchema,
  editarOrdenSchema,
  anularOrdenSchema,
  listarOrdenesSchema,
  ordenIdSchema,
} from './ordenSchema';

const VEHICULO_ID = '550e8400-e29b-41d4-a716-446655440000';
const ORDEN_ID = '770e8400-e29b-41d4-a716-446655440077';
const SERVICIO_GLOBAL_ID = '880e8400-e29b-41d4-a716-446655440088';
const SERVICIO_EMPRESA_ID = '990e8400-e29b-41d4-a716-446655440099';
const PRODUCTO_GLOBAL_ID = 'aa0e8400-e29b-41d4-a716-4466554400aa';
const PRODUCTO_EMPRESA_ID = 'bb0e8400-e29b-41d4-a716-4466554400bb';

describe('crearOrdenSchema', () => {
  it('acepta input minimo (solo vehiculo + km)', () => {
    const r = crearOrdenSchema.safeParse({ vehiculo_id: VEHICULO_ID, km_servicio: 50000 });
    expect(r.success).toBe(true);
  });

  it('acepta input completo con servicios y productos', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      fecha: '2026-10-31',
      km_servicio: 50000,
      observaciones: 'Cambio de aceite y filtro',
      servicios: [{ servicio_global_id: SERVICIO_GLOBAL_ID, precio: 150000 }],
      productos: [{ producto_global_id: PRODUCTO_GLOBAL_ID, cantidad: 4, precio_unitario: 80000 }],
    });
    expect(r.success).toBe(true);
  });

  it('rechaza vehiculo_id invalido', () => {
    const r = crearOrdenSchema.safeParse({ vehiculo_id: 'no-uuid', km_servicio: 1000 });
    expect(r.success).toBe(false);
  });

  it('rechaza km_servicio negativo', () => {
    const r = crearOrdenSchema.safeParse({ vehiculo_id: VEHICULO_ID, km_servicio: -1 });
    expect(r.success).toBe(false);
  });

  it('rechaza fecha con formato invalido', () => {
    const r = crearOrdenSchema.safeParse({ vehiculo_id: VEHICULO_ID, km_servicio: 1000, fecha: '31/10/2026' });
    expect(r.success).toBe(false);
  });

  it('rechaza observaciones demasiado largas', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      observaciones: 'x'.repeat(1001),
    });
    expect(r.success).toBe(false);
  });

  it('coerciona km_servicio string a number', () => {
    const r = crearOrdenSchema.safeParse({ vehiculo_id: VEHICULO_ID, km_servicio: '50000' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.km_servicio).toBe(50000);
  });
});

describe('crearOrdenSchema — servicio linea', () => {
  it('rechaza linea sin ningun id', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      servicios: [{ precio: 100 }],
    });
    expect(r.success).toBe(false);
  });

  it('rechaza linea con ambos ids', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      servicios: [{ servicio_global_id: SERVICIO_GLOBAL_ID, servicio_empresa_id: SERVICIO_EMPRESA_ID }],
    });
    expect(r.success).toBe(false);
  });

  it('acepta linea con servicio_global_id', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      servicios: [{ servicio_global_id: SERVICIO_GLOBAL_ID }],
    });
    expect(r.success).toBe(true);
  });

  it('acepta linea con servicio_empresa_id', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      servicios: [{ servicio_empresa_id: SERVICIO_EMPRESA_ID }],
    });
    expect(r.success).toBe(true);
  });
});

describe('crearOrdenSchema — producto linea', () => {
  it('rechaza cantidad 0', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      productos: [{ producto_global_id: PRODUCTO_GLOBAL_ID, cantidad: 0 }],
    });
    expect(r.success).toBe(false);
  });

  it('rechaza cantidad negativa', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      productos: [{ producto_global_id: PRODUCTO_GLOBAL_ID, cantidad: -1 }],
    });
    expect(r.success).toBe(false);
  });

  it('acepta producto_empresa_id con cantidad positiva', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      productos: [{ producto_empresa_id: PRODUCTO_EMPRESA_ID, cantidad: 2 }],
    });
    expect(r.success).toBe(true);
  });

  it('coerciona cantidad string a number', () => {
    const r = crearOrdenSchema.safeParse({
      vehiculo_id: VEHICULO_ID,
      km_servicio: 1000,
      productos: [{ producto_global_id: PRODUCTO_GLOBAL_ID, cantidad: '3' }],
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.productos?.[0].cantidad).toBe(3);
  });
});

describe('editarOrdenSchema', () => {
  it('acepta con id y campos base', () => {
    const r = editarOrdenSchema.safeParse({ id: ORDEN_ID, vehiculo_id: VEHICULO_ID, km_servicio: 1000 });
    expect(r.success).toBe(true);
  });

  it('rechaza sin id', () => {
    const r = editarOrdenSchema.safeParse({ vehiculo_id: VEHICULO_ID, km_servicio: 1000 });
    expect(r.success).toBe(false);
  });

  it('propaga validacion de km negativo', () => {
    const r = editarOrdenSchema.safeParse({ id: ORDEN_ID, vehiculo_id: VEHICULO_ID, km_servicio: -5 });
    expect(r.success).toBe(false);
  });
});

describe('anularOrdenSchema', () => {
  it('acepta sin motivo', () => {
    const r = anularOrdenSchema.safeParse({ id: ORDEN_ID });
    expect(r.success).toBe(true);
  });

  it('acepta con motivo', () => {
    const r = anularOrdenSchema.safeParse({ id: ORDEN_ID, motivo: 'Cliente cancelo' });
    expect(r.success).toBe(true);
  });

  it('rechaza motivo demasiado largo', () => {
    const r = anularOrdenSchema.safeParse({ id: ORDEN_ID, motivo: 'x'.repeat(501) });
    expect(r.success).toBe(false);
  });
});

describe('listarOrdenesSchema', () => {
  it('acepta vacio', () => {
    const r = listarOrdenesSchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it('acepta vehiculo_id valido', () => {
    const r = listarOrdenesSchema.safeParse({ vehiculo_id: VEHICULO_ID });
    expect(r.success).toBe(true);
  });

  it('rechaza vehiculo_id invalido', () => {
    const r = listarOrdenesSchema.safeParse({ vehiculo_id: 'no-uuid' });
    expect(r.success).toBe(false);
  });
});

describe('ordenIdSchema', () => {
  it('acepta uuid valido', () => {
    const r = ordenIdSchema.safeParse({ id: ORDEN_ID });
    expect(r.success).toBe(true);
  });

  it('rechaza no-uuid', () => {
    const r = ordenIdSchema.safeParse({ id: 'no-uuid' });
    expect(r.success).toBe(false);
  });
});