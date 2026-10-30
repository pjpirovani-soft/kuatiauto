import { describe, it, expect } from 'vitest';
import { clienteSchema, clienteIdSchema } from './clienteSchema';

describe('clienteSchema', () => {
  it('acepta input valido minimo', () => {
    const r = clienteSchema.safeParse({ nombre: 'Juan Perez' });
    expect(r.success).toBe(true);
  });

  it('acepta input completo', () => {
    const r = clienteSchema.safeParse({
      nombre: 'Juan Perez',
      telefono: '0981123456',
      email: 'juan@example.com',
      notas: 'Cliente recurrente',
      activo: true,
    });
    expect(r.success).toBe(true);
  });

  it('rechaza nombre corto', () => {
    const r = clienteSchema.safeParse({ nombre: 'A' });
    expect(r.success).toBe(false);
  });

  it('rechaza nombre vacio', () => {
    const r = clienteSchema.safeParse({ nombre: '' });
    expect(r.success).toBe(false);
  });

  it('rechaza nombre mayor a 120 chars', () => {
    const r = clienteSchema.safeParse({ nombre: 'a'.repeat(121) });
    expect(r.success).toBe(false);
  });

  it('rechaza email invalido', () => {
    const r = clienteSchema.safeParse({ nombre: 'Juan', email: 'no-es-email' });
    expect(r.success).toBe(false);
  });

  it('acepta email vacio (string vacio)', () => {
    const r = clienteSchema.safeParse({ nombre: 'Juan', email: '' });
    expect(r.success).toBe(true);
  });

  it('acepta telefono null', () => {
    const r = clienteSchema.safeParse({ nombre: 'Juan', telefono: null });
    expect(r.success).toBe(true);
  });

  it('rechaza telefono mayor a 30 chars', () => {
    const r = clienteSchema.safeParse({ nombre: 'Juan', telefono: '1'.repeat(31) });
    expect(r.success).toBe(false);
  });

  it('rechaza notas mayores a 500 chars', () => {
    const r = clienteSchema.safeParse({ nombre: 'Juan', notas: 'x'.repeat(501) });
    expect(r.success).toBe(false);
  });
});

describe('clienteIdSchema', () => {
  it('acepta uuid valido', () => {
    const r = clienteIdSchema.safeParse({ id: '550e8400-e29b-41d4-a716-446655440000' });
    expect(r.success).toBe(true);
  });

  it('rechaza id no uuid', () => {
    const r = clienteIdSchema.safeParse({ id: 'no-es-uuid' });
    expect(r.success).toBe(false);
  });
});
