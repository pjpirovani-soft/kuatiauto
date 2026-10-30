import { describe, it, expect } from 'vitest';
import { clienteSchema } from './schema';

describe('clienteSchema', () => {
  it('acepta datos validos', () => {
    const result = clienteSchema.safeParse({
      nombre: 'Juan Perez',
      email: 'juan@example.com',
      telefono: '+595981123456',
      notas: 'Cliente frecuente',
    });
    expect(result.success).toBe(true);
  });

  it('acepta telefono y notas vacios', () => {
    const result = clienteSchema.safeParse({
      nombre: 'Juan Perez',
      email: 'juan@example.com',
      telefono: '',
      notas: '',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza nombre muy corto', () => {
    const result = clienteSchema.safeParse({
      nombre: 'J',
      email: 'juan@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza email invalido', () => {
    const result = clienteSchema.safeParse({
      nombre: 'Juan Perez',
      email: 'no-es-email',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza nombre faltante', () => {
    const result = clienteSchema.safeParse({
      email: 'juan@example.com',
    });
    expect(result.success).toBe(false);
  });
});
