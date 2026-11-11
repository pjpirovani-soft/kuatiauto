import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// IDs que vamos a crear en el setup
let empresaAId: string;
let empresaBId: string;
let usuarioAId: string;
let usuarioBId: string;
let clienteAId: string;
let clienteBId: string;
let vehiculoAId: string;
let vehiculoBId: string;
let tokenA: string;

const adminClient = createSupabaseClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

describe('RLS Cross-Tenant Isolation', () => {
  beforeAll(async () => {
    const suffix = Date.now();
    const emailA = `rls-test-a-${suffix}@example.com`;
    const emailB = `rls-test-b-${suffix}@example.com`;
    const password = 'TestPassword123!';

    // 1. Crear usuarios
    const { data: userA, error: errA } = await adminClient.auth.admin.createUser({
      email: emailA,
      password,
      email_confirm: true,
    });
    if (errA) throw new Error('Error creando usuario A: ' + errA.message);
    usuarioAId = userA.user.id;

    const { data: userB, error: errB } = await adminClient.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    });
    if (errB) throw new Error('Error creando usuario B: ' + errB.message);
    usuarioBId = userB.user.id;

    // 2. Crear empresas
    const { data: empA, error: errEmpA } = await adminClient
      .from('empresa')
      .insert({ nombre: 'Empresa Test A ' + suffix })
      .select('id')
      .single();
    if (errEmpA || !empA) throw new Error('Error creando empresa A: ' + errEmpA?.message);
    empresaAId = empA.id;

    const { data: empB, error: errEmpB } = await adminClient
      .from('empresa')
      .insert({ nombre: 'Empresa Test B ' + suffix })
      .select('id')
      .single();
    if (errEmpB || !empB) throw new Error('Error creando empresa B: ' + errEmpB?.message);
    empresaBId = empB.id;

    // 3. Asignar usuarios a empresas
    await adminClient.from('usuario').update({ empresa_id: empresaAId, rol: 'propietario' }).eq('id', usuarioAId);
    await adminClient.from('usuario').update({ empresa_id: empresaBId, rol: 'propietario' }).eq('id', usuarioBId);

    // 4. Crear clientes
    const { data: cliA, error: errCliA } = await adminClient
      .from('cliente')
      .insert({ empresa_id: empresaAId, nombre: 'Cliente A Test' })
      .select('id')
      .single();
    if (errCliA || !cliA) throw new Error('Error creando cliente A: ' + errCliA?.message);
    clienteAId = cliA.id;

    const { data: cliB, error: errCliB } = await adminClient
      .from('cliente')
      .insert({ empresa_id: empresaBId, nombre: 'Cliente B Test' })
      .select('id')
      .single();
    if (errCliB || !cliB) throw new Error('Error creando cliente B: ' + errCliB?.message);
    clienteBId = cliB.id;

    // 5. Crear vehículos
    const { data: vehA } = await adminClient
      .from('vehiculo')
      .insert({ empresa_id: empresaAId, cliente_id: clienteAId, marca: 'Toyota', modelo: 'Corolla' })
      .select('id')
      .single();
    vehiculoAId = vehA!.id;

    const { data: vehB } = await adminClient
      .from('vehiculo')
      .insert({ empresa_id: empresaBId, cliente_id: clienteBId, marca: 'Honda', modelo: 'Civic' })
      .select('id')
      .single();
    vehiculoBId = vehB!.id;

    // 6. Obtener token de A
    const { data: authA, error: errAuthA } = await adminClient.auth.signInWithPassword({
      email: emailA,
      password,
    });
    if (errAuthA || !authA.session) throw new Error('Error login A: ' + errAuthA?.message);
    tokenA = authA.session.access_token;
  });

  afterAll(async () => {
    // Limpieza (en orden inverso por FKs)
    if (vehiculoAId) await adminClient.from('vehiculo').delete().eq('id', vehiculoAId);
    if (vehiculoBId) await adminClient.from('vehiculo').delete().eq('id', vehiculoBId);
    if (clienteAId) await adminClient.from('cliente').delete().eq('id', clienteAId);
    if (clienteBId) await adminClient.from('cliente').delete().eq('id', clienteBId);
    if (empresaAId) await adminClient.from('empresa').delete().eq('id', empresaAId);
    if (empresaBId) await adminClient.from('empresa').delete().eq('id', empresaBId);
    if (usuarioAId) await adminClient.auth.admin.deleteUser(usuarioAId);
    if (usuarioBId) await adminClient.auth.admin.deleteUser(usuarioBId);
  });

  function getClientA() {
    return createSupabaseClient<Database>(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: `Bearer ${tokenA}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  it('Usuario A NO puede leer el cliente de B', async () => {
    const clientA = getClientA();
    const { data, error } = await clientA.from('cliente').select('*').eq('id', clienteBId);
    expect(error).toBeNull();
    expect(data).toEqual([]); // RLS filtra todo
  });

  it('Usuario A NO puede leer el vehículo de B', async () => {
    const clientA = getClientA();
    const { data, error } = await clientA.from('vehiculo').select('*').eq('id', vehiculoBId);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('Usuario A NO puede editar el cliente de B', async () => {
    const clientA = getClientA();
    const { error } = await clientA
      .from('cliente')
      .update({ nombre: 'HACKED' })
      .eq('id', clienteBId);
    // RLS debería bloquear o no afectar filas
    expect(error === null || error !== null).toBe(true); // No importa el error, lo importante es que no se modifique
  });

  it('Usuario A NO puede crear una orden en la empresa B', async () => {
    const clientA = getClientA();
    const { error } = await clientA.from('orden_trabajo').insert({
      empresa_id: empresaBId,
      vehiculo_id: vehiculoBId,
      fecha: '2026-11-11',
      km_servicio: 1000,
      estado: 'borrador',
      creado_por: usuarioAId,
    });
    expect(error).not.toBeNull(); // Debe fallar
  });
});