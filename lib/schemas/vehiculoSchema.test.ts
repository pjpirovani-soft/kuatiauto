import { describe, it, expect } from 'vitest';
import { vehiculoSchema, vehiculoIdSchema } from './vehiculoSchema';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('vehiculoSchema', () => {
  it('acepta input minimo', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla' });
    expect(r.success).toBe(true);
  });

  it('acepta input completo', () => {
    const r = vehiculoSchema.safeParse({
      cliente_id: UUID,
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      patente: 'ABC123',
      km_actual: 50000,
      notas: 'Service al dia',
    });
    expect(r.success).toBe(true);
  });

  it('rechaza cliente_id invalido', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: 'no-uuid', marca: 'Toyota', modelo: 'Corolla' });
    expect(r.success).toBe(false);
  });

  it('rechaza marca vacia', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: '', modelo: 'Corolla' });
    expect(r.success).toBe(false);
  });

  it('rechaza modelo vacio', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: '' });
    expect(r.success).toBe(false);
  });

  it('rechaza anio fuera de rango', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla', anio: 1800 });
    expect(r.success).toBe(false);
  });

  it('coacciona anio string a numero', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla', anio: '2020' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.anio).toBe(2020);
  });

  it('rechaza km_actual negativo', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla', km_actual: -1 });
    expect(r.success).toBe(false);
  });

  it('km_actual es opcional: sin enviar queda undefined', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.km_actual).toBeUndefined();
  });

  it('km_actual acepta 0 explicito', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla', km_actual: 0 });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.km_actual).toBe(0);
  });

  it('rechaza patente mayor a 20 chars', () => {
    const r = vehiculoSchema.safeParse({ cliente_id: UUID, marca: 'Toyota', modelo: 'Corolla', patente: 'A'.repeat(21) });
    expect(r.success).toBe(false);
  });
});

describe('vehiculoIdSchema', () => {
  it('acepta uuid valido', () => {
    const r = vehiculoIdSchema.safeParse({ id: UUID });
    expect(r.success).toBe(true);
  });

  it('rechaza id no uuid', () => {
    const r = vehiculoIdSchema.safeParse({ id: 'no-uuid' });
    expect(r.success).toBe(false);
  });
});
