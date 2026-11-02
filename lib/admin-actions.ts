'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContadoresAdmin = {
  empresas: number;
  usuarios: number;
  establecimientosPublicados: number;
  ordenes: number;
};

export type ContadoresAdminResult =
  | { ok: true; data: ContadoresAdmin }
  | { ok: false; error: string };

export type EmpresaAdminRow = {
  id: string;
  nombre: string;
  activa: boolean;
  created_at: string;
  usuarios: number;
  clientes: number;
  vehiculos: number;
  ordenes: number;
};

export type ListarEmpresasResult =
  | { ok: true; data: EmpresaAdminRow[] }
  | { ok: false; error: string };
export type EmpresaAdminDetalle = {
  id: string;
  nombre: string;
  ruc: string | null;
  telefono: string | null;
  direccion: string | null;
  activa: boolean;
  created_at: string;
  updated_at: string;
  contadores: {
    usuarios: number;
    clientes: number;
    vehiculos: number;
    ordenes: number;
    establecimientosPublicados: number;
  };
  establecimientos: Array<{
    id: string;
    nombre: string;
    ciudad: string | null;
    publicado: boolean;
  }>;
  usuarios: Array<{
    id: string;
    nombre: string | null;
    email: string | null;
    rol: string;
  }>;
};

export type ObtenerEmpresaResult =
  | { ok: true; data: EmpresaAdminDetalle }
  | { ok: false; error: string; notFound?: boolean };

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data: usuario } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();
  if (usuario?.rol !== "admin_general") return { ok: false, error: "No autorizado" };
  return { ok: true };
}

export async function obtenerContadoresAdmin(): Promise<ContadoresAdminResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();

  const [empresasRes, usuariosRes, publicadosRes, ordenesRes] = await Promise.all([
    admin.from("empresa").select("*", { count: "exact", head: true }),
    admin.from("usuario").select("*", { count: "exact", head: true }),
    admin.from("establecimiento_publico").select("*", { count: "exact", head: true }).eq("publicado", true),
    admin.from("orden_trabajo").select("*", { count: "exact", head: true }),
  ]);

  return {
    ok: true,
    data: {
      empresas: empresasRes.count ?? 0,
      usuarios: usuariosRes.count ?? 0,
      establecimientosPublicados: publicadosRes.count ?? 0,
      ordenes: ordenesRes.count ?? 0,
    },
  };
}
export async function listarEmpresasAdmin(
  filtroEstado?: "activa" | "desactivada"
): Promise<ListarEmpresasResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();

  let q = admin
    .from("empresa")
    .select("id, nombre, activa, created_at")
    .order("created_at", { ascending: false });
  if (filtroEstado === "activa") q = q.eq("activa", true);
  if (filtroEstado === "desactivada") q = q.eq("activa", false);

  const { data: empresas, error } = await q;
  if (error) return { ok: false, error: "Error al listar empresas" };
  if (!empresas || empresas.length === 0) return { ok: true, data: [] };

  const [usuariosRes, clientesRes, vehiculosRes, ordenesRes] = await Promise.all([
    admin.from("usuario").select("empresa_id"),
    admin.from("cliente").select("empresa_id"),
    admin.from("vehiculo").select("empresa_id"),
    admin.from("orden_trabajo").select("empresa_id"),
  ]);

  const countByEmpresa = (rows: Array<{ empresa_id: string | null }> | null) => {
    const map = new Map<string, number>();
    for (const r of rows ?? []) {
      if (r.empresa_id) map.set(r.empresa_id, (map.get(r.empresa_id) ?? 0) + 1);
    }
    return map;
  };

  const uMap = countByEmpresa(usuariosRes.data);
  const cMap = countByEmpresa(clientesRes.data);
  const vMap = countByEmpresa(vehiculosRes.data);
  const oMap = countByEmpresa(ordenesRes.data);

  const data: EmpresaAdminRow[] = empresas.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    activa: e.activa,
    created_at: e.created_at,
    usuarios: uMap.get(e.id) ?? 0,
    clientes: cMap.get(e.id) ?? 0,
    vehiculos: vMap.get(e.id) ?? 0,
    ordenes: oMap.get(e.id) ?? 0,
  }));

  return { ok: true, data };
}

export async function obtenerEmpresaAdmin(
  id: string
): Promise<ObtenerEmpresaResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();

  const { data: empresa, error } = await admin
    .from("empresa")
    .select("id, nombre, ruc, telefono, direccion, activa, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false, error: "Error al leer empresa" };
  if (!empresa) return { ok: false, error: "Empresa no encontrada", notFound: true };

  const [
    usuariosCountRes,
    clientesCountRes,
    vehiculosCountRes,
    ordenesCountRes,
    publicadosCountRes,
    establecimientosRes,
    usuariosRes,
  ] = await Promise.all([
    admin.from("usuario").select("*", { count: "exact", head: true }).eq("empresa_id", id),
    admin.from("cliente").select("*", { count: "exact", head: true }).eq("empresa_id", id),
    admin.from("vehiculo").select("*", { count: "exact", head: true }).eq("empresa_id", id),
    admin.from("orden_trabajo").select("*", { count: "exact", head: true }).eq("empresa_id", id),
    admin.from("establecimiento_publico").select("*", { count: "exact", head: true }).eq("empresa_id", id).eq("publicado", true),
    admin.from("establecimiento").select("id, nombre, ciudad").eq("empresa_id", id),
    admin.from("usuario").select("id, nombre, email, rol").eq("empresa_id", id).order("rol", { ascending: true }),
  ]);

  const idsEst = (establecimientosRes.data ?? []).map((e) => e.id);
  const publicadosPorEst = new Map<string, boolean>();
  if (idsEst.length > 0) {
    const { data: pubs } = await admin
      .from("establecimiento_publico")
      .select("establecimiento_id, publicado")
      .in("establecimiento_id", idsEst);
    for (const p of pubs ?? []) {
      publicadosPorEst.set(p.establecimiento_id, p.publicado);
    }
  }

  const data: EmpresaAdminDetalle = {
    ...empresa,
    contadores: {
      usuarios: usuariosCountRes.count ?? 0,
      clientes: clientesCountRes.count ?? 0,
      vehiculos: vehiculosCountRes.count ?? 0,
      ordenes: ordenesCountRes.count ?? 0,
      establecimientosPublicados: publicadosCountRes.count ?? 0,
    },
    establecimientos: (establecimientosRes.data ?? []).map((e) => ({
      id: e.id,
      nombre: e.nombre,
      ciudad: e.ciudad,
      publicado: publicadosPorEst.get(e.id) ?? false,
    })),
    usuarios: usuariosRes.data ?? [],
  };

  return { ok: true, data };
}