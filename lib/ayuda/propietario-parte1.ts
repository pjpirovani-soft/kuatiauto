import type { AyudaSeccionData } from './types';

export const PROPIETARIO_SECCIONES_1: AyudaSeccionData[] = [
  {
    id: 'primeros-pasos',
    titulo: '1. Primeros pasos',
    bloques: [
      { tipo: 'parrafo', texto: 'Cuando creás tu cuenta, lo primero que tenés que hacer es crear tu empresa. La empresa es la que va a agrupar a todos tus clientes, vehículos, órdenes y catálogo.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Registrate', descripcion: 'Desde la página principal, click en "Registrarse". Ingresá tu email, nombre y contraseña.' },
          { titulo: 'Confirmá tu email', descripcion: 'Te va a llegar un correo de confirmación. Click en el link para activar tu cuenta.' },
          { titulo: 'Creá tu empresa', descripcion: 'Al entrar por primera vez, la app te va a pedir el nombre de tu lubricentro, RUC (opcional), dirección y teléfono. Completá lo que tengas a mano.' },
          { titulo: 'Empezá a cargar datos', descripcion: 'Ya estás dentro. El siguiente paso es cargar tu primer cliente.' },
        ],
      },
      { tipo: 'tip', texto: 'El RUC y la dirección son opcionales al crear la empresa. Podés completarlos después desde la configuración.' },
    ],
  },
  {
    id: 'panel-principal',
    titulo: '2. Panel principal',
    bloques: [
      { tipo: 'parrafo', texto: 'El panel principal (o dashboard) es la primera pantalla que ves al loguearte. Te muestra un resumen rápido de tu lubricentro.' },
      {
        tipo: 'tabla',
        headers: ['Indicador', 'Qué significa'],
        rows: [
          ['Clientes', 'Cantidad total de clientes activos que tenés cargados.'],
          ['Vehículos', 'Cantidad total de vehículos activos en tu base.'],
          ['Completadas (mes)', 'Órdenes que completaste en el mes actual.'],
          ['Pendientes', 'Órdenes en estado borrador (sin cerrar todavía).'],
        ],
      },
      { tipo: 'parrafo', texto: 'Abajo de los números vas a ver las últimas 5 órdenes con su estado, cliente, vehículo e importe. Click en cualquiera para ver el detalle.' },
      { tipo: 'tip', texto: 'Los números son reales, actualizados al momento. Si ves 0, es porque todavía no cargaste datos de ese tipo.' },
    ],
  },
  {
    id: 'clientes',
    titulo: '3. Gestión de clientes',
    bloques: [
      { tipo: 'parrafo', texto: 'Los clientes son las personas o empresas a las que les prestás servicio. Cada cliente puede tener uno o más vehículos asociados.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Ir a Clientes', descripcion: 'En el menú lateral, click en "Clientes".' },
          { titulo: 'Crear nuevo', descripcion: 'Click en "Nuevo cliente". Completá nombre (obligatorio), email, teléfono y notas.' },
          { titulo: 'Guardar', descripcion: 'Click en "Guardar". El cliente queda creado y volvés al listado.' },
        ],
      },
      { tipo: 'parrafo', texto: 'Para editar un cliente, click en su nombre en la lista. Para buscarlo, usá el buscador de arriba.' },
      { tipo: 'tip', texto: 'Cargá el teléfono y el email aunque sean opcionales. Te sirven para contactar al cliente y para enviar notificaciones automáticas.' },
      { tipo: 'advertencia', texto: 'No podés eliminar clientes que tengan órdenes asociadas. Si un cliente deja de venir, podés simplemente no usarlo más.' },
    ],
  },
  {
    id: 'vehiculos',
    titulo: '4. Gestión de vehículos',
    bloques: [
      { tipo: 'parrafo', texto: 'Cada vehículo pertenece a un cliente. Necesitás tener al menos un cliente cargado antes de agregar vehículos.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Ir a Vehículos', descripcion: 'En el menú lateral, click en "Vehículos".' },
          { titulo: 'Crear nuevo', descripcion: 'Click en "Nuevo vehículo".' },
          { titulo: 'Elegir cliente', descripcion: 'En el dropdown, seleccioná el cliente dueño del vehículo.' },
          { titulo: 'Completar datos', descripcion: 'Marca y modelo son obligatorios. Año, patente, kilometraje actual y notas son opcionales.' },
          { titulo: 'Guardar', descripcion: 'Click en "Crear vehículo".' },
        ],
      },
      { tipo: 'tip', texto: 'Cargá siempre el kilometraje actual. Es clave para calcular el próximo mantenimiento.' },
      { tipo: 'parrafo', texto: 'Desde la ficha de un vehículo podés ver su historial de órdenes, proponer compartir el historial con el conductor, o editar sus datos.' },
    ],
  },
  {
    id: 'recepcion-rapida',
    titulo: '5. Recepción rápida',
    bloques: [
      { tipo: 'parrafo', texto: 'La Recepción rápida es el flujo más eficiente para registrar un trabajo. En lugar de navegar por 3 pantallas distintas, te permite cargar cliente → vehículo → orden en una sola pantalla, con 3 pasos.' },
      { tipo: 'parrafo', texto: 'Es ideal para cuando un cliente llega al lubricentro y necesitás crear la orden rápido, sin perder tiempo.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Ir a Recepción rápida', descripcion: 'En el menú lateral, click en "Recepción rápida".' },
          { titulo: 'Paso 1 - Cliente', descripcion: 'Buscá por nombre o teléfono. Si el cliente ya existe, click en él para seleccionarlo. Si no, click en "Crear cliente nuevo" y completá el formulario.' },
          { titulo: 'Paso 2 - Vehículo', descripcion: 'Vas a ver los vehículos del cliente. Si el vehículo ya existe, click en él. Si no, click en "Crear vehículo nuevo".' },
          { titulo: 'Paso 3 - Servicio', descripcion: 'Cargá el kilometraje actual. Agregá los servicios y productos que correspondan. Podés agregar varios de cada uno.' },
          { titulo: 'Crear orden', descripcion: 'Click en "Crear orden". Listo, la orden queda creada y podés verla o crear otra.' },
        ],
      },
      { tipo: 'tip', texto: 'En el paso 3, los precios de servicios y productos se ingresan manualmente. El catálogo no tiene precios fijos: cada lubricentro cobra lo que considera.' },
      { tipo: 'advertencia', texto: 'El kilometraje es obligatorio. Sin él, no se puede calcular el próximo mantenimiento.' },
    ],
  },
  {
    id: 'ordenes',
    titulo: '6. Órdenes de trabajo',
    bloques: [
      { tipo: 'parrafo', texto: 'Una orden de trabajo es el registro de un servicio realizado a un vehículo. Contiene: cliente, vehículo, servicios, productos, importe, kilometraje y observaciones.' },
      { tipo: 'parrafo', texto: 'Las órdenes tienen 3 estados:' },
      {
        tipo: 'lista',
        items: [
          'Borrador: orden creada pero no cerrada. Podés editarla libremente.',
          'Completada: orden cerrada. Se calcula el próximo mantenimiento y se envía notificación al conductor (si autorizó).',
          'Anulada: orden cancelada con un motivo. No se puede editar.',
        ],
      },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Crear orden', descripcion: 'Podés crearla desde "Órdenes → Nueva orden" o desde "Recepción rápida".' },
          { titulo: 'Editar (solo en borrador)', descripcion: 'Click en la orden → modificá lo que necesites → "Guardar cambios".' },
          { titulo: 'Completar', descripcion: 'Click en "Completar orden". Se calcula el próximo mantenimiento y se envía notificación.' },
          { titulo: 'Anular', descripcion: 'Click en "Anular orden", ingresá un motivo. La orden queda registrada pero no se puede editar.' },
        ],
      },
      { tipo: 'tip', texto: 'Completá la orden solo cuando el trabajo esté realmente terminado. Si la cerrás antes, el próximo mantenimiento se calcula mal.' },
      { tipo: 'advertencia', texto: 'Las órdenes completadas no se pueden editar (por integridad de datos). Si te equivocaste, anulá la orden y creá una nueva.' },
    ],
  },
  {
    id: 'catalogo-servicios',
    titulo: '7. Catálogo de servicios',
    bloques: [
      { tipo: 'parrafo', texto: 'El catálogo de servicios se divide en 2 categorías: servicios globales (los carga el administrador de la plataforma) y servicios propios (los cargás vos).' },
      {
        tipo: 'tabla',
        headers: ['Aspecto', 'Servicios globales', 'Servicios propios'],
        rows: [
          ['Quién los crea', 'Admin de KuatiAuto', 'Vos (propietario)'],
          ['Cantidad', '10 predefinidos', 'Los que necesites'],
          ['Precio', 'No tiene', 'No tiene (se ingresa en la orden)'],
          ['Intervalo de mantenimiento', 'Sí (km y meses sugeridos)', 'No'],
          ['Se pueden editar', 'No (los maneja el admin)', 'Sí'],
          ['Se pueden eliminar', 'No', 'No (decisión de diseño)'],
        ],
      },
      { tipo: 'parrafo', texto: 'Los servicios propios te sirven para agregar servicios específicos de tu lubricentro que no estén en el catálogo global (ej. "Cambio de aceite sintético premium", "Revisión de frenos", etc.).' },
      { tipo: 'pasos', items: [
        { titulo: 'Ir a Catálogo → Servicios', descripcion: 'En el menú lateral, click en "Catálogo" y después "Servicios".' },
        { titulo: 'Crear nuevo', descripcion: 'Click en "Nuevo servicio". Completá nombre y descripción (opcional).' },
        { titulo: 'Guardar', descripcion: 'Click en "Crear servicio".' },
      ] },
      { tipo: 'tip', texto: 'No cargues servicios duplicados de los globales. Si el servicio global ya existe, usalo directamente en la orden.' },
    ],
  },
  {
    id: 'catalogo-productos',
    titulo: '8. Catálogo de productos',
    bloques: [
      { tipo: 'parrafo', texto: 'El catálogo de productos funciona igual que el de servicios: hay productos globales (que carga el admin) y productos propios (que cargás vos). La diferencia es que los productos tienen stock.' },
      {
        tipo: 'tabla',
        headers: ['Aspecto', 'Productos globales', 'Productos propios'],
        rows: [
          ['Quién los crea', 'Admin de KuatiAuto', 'Vos (propietario)'],
          ['Campos', 'nombre, marca, tipo, viscosidad', 'nombre, marca, tipo, viscosidad, stock_actual, stock_minimo, unidad'],
          ['Precio', 'No tiene', 'No tiene (se ingresa en la orden)'],
          ['Control de stock', 'No', 'Sí (stock actual y mínimo)'],
          ['Se pueden editar', 'No', 'Sí'],
        ],
      },
      { tipo: 'parrafo', texto: 'Los productos propios son los que vendés en tu lubricentro. Ej: "Aceite Mobil 1 5W-30 (botella 4L)", "Filtro de aceite Toyota Corolla", etc.' },
      { tipo: 'pasos', items: [
        { titulo: 'Ir a Catálogo → Productos', descripcion: 'Click en "Catálogo" → "Productos".' },
        { titulo: 'Crear nuevo', descripcion: 'Click en "Nuevo producto". Completá nombre, marca, tipo, viscosidad, stock actual, stock mínimo y unidad.' },
        { titulo: 'Guardar', descripcion: 'Click en "Crear producto".' },
      ] },
      { tipo: 'advertencia', texto: 'El stock no se actualiza automáticamente cuando usás un producto en una orden. Es solo informativo por ahora (la actualización automática está en desarrollo).' },
      { tipo: 'tip', texto: 'Cargá el stock mínimo. Cuando el stock actual baje de ese número, vas a saber que tenés que reponer.' },
    ],
  },
];