export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          accion: string
          created_at: string
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          empresa_id: string | null
          entidad: string | null
          entidad_id: string | null
          id: string
          ip: unknown
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          empresa_id?: string | null
          entidad?: string | null
          entidad_id?: string | null
          id?: string
          ip?: unknown
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          empresa_id?: string | null
          entidad?: string | null
          entidad_id?: string | null
          id?: string
          ip?: unknown
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      cliente: {
        Row: {
          activo: boolean
          created_at: string
          email: string | null
          empresa_id: string
          id: string
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          email?: string | null
          empresa_id: string
          id?: string
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          email?: string | null
          empresa_id?: string
          id?: string
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliente_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      conductor: {
        Row: {
          created_at: string
          email: string
          id: string
          nombre: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      empresa: {
        Row: {
          activa: boolean
          created_at: string
          direccion: string | null
          id: string
          nombre: string
          ruc: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activa?: boolean
          created_at?: string
          direccion?: string | null
          id?: string
          nombre: string
          ruc?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activa?: boolean
          created_at?: string
          direccion?: string | null
          id?: string
          nombre?: string
          ruc?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      especificacion_lubricante: {
        Row: {
          aprobacion_fabricante: string | null
          capacidad_litros: number | null
          clasificacion_acea: string | null
          clasificacion_api: string | null
          created_at: string
          estado_validacion: string
          fecha_consulta: string | null
          fuente: string | null
          id: string
          intervalo_km_normal: number | null
          intervalo_km_severo: number | null
          intervalo_meses_normal: number | null
          intervalo_meses_severo: number | null
          motorizacion_id: string
          updated_at: string
          verificado_por: string | null
          viscosidad_sae: string | null
        }
        Insert: {
          aprobacion_fabricante?: string | null
          capacidad_litros?: number | null
          clasificacion_acea?: string | null
          clasificacion_api?: string | null
          created_at?: string
          estado_validacion?: string
          fecha_consulta?: string | null
          fuente?: string | null
          id?: string
          intervalo_km_normal?: number | null
          intervalo_km_severo?: number | null
          intervalo_meses_normal?: number | null
          intervalo_meses_severo?: number | null
          motorizacion_id: string
          updated_at?: string
          verificado_por?: string | null
          viscosidad_sae?: string | null
        }
        Update: {
          aprobacion_fabricante?: string | null
          capacidad_litros?: number | null
          clasificacion_acea?: string | null
          clasificacion_api?: string | null
          created_at?: string
          estado_validacion?: string
          fecha_consulta?: string | null
          fuente?: string | null
          id?: string
          intervalo_km_normal?: number | null
          intervalo_km_severo?: number | null
          intervalo_meses_normal?: number | null
          intervalo_meses_severo?: number | null
          motorizacion_id?: string
          updated_at?: string
          verificado_por?: string | null
          viscosidad_sae?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "especificacion_lubricante_motorizacion_id_fkey"
            columns: ["motorizacion_id"]
            isOneToOne: false
            referencedRelation: "motorizacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "especificacion_lubricante_verificado_por_fkey"
            columns: ["verificado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      establecimiento: {
        Row: {
          created_at: string
          direccion: string | null
          empresa_id: string
          horarios: Json | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          direccion?: string | null
          empresa_id: string
          horarios?: Json | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          direccion?: string | null
          empresa_id?: string
          horarios?: Json | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "establecimiento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      establecimiento_publico: {
        Row: {
          barrio: string | null
          ciudad: string | null
          created_at: string
          departamento: string | null
          descripcion: string | null
          direccion_aproximada: string | null
          empresa_id: string
          establecimiento_id: string
          horarios: Json | null
          id: string
          lat_aproximada: number | null
          lng_aproximada: number | null
          nombre: string
          publicado: boolean
          servicios_ofrecidos: Json | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          barrio?: string | null
          ciudad?: string | null
          created_at?: string
          departamento?: string | null
          descripcion?: string | null
          direccion_aproximada?: string | null
          empresa_id: string
          establecimiento_id: string
          horarios?: Json | null
          id?: string
          lat_aproximada?: number | null
          lng_aproximada?: number | null
          nombre: string
          publicado?: boolean
          servicios_ofrecidos?: Json | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          barrio?: string | null
          ciudad?: string | null
          created_at?: string
          departamento?: string | null
          descripcion?: string | null
          direccion_aproximada?: string | null
          empresa_id?: string
          establecimiento_id?: string
          horarios?: Json | null
          id?: string
          lat_aproximada?: number | null
          lng_aproximada?: number | null
          nombre?: string
          publicado?: boolean
          servicios_ofrecidos?: Json | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "establecimiento_publico_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establecimiento_publico_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: true
            referencedRelation: "establecimiento"
            referencedColumns: ["id"]
          },
        ]
      }
      fabricante: {
        Row: {
          created_at: string
          id: string
          nombre: string
          pais_origen: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          pais_origen?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          pais_origen?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      historial_compartido: {
        Row: {
          autorizado: boolean
          conductor_id: string
          created_at: string
          empresa_id: string
          id: string
          token_propuesta: string | null
          updated_at: string
          vehiculo_conductor_id: string | null
          vehiculo_empresa_id: string | null
        }
        Insert: {
          autorizado?: boolean
          conductor_id: string
          created_at?: string
          empresa_id: string
          id?: string
          token_propuesta?: string | null
          updated_at?: string
          vehiculo_conductor_id?: string | null
          vehiculo_empresa_id?: string | null
        }
        Update: {
          autorizado?: boolean
          conductor_id?: string
          created_at?: string
          empresa_id?: string
          id?: string
          token_propuesta?: string | null
          updated_at?: string
          vehiculo_conductor_id?: string | null
          vehiculo_empresa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historial_compartido_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historial_compartido_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historial_compartido_vehiculo_conductor_id_fkey"
            columns: ["vehiculo_conductor_id"]
            isOneToOne: false
            referencedRelation: "vehiculo_conductor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historial_compartido_vehiculo_empresa_id_fkey"
            columns: ["vehiculo_empresa_id"]
            isOneToOne: false
            referencedRelation: "vehiculo"
            referencedColumns: ["id"]
          },
        ]
      }
      marca: {
        Row: {
          created_at: string
          fabricante_id: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fabricante_id: string
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fabricante_id?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marca_fabricante_id_fkey"
            columns: ["fabricante_id"]
            isOneToOne: false
            referencedRelation: "fabricante"
            referencedColumns: ["id"]
          },
        ]
      }
      modelo: {
        Row: {
          anio_desde: number | null
          anio_hasta: number | null
          created_at: string
          id: string
          marca_id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          anio_desde?: number | null
          anio_hasta?: number | null
          created_at?: string
          id?: string
          marca_id: string
          nombre: string
          updated_at?: string
        }
        Update: {
          anio_desde?: number | null
          anio_hasta?: number | null
          created_at?: string
          id?: string
          marca_id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modelo_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marca"
            referencedColumns: ["id"]
          },
        ]
      }
      motorizacion: {
        Row: {
          cilindrada_cc: number | null
          combustible: string | null
          created_at: string
          id: string
          potencia_hp: number | null
          updated_at: string
          version_id: string
        }
        Insert: {
          cilindrada_cc?: number | null
          combustible?: string | null
          created_at?: string
          id?: string
          potencia_hp?: number | null
          updated_at?: string
          version_id: string
        }
        Update: {
          cilindrada_cc?: number | null
          combustible?: string | null
          created_at?: string
          id?: string
          potencia_hp?: number | null
          updated_at?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "motorizacion_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "version"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacion_log: {
        Row: {
          created_at: string
          destinatario_email: string
          empresa_id: string
          enviado_at: string | null
          estado: string
          evento_ref: string | null
          id: string
          idempotency_key: string
          intentos: number
          tipo: string
          ultimo_error: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          destinatario_email: string
          empresa_id: string
          enviado_at?: string | null
          estado?: string
          evento_ref?: string | null
          id?: string
          idempotency_key: string
          intentos?: number
          tipo: string
          ultimo_error?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          destinatario_email?: string
          empresa_id?: string
          enviado_at?: string | null
          estado?: string
          evento_ref?: string | null
          id?: string
          idempotency_key?: string
          intentos?: number
          tipo?: string
          ultimo_error?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacion_log_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      orden_producto: {
        Row: {
          cantidad: number
          created_at: string
          id: string
          orden_id: string
          precio_unitario: number | null
          producto_empresa_id: string | null
          producto_global_id: string | null
        }
        Insert: {
          cantidad?: number
          created_at?: string
          id?: string
          orden_id: string
          precio_unitario?: number | null
          producto_empresa_id?: string | null
          producto_global_id?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string
          id?: string
          orden_id?: string
          precio_unitario?: number | null
          producto_empresa_id?: string | null
          producto_global_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orden_producto_empresa"
            columns: ["producto_empresa_id"]
            isOneToOne: false
            referencedRelation: "producto_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_orden_producto_global"
            columns: ["producto_global_id"]
            isOneToOne: false
            referencedRelation: "producto_global"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_producto_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "orden_trabajo"
            referencedColumns: ["id"]
          },
        ]
      }
      orden_servicio: {
        Row: {
          created_at: string
          id: string
          orden_id: string
          precio: number | null
          servicio_empresa_id: string | null
          servicio_global_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          orden_id: string
          precio?: number | null
          servicio_empresa_id?: string | null
          servicio_global_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          orden_id?: string
          precio?: number | null
          servicio_empresa_id?: string | null
          servicio_global_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orden_servicio_empresa"
            columns: ["servicio_empresa_id"]
            isOneToOne: false
            referencedRelation: "servicio_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_orden_servicio_global"
            columns: ["servicio_global_id"]
            isOneToOne: false
            referencedRelation: "servicio_global"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_servicio_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "orden_trabajo"
            referencedColumns: ["id"]
          },
        ]
      }
      orden_trabajo: {
        Row: {
          creado_por: string | null
          created_at: string
          empresa_id: string
          estado: string
          fecha: string
          id: string
          importe_total: number | null
          km_servicio: number
          observaciones: string | null
          proximo_mantenimiento_fecha: string | null
          proximo_mantenimiento_km: number | null
          updated_at: string
          vehiculo_id: string
        }
        Insert: {
          creado_por?: string | null
          created_at?: string
          empresa_id: string
          estado?: string
          fecha?: string
          id?: string
          importe_total?: number | null
          km_servicio: number
          observaciones?: string | null
          proximo_mantenimiento_fecha?: string | null
          proximo_mantenimiento_km?: number | null
          updated_at?: string
          vehiculo_id: string
        }
        Update: {
          creado_por?: string | null
          created_at?: string
          empresa_id?: string
          estado?: string
          fecha?: string
          id?: string
          importe_total?: number | null
          km_servicio?: number
          observaciones?: string | null
          proximo_mantenimiento_fecha?: string | null
          proximo_mantenimiento_km?: number | null
          updated_at?: string
          vehiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orden_trabajo_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_trabajo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_trabajo_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculo"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_empresa: {
        Row: {
          activo: boolean
          created_at: string
          empresa_id: string
          id: string
          marca: string | null
          nombre: string
          stock_actual: number
          stock_minimo: number
          tipo: string | null
          unidad: string
          updated_at: string
          viscosidad: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          empresa_id: string
          id?: string
          marca?: string | null
          nombre: string
          stock_actual?: number
          stock_minimo?: number
          tipo?: string | null
          unidad?: string
          updated_at?: string
          viscosidad?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          empresa_id?: string
          id?: string
          marca?: string | null
          nombre?: string
          stock_actual?: number
          stock_minimo?: number
          tipo?: string | null
          unidad?: string
          updated_at?: string
          viscosidad?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producto_empresa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_global: {
        Row: {
          created_at: string
          id: string
          marca: string | null
          nombre: string
          tipo: string | null
          updated_at: string
          viscosidad: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          marca?: string | null
          nombre: string
          tipo?: string | null
          updated_at?: string
          viscosidad?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          marca?: string | null
          nombre?: string
          tipo?: string | null
          updated_at?: string
          viscosidad?: string | null
        }
        Relationships: []
      }
      rate_limit: {
        Row: {
          clave: string
          contador: number
          created_at: string
          id: string
          ventana_inicio: string
        }
        Insert: {
          clave: string
          contador?: number
          created_at?: string
          id?: string
          ventana_inicio?: string
        }
        Update: {
          clave?: string
          contador?: number
          created_at?: string
          id?: string
          ventana_inicio?: string
        }
        Relationships: []
      }
      servicio_empresa: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          empresa_id: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          empresa_id: string
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          empresa_id?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicio_empresa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      servicio_global: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          intervalo_km_sugerido: number | null
          intervalo_meses_sugerido: number | null
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          intervalo_km_sugerido?: number | null
          intervalo_meses_sugerido?: number | null
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          intervalo_km_sugerido?: number | null
          intervalo_meses_sugerido?: number | null
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_movimiento: {
        Row: {
          cantidad: number
          creado_por: string | null
          created_at: string
          empresa_id: string
          id: string
          motivo: string | null
          orden_id: string | null
          producto_empresa_id: string
          tipo: string
        }
        Insert: {
          cantidad: number
          creado_por?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          motivo?: string | null
          orden_id?: string | null
          producto_empresa_id: string
          tipo: string
        }
        Update: {
          cantidad?: number
          creado_por?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          motivo?: string | null
          orden_id?: string | null
          producto_empresa_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movimiento_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movimiento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movimiento_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "orden_trabajo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movimiento_producto_empresa_id_fkey"
            columns: ["producto_empresa_id"]
            isOneToOne: false
            referencedRelation: "producto_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario: {
        Row: {
          activo: boolean
          created_at: string
          email: string
          empresa_id: string | null
          id: string
          nombre: string | null
          rol: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          email: string
          empresa_id?: string | null
          id: string
          nombre?: string | null
          rol?: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          email?: string
          empresa_id?: string | null
          id?: string
          nombre?: string | null
          rol?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculo: {
        Row: {
          activo: boolean
          anio: number | null
          cliente_id: string
          created_at: string
          empresa_id: string
          id: string
          km_actual: number
          marca: string
          modelo: string
          notas: string | null
          patente: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          anio?: number | null
          cliente_id: string
          created_at?: string
          empresa_id: string
          id?: string
          km_actual?: number
          marca: string
          modelo: string
          notas?: string | null
          patente?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          anio?: number | null
          cliente_id?: string
          created_at?: string
          empresa_id?: string
          id?: string
          km_actual?: number
          marca?: string
          modelo?: string
          notas?: string | null
          patente?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehiculo_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehiculo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculo_conductor: {
        Row: {
          anio: number | null
          conductor_id: string
          created_at: string
          id: string
          km_actual: number
          marca: string
          modelo: string
          patente: string | null
          updated_at: string
        }
        Insert: {
          anio?: number | null
          conductor_id: string
          created_at?: string
          id?: string
          km_actual?: number
          marca: string
          modelo: string
          patente?: string | null
          updated_at?: string
        }
        Update: {
          anio?: number | null
          conductor_id?: string
          created_at?: string
          id?: string
          km_actual?: number
          marca?: string
          modelo?: string
          patente?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehiculo_conductor_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductor"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculo_identidad: {
        Row: {
          created_at: string
          id: string
          patente_normalizada: string | null
          vehiculo_id: string
          vin: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          patente_normalizada?: string | null
          vehiculo_id: string
          vin?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          patente_normalizada?: string | null
          vehiculo_id?: string
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehiculo_identidad_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculo"
            referencedColumns: ["id"]
          },
        ]
      }
      version: {
        Row: {
          anio: number | null
          created_at: string
          id: string
          modelo_id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          anio?: number | null
          created_at?: string
          id?: string
          modelo_id: string
          nombre: string
          updated_at?: string
        }
        Update: {
          anio?: number | null
          created_at?: string
          id?: string
          modelo_id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "version_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "modelo"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aceptar_historial_compartido: {
        Args: { p_token: string }
        Returns: undefined
      }
      buscar_establecimientos: {
        Args: {
          p_ciudad?: string
          p_lat: number
          p_lng: number
          p_radio_km?: number
          p_servicio?: string
          p_texto?: string
        }
        Returns: {
          barrio: string
          ciudad: string
          departamento: string
          descripcion: string
          direccion_aproximada: string
          distancia_km: number
          horarios: Json
          id: string
          lat_aproximada: number
          lng_aproximada: number
          nombre: string
          servicios_ofrecidos: Json
          telefono: string
        }[]
      }
      check_rate_limit: {
        Args: { p_clave: string; p_max: number; p_ventana_segundos: number }
        Returns: boolean
      }
      cleanup_rate_limit: { Args: never; Returns: undefined }
      crear_empresa_con_establecimiento: {
        Args: {
          p_direccion?: string
          p_nombre: string
          p_ruc?: string
          p_telefono?: string
        }
        Returns: string
      }
      crear_orden_transaccional: {
        Args: {
          p_empresa_id: string
          p_fecha: string
          p_km_servicio: number
          p_observaciones: string
          p_productos: Json
          p_proximo_fecha: string
          p_proximo_km: number
          p_servicios: Json
          p_usuario_id: string
          p_vehiculo_id: string
        }
        Returns: string
      }
      current_empresa_id: { Args: never; Returns: string }
      earth: { Args: never; Returns: number }
      editar_orden_transaccional: {
        Args: {
          p_fecha: string
          p_km_servicio: number
          p_observaciones: string
          p_orden_id: string
          p_productos: Json
          p_proximo_fecha: string
          p_proximo_km: number
          p_servicios: Json
          p_vehiculo_id: string
        }
        Returns: undefined
      }
      is_admin_general: { Args: never; Returns: boolean }
      listar_historial_compartido: {
        Args: never
        Returns: {
          autorizado: boolean
          empresa_id: string
          id: string
          nombre_empresa: string
          token_propuesta: string
          vehiculo_anio: number
          vehiculo_empresa_id: string
          vehiculo_marca: string
          vehiculo_modelo: string
          vehiculo_patente: string
        }[]
      }
      proponer_historial_compartido: {
        Args: { p_conductor_email: string; p_vehiculo_empresa_id: string }
        Returns: string
      }
      publicar_establecimiento: {
        Args: { p_establecimiento_id: string; p_publicado: boolean }
        Returns: undefined
      }
      revocar_historial_compartido: {
        Args: { p_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
