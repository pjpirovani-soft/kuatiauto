import type { AyudaGuiaData } from './types';

export const GUIA_ADMIN: AyudaGuiaData = {
  rol: 'admin',
  titulo: 'Guía del administrador',
  subtitulo: 'Cómo administrar empresas, usuarios y el catálogo global de KuatiAuto.',
  secciones: [
    {
      id: 'rol-admin',
      titulo: '1. Tu rol como administrador',
      bloques: [
        { tipo: 'parrafo', texto: 'El rol admin_general es el más alto en KuatiAuto. Tenés acceso a todas las empresas, usuarios y datos de la plataforma. Es un rol de confianza: usalo con responsabilidad.' },
        { tipo: 'parrafo', texto: 'El admin_general puede:' },
        {
          tipo: 'lista',
          items: [
            'Ver el dashboard global con métricas de toda la plataforma.',
            'Gestionar empresas (listar, ver detalle, activar/desactivar).',
            'Gestionar usuarios (listar, cambiar rol, activar/desactivar).',
            'Administrar el catálogo global de servicios y productos.',
            'Ver analytics globales (panel del CEO).',
          ],
        },
        { tipo: 'advertencia', texto: 'El admin_general NO puede crear empresas ni órdenes desde el panel de admin. Esas son acciones de los propietarios. El admin solo administra.' },
        { tipo: 'tip', texto: 'El admin_general se crea por SQL directo en Supabase. No hay una UI para crear nuevos admins. Si necesitás uno nuevo, contactá al equipo técnico.' },
      ],
    },
    {
      id: 'dashboard-admin',
      titulo: '2. Dashboard de administración',
      bloques: [
        { tipo: 'parrafo', texto: 'El dashboard es la primera pantalla que ves al loguearte como admin. Muestra 4 contadores globales de toda la plataforma.' },
        {
          tipo: 'tabla',
          headers: ['Indicador', 'Qué significa'],
          rows: [
            ['Empresas', 'Cantidad total de empresas activas en KuatiAuto.'],
            ['Usuarios', 'Cantidad total de usuarios (todos los roles) activos.'],
            ['Establecimientos publicados', 'Cantidad de establecimientos publicados en el directorio.'],
            ['Órdenes', 'Cantidad total de órdenes de trabajo creadas en la plataforma.'],
          ],
        },
        { tipo: 'parrafo', texto: 'Además, en el menú lateral tenés accesos directos a "Empresas", "Usuarios", "Catálogo" y "Analytics".' },
        { tipo: 'tip', texto: 'El contador de "Establecimientos publicados" es la métrica más importante para saber si la plataforma está creciendo. Si sube, más lubricentros están usando el directorio.' },
      ],
    },
    {
      id: 'empresas',
      titulo: '3. Gestión de empresas',
      bloques: [
        { tipo: 'parrafo', texto: 'Desde "Admin → Empresas" podés ver todas las empresas registradas, filtrar por estado (activa/inactiva) y acceder al detalle de cada una.' },
        {
          tipo: 'pasos',
          items: [
            { titulo: 'Listar empresas', descripcion: 'En el menú lateral, click en "Empresas". Vas a ver una tabla con nombre, RUC, estado y contadores.' },
            { titulo: 'Filtrar', descripcion: 'Usá el dropdown de estado (Todas / Activas / Desactivadas) para acotar la lista.' },
            { titulo: 'Ver detalle', descripcion: 'Click en el nombre de una empresa para ver: datos completos, 5 contadores (clientes, vehículos, órdenes, usuarios, establecimientos), tabla de usuarios y tabla de establecimientos.' },
          ],
        },
        { tipo: 'parrafo', texto: 'En el detalle de la empresa también podés ver qué usuarios pertenecen a ella y qué establecimientos tiene cargados.' },
        { tipo: 'tip', texto: 'Usá el detalle para diagnosticar problemas: si una empresa reporta "no veo mis datos", verificá que los contadores no estén en 0.' },
        { tipo: 'advertencia', texto: 'Desde el panel de admin NO podés crear ni eliminar empresas. Solo podés activar/desactivar y ver el detalle. La creación de empresas es self-service (cada usuario crea la suya).' },
      ],
    },
    {
      id: 'usuarios',
      titulo: '4. Gestión de usuarios',
      bloques: [
        { tipo: 'parrafo', texto: 'Desde "Admin → Usuarios" podés ver todos los usuarios de la plataforma, filtrar por rol y cambiar el rol o desactivar cuentas.' },
        {
          tipo: 'tabla',
          headers: ['Rol', 'Qué puede hacer'],
          rows: [
            ['admin_general', 'Todo (administración de la plataforma).'],
            ['propietario', 'Gestionar su empresa, clientes, vehículos, órdenes, catálogo local y establecimientos.'],
            ['empleado', 'Trabajar en la empresa pero con permisos limitados (en desarrollo para v2).'],
            ['conductor', 'Ver su propio historial de mantenimiento en Mi Garaje.'],
          ],
        },
        { tipo: 'parrafo', texto: 'Reglas de cambio de rol:' },
        {
          tipo: 'lista',
          items: [
            'Solo podés asignar los roles: propietario, empleado, conductor.',
            'No podés asignar admin_general desde la UI (requiere SQL directo).',
            'No podés cambiar tu propio rol (auto-modificación bloqueada).',
            'No podés cambiar el rol de otro admin_general.',
            'No podés dejar la plataforma sin admin_general activo.',
          ],
        },
        { tipo: 'parrafo', texto: 'Reglas de desactivación:' },
        {
          tipo: 'lista',
          items: [
            'No podés desactivar tu propia cuenta.',
            'No podés desactivar al último admin_general activo.',
            'Al desactivar un usuario, no puede loguearse pero sus datos persisten.',
          ],
        },
        { tipo: 'advertencia', texto: 'Cambiar el rol de un usuario es una operación delicada. Si un propietario lo cambiás a conductor, pierde acceso a su empresa. Asegurate de entender las consecuencias antes de hacerlo.' },
        { tipo: 'tip', texto: 'Si un usuario reporta "no puedo entrar", verificá que esté activo y que su rol sea el correcto. Los roles mal asignados son la causa más común de problemas de acceso.' },
      ],
    },
    {
      id: 'catalogo-global',
      titulo: '5. Catálogo global',
      bloques: [
        { tipo: 'parrafo', texto: 'El catálogo global son los servicios y productos que TODOS los lubricentros pueden usar en sus órdenes. Los administra el admin_general.' },
        { tipo: 'parrafo', texto: 'Hay 2 subsecciones: "Servicios" y "Productos". Ambas funcionan igual: listar, crear, editar y eliminar.' },
        {
          tipo: 'pasos',
          items: [
            { titulo: 'Ir a Catálogo', descripcion: 'En el menú lateral, click en "Catálogo".' },
            { titulo: 'Elegir tipo', descripcion: 'Click en "Servicios" o "Productos" según lo que quieras administrar.' },
            { titulo: 'Crear nuevo', descripcion: 'Click en "Nuevo servicio" o "Nuevo producto". Completá los campos.' },
            { titulo: 'Editar', descripcion: 'Click en cualquier item de la lista para editarlo.' },
            { titulo: 'Eliminar', descripcion: 'Click en el ícono de tacho de basura. Confirmá la eliminación (es irreversible).' },
          ],
        },
        { tipo: 'parrafo', texto: 'Los servicios globales tienen campos:' },
        {
          tipo: 'lista',
          items: [
            'Nombre (obligatorio).',
            'Descripción (opcional).',
            'Intervalo en km sugerido (opcional, para calcular próximo mantenimiento).',
            'Intervalo en meses sugerido (opcional).',
          ],
        },
        { tipo: 'parrafo', texto: 'Los productos globales tienen campos:' },
        {
          tipo: 'lista',
          items: [
            'Nombre (obligatorio).',
            'Marca (opcional).',
            'Tipo (opcional).',
            'Viscosidad (opcional, para aceites).',
          ],
        },
        { tipo: 'advertencia', texto: 'Eliminar un servicio o producto global es irreversible. Si un lubricentro lo está usando en una orden, esa orden queda con una referencia rota. Mejor despublicar (soft delete) que eliminar.' },
        { tipo: 'parrafo', texto: 'Los intervalos de km/meses que cargues en los servicios globales tienen 2 usos: (1) autocompletan el formulario de la orden cuando el mecánico elige el servicio, y (2) se usan para calcular el próximo mantenimiento al completar la orden.' },
        { tipo: 'tip', texto: 'Cargá los intervalos de km/meses con cuidado. Si cargás un intervalo equivocado, el sistema va a sugerir un próximo mantenimiento incorrecto. Verificá siempre con el manual del fabricante antes de guardar.' },
      ],
    },
    {
      id: 'analytics',
      titulo: '6. Analytics global (panel del CEO)',
      bloques: [
        { tipo: 'parrafo', texto: 'La sección "Analytics" es el panel de métricas globales de la plataforma. Está pensada para vos (o para el CEO) para entender cómo está creciendo KuatiAuto.' },
        {
          tipo: 'tabla',
          headers: ['Métrica', 'Qué mide'],
          rows: [
            ['Empresas totales', 'Cuántas empresas hay registradas.'],
            ['Empresas activas', 'Cuántas están operando.'],
            ['Usuarios por rol', 'Distribución de propietarios, empleados y conductores.'],
            ['Órdenes por mes', 'Volumen de trabajo en la plataforma.'],
            ['Establecimientos publicados', 'Cuántos lubricentros están visibles en el directorio.'],
          ],
        },
        { tipo: 'parrafo', texto: 'Estas métricas te sirven para:' },
        {
          tipo: 'lista',
          items: [
            'Entender el crecimiento de la plataforma.',
            'Identificar qué roles están creciendo más.',
            'Saber si el directorio está siendo adoptado.',
            'Tomar decisiones de negocio (ej. si el catálogo global necesita más servicios).',
          ],
        },
        { tipo: 'tip', texto: 'Revisá el panel de analytics mensualmente para tener una vista macro del negocio. No lo uses para decisiones operativas del día a día (eso es el dashboard).' },
      ],
    },
  ],
};