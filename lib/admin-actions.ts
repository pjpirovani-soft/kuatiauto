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
// ─── Usuarios admin ──────────────────────────────────────────────────────

export type UsuarioAdminRow = {
  id: string;
  nombre: string | null;
  email: string;
  rol: string;
  activo: boolean;
  empresa_id: string | null;
  empresa_nombre: string | null;
  created_at: string;
};

export type ListarUsuariosResult =
  | { ok: true; data: UsuarioAdminRow[] }
  | { ok: false; error: string };

export type CambiarRolResult =
  | { ok: true }
  | { ok: false; error: string };

export type DesactivarUsuarioResult =
  | { ok: true }
  | { ok: false; error: string };

const ROLES_ASIGNABLES = ["propietario", "empleado", "conductor"] as const;
export type RolAsignable = (typeof ROLES_ASIGNABLES)[number];

export async function listarUsuariosAdmin(
  filtroRol?: string
): Promise<ListarUsuariosResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();

  let q = admin
    .from("usuario")
    .select("id, nombre, email, rol, activo, empresa_id, created_at")
    .order("created_at", { ascending: false });
  if (filtroRol && filtroRol !== "todos") q = q.eq("rol", filtroRol);

  const { data: usuarios, error } = await q;
  if (error) return { ok: false, error: "Error al listar usuarios" };
  if (!usuarios || usuarios.length === 0) return { ok: true, data: [] };

  const empresaIds = Array.from(
    new Set(usuarios.map((u) => u.empresa_id).filter((x): x is string => !!x))
  );
  const empresaMap = new Map<string, string>();
  if (empresaIds.length > 0) {
    const { data: empresas } = await admin
      .from("empresa")
      .select("id, nombre")
      .in("id", empresaIds);
    for (const e of empresas ?? []) empresaMap.set(e.id, e.nombre);
  }

  const data: UsuarioAdminRow[] = usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    activo: u.activo,
    empresa_id: u.empresa_id,
    empresa_nombre: u.empresa_id ? empresaMap.get(u.empresa_id) ?? null : null,
    created_at: u.created_at,
  }));

  return { ok: true, data };
}

export async function cambiarRolUsuario(
  userId: string,
  nuevoRol: string
): Promise<CambiarRolResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  if (!ROLES_ASIGNABLES.includes(nuevoRol as RolAsignable)) {
    return { ok: false, error: "Rol no valido" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  if (user.id === userId) {
    return { ok: false, error: "No podes cambiar tu propio rol" };
  }

  const admin = createAdminClient();
  const { data: target, error: errRead } = await admin
    .from("usuario")
    .select("id, rol, empresa_id")
    .eq("id", userId)
    .maybeSingle();
  if (errRead) return { ok: false, error: "Error al leer usuario" };
  if (!target) return { ok: false, error: "Usuario no encontrado" };
  if (target.rol === "admin_general") {
    return { ok: false, error: "No se puede cambiar el rol de un admin_general desde esta UI" };
  }

  // Invariante: propietario/empleado requieren empresa_id; conductor requiere empresa_id = null.
  const requiereEmpresa = nuevoRol === "propietario" || nuevoRol === "empleado";
  if (requiereEmpresa && !target.empresa_id) {
    return {
      ok: false,
      error: "El usuario no tiene empresa asignada. Asignale una empresa antes de cambiarle el rol.",
    };
  }
  if (nuevoRol === "conductor" && target.empresa_id) {
    return {
      ok: false,
      error: "Un conductor no puede tener empresa asignada. Desvinculá la empresa antes de asignarle este rol.",
    };
  }

  const { error: errUpdate } = await admin
    .from("usuario")
    .update({ rol: nuevoRol })
    .eq("id", userId);
  if (errUpdate) return { ok: false, error: "Error al actualizar rol" };

  return { ok: true };
}

export async function desactivarUsuario(
  userId: string,
  activo: boolean
): Promise<DesactivarUsuarioResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  if (user.id === userId) {
    return { ok: false, error: "No podes desactivar tu propia cuenta" };
  }

  const admin = createAdminClient();
  const { data: target, error: errRead } = await admin
    .from("usuario")
    .select("id, rol, activo")
    .eq("id", userId)
    .maybeSingle();
  if (errRead) return { ok: false, error: "Error al leer usuario" };
  if (!target) return { ok: false, error: "Usuario no encontrado" };
  if (target.activo === activo) {
    return { ok: true };
  }

  // Si vamos a desactivar un admin_general, verificar que quede al menos uno activo.
  if (!activo && target.rol === "admin_general") {
    const { count } = await admin
      .from("usuario")
      .select("*", { count: "exact", head: true })
      .eq("rol", "admin_general")
      .eq("activo", true);
    if ((count ?? 0) <= 1) {
      return { ok: false, error: "No se puede desactivar al ultimo admin_general activo" };
    }
  }

  const { error: errUpdate } = await admin
    .from("usuario")
    .update({ activo })
    .eq("id", userId);
  if (errUpdate) return { ok: false, error: "Error al actualizar estado" };

  return { ok: true };
}
// ─── Catalogo global: servicios ──────────────────────────────────────────

export type ServicioGlobalRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  intervalo_km_sugerido: number | null;
  intervalo_meses_sugerido: number | null;
  created_at: string;
  updated_at: string;
};

export type ListarServiciosGlobalesResult =
  | { ok: true; data: ServicioGlobalRow[] }
  | { ok: false; error: string };

export type ServicioGlobalActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function listarServiciosGlobalesAdmin(): Promise<ListarServiciosGlobalesResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("servicio_global")
    .select("id, nombre, descripcion, intervalo_km_sugerido, intervalo_meses_sugerido, created_at, updated_at")
    .order("nombre", { ascending: true });

  if (error) return { ok: false, error: "Error al listar servicios" };
  return { ok: true, data: data ?? [] };
}

export async function crearServicioGlobal(input: {
  nombre: string;
  descripcion?: string;
  intervalo_km_sugerido?: number;
  intervalo_meses_sugerido?: number;
}): Promise<ServicioGlobalActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const nombre = input.nombre?.trim() ?? "";
  if (nombre.length < 2 || nombre.length > 120) {
    return { ok: false, error: "Nombre invalido (2 a 120 caracteres)" };
  }
  if (input.intervalo_km_sugerido !== undefined && input.intervalo_km_sugerido <= 0) {
    return { ok: false, error: "Intervalo en km debe ser positivo" };
  }
  if (input.intervalo_meses_sugerido !== undefined && input.intervalo_meses_sugerido <= 0) {
    return { ok: false, error: "Intervalo en meses debe ser positivo" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("servicio_global").insert({
    nombre,
    descripcion: input.descripcion?.trim() || null,
    intervalo_km_sugerido: input.intervalo_km_sugerido ?? null,
    intervalo_meses_sugerido: input.intervalo_meses_sugerido ?? null,
  });
  if (error) return { ok: false, error: "Error al crear servicio" };
  return { ok: true };
}

export async function editarServicioGlobal(input: {
  id: string;
  nombre: string;
  descripcion?: string;
  intervalo_km_sugerido?: number;
  intervalo_meses_sugerido?: number;
}): Promise<ServicioGlobalActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  if (!input.id) return { ok: false, error: "ID invalido" };
  const nombre = input.nombre?.trim() ?? "";
  if (nombre.length < 2 || nombre.length > 120) {
    return { ok: false, error: "Nombre invalido (2 a 120 caracteres)" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("servicio_global")
    .update({
      nombre,
      descripcion: input.descripcion?.trim() || null,
      intervalo_km_sugerido: input.intervalo_km_sugerido ?? null,
      intervalo_meses_sugerido: input.intervalo_meses_sugerido ?? null,
    })
    .eq("id", input.id);
  if (error) return { ok: false, error: "Error al editar servicio" };
  return { ok: true };
}

export async function eliminarServicioGlobal(id: string): Promise<ServicioGlobalActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: "ID invalido" };

  const admin = createAdminClient();
  const { error } = await admin.from("servicio_global").delete().eq("id", id);
  if (error) return { ok: false, error: "Error al eliminar servicio" };
  return { ok: true };
}

export async function obtenerServicioGlobalAdmin(id: string): Promise<
  | { ok: true; data: ServicioGlobalRow }
  | { ok: false; error: string; notFound?: boolean }
> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: "ID invalido" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("servicio_global")
    .select("id, nombre, descripcion, intervalo_km_sugerido, intervalo_meses_sugerido, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, error: "Error al leer servicio" };
  if (!data) return { ok: false, error: "Servicio no encontrado", notFound: true };
  return { ok: true, data };
}
// ─── Catalogo global: productos ──────────────────────────────────────────

export type ProductoGlobalRow = {
  id: string;
  nombre: string;
  marca: string | null;
  tipo: string | null;
  viscosidad: string | null;
  created_at: string;
  updated_at: string;
};

export type ListarProductosGlobalesResult =
  | { ok: true; data: ProductoGlobalRow[] }
  | { ok: false; error: string };

export type ProductoGlobalActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function listarProductosGlobalesAdmin(): Promise<ListarProductosGlobalesResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("producto_global")
    .select("id, nombre, marca, tipo, viscosidad, created_at, updated_at")
    .order("nombre", { ascending: true });

  if (error) return { ok: false, error: "Error al listar productos" };
  return { ok: true, data: data ?? [] };
}

export async function crearProductoGlobal(input: {
  nombre: string;
  marca?: string;
  tipo?: string;
  viscosidad?: string;
}): Promise<ProductoGlobalActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const nombre = input.nombre?.trim() ?? "";
  if (nombre.length < 2 || nombre.length > 120) {
    return { ok: false, error: "Nombre invalido (2 a 120 caracteres)" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("producto_global").insert({
    nombre,
    marca: input.marca?.trim() || null,
    tipo: input.tipo?.trim() || null,
    viscosidad: input.viscosidad?.trim() || null,
  });
  if (error) return { ok: false, error: "Error al crear producto" };
  return { ok: true };
}

export async function editarProductoGlobal(input: {
  id: string;
  nombre: string;
  marca?: string;
  tipo?: string;
  viscosidad?: string;
}): Promise<ProductoGlobalActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  if (!input.id) return { ok: false, error: "ID invalido" };
  const nombre = input.nombre?.trim() ?? "";
  if (nombre.length < 2 || nombre.length > 120) {
    return { ok: false, error: "Nombre invalido (2 a 120 caracteres)" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("producto_global")
    .update({
      nombre,
      marca: input.marca?.trim() || null,
      tipo: input.tipo?.trim() || null,
      viscosidad: input.viscosidad?.trim() || null,
    })
    .eq("id", input.id);
  if (error) return { ok: false, error: "Error al editar producto" };
  return { ok: true };
}

export async function eliminarProductoGlobal(id: string): Promise<ProductoGlobalActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: "ID invalido" };

  const admin = createAdminClient();
  const { error } = await admin.from("producto_global").delete().eq("id", id);
  if (error) return { ok: false, error: "Error al eliminar producto" };
  return { ok: true };
}

export async function obtenerProductoGlobalAdmin(id: string): Promise<
  | { ok: true; data: ProductoGlobalRow }
  | { ok: false; error: string; notFound?: boolean }
> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: "ID invalido" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("producto_global")
    .select("id, nombre, marca, tipo, viscosidad, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, error: "Error al leer producto" };
  if (!data) return { ok: false, error: "Producto no encontrado", notFound: true };
  return { ok: true, data };
}