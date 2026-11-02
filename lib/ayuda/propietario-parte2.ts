import type { AyudaSeccionData } from './types';

export const PROPIETARIO_SECCIONES_2: AyudaSeccionData[] = [
  {
    id: 'inventario',
    titulo: '9. Inventario y stock',
    bloques: [
      { tipo: 'parrafo', texto: 'El control de stock te permite saber cuántos productos tenés en el lubricentro. Cada producto propio tiene un stock actual y un stock mínimo.' },
      { tipo: 'parrafo', texto: 'Cuando cargás un producto en el catálogo, indicás el stock actual (cuántos tenés hoy) y el stock mínimo (a partir de cuántos querés que te avise que repongas).' },
      { tipo: 'tip', texto: 'El stock mínimo es un número de referencia. No hay una alerta automática todavía, pero podés verlo en el listado de productos. Los productos con stock bajo se destacan.' },
      { tipo: 'advertencia', texto: 'El stock NO se descuenta automáticamente cuando usás un producto en una orden. Tenés que actualizarlo manualmente desde el catálogo. La actualización automática está en desarrollo para una versión futura.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Ver productos con stock bajo', descripcion: 'En Catálogo → Productos, revisá la columna de stock. Los que están por debajo del mínimo aparecen destacados.' },
          { titulo: 'Actualizar stock', descripcion: 'Click en el producto → modificá el stock actual → "Guardar cambios".' },
        ],
      },
    ],
  },
  {
    id: 'establecimientos',
    titulo: '10. Establecimientos (sucursales)',
    bloques: [
      { tipo: 'parrafo', texto: 'Un establecimiento es un local físico donde atendés. Podés tener uno o varios (sucursales), todos bajo la misma empresa.' },
      { tipo: 'parrafo', texto: 'Cada establecimiento tiene: nombre, dirección, teléfono, horarios y servicios ofrecidos. Además, podés publicarlo en el directorio público para que los conductores te encuentren.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Ir a Establecimientos', descripcion: 'En el menú lateral, click en "Establecimientos".' },
          { titulo: 'Crear nuevo', descripcion: 'Click en "Nuevo establecimiento". Completá nombre, dirección, teléfono, horarios y servicios.' },
          { titulo: 'Ubicación', descripcion: 'En el mapa interactivo, hacé click en la ubicación exacta de tu local, o arrastrá el pin. También podés ingresar latitud y longitud manualmente.' },
          { titulo: 'Guardar', descripcion: 'Click en "Crear establecimiento".' },
        ],
      },
      { tipo: 'tip', texto: 'Cargá la ubicación con precisión. Es lo que permite que los conductores te encuentren en el directorio cuando buscan "cerca de mí".' },
      { tipo: 'advertencia', texto: 'La dirección y las coordenadas son las que se muestran públicamente en el directorio. No incluyas información privada en el nombre.' },
    ],
  },
  {
    id: 'directorio',
    titulo: '11. Directorio público',
    bloques: [
      { tipo: 'parrafo', texto: 'El directorio es una página pública (kuatiauto.vercel.app/directorio) donde cualquier persona puede buscar lubricentros por ciudad, servicio o cercanía. Es la forma de que nuevos clientes te encuentren.' },
      { tipo: 'parrafo', texto: 'Para aparecer en el directorio, tenés que publicar al menos un establecimiento. La publicación es self-service: la hacés vos desde la app, no requiere aprobación del admin.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Crear establecimiento', descripcion: 'Si todavía no lo hiciste, creá al menos un establecimiento con dirección, teléfono y ubicación.' },
          { titulo: 'Publicar', descripcion: 'En la ficha del establecimiento, click en el botón "Publicar en directorio".' },
          { titulo: 'Verificar', descripcion: 'Andá a kuatiauto.vercel.app/directorio, buscá tu lubricentro por nombre o ciudad. Debería aparecer.' },
        ],
      },
      {
        tipo: 'tabla',
        headers: ['Dato', 'Se muestra en el directorio'],
        rows: [
          ['Nombre del establecimiento', 'Sí'],
          ['Dirección', 'Sí'],
          ['Teléfono', 'Sí'],
          ['Horarios', 'Sí'],
          ['Servicios ofrecidos', 'Sí'],
          ['Ubicación aproximada', 'Sí (solo ciudad y barrio, no coordenadas exactas)'],
          ['Email', 'No'],
          ['Datos de clientes', 'No'],
        ],
      },
      { tipo: 'tip', texto: 'Cargá servicios variados (cambio de aceite, filtros, revisión de frenos, etc.). Los conductores buscan por servicio específico.' },
      { tipo: 'advertencia', texto: 'Podés despublicar tu establecimiento en cualquier momento. Si lo hacés, deja de aparecer en el directorio inmediatamente.' },
    ],
  },
  {
    id: 'portal-conductor',
    titulo: '12. Portal del conductor',
    bloques: [
      { tipo: 'parrafo', texto: 'Cada conductor tiene su "garage digital" en kuatiauto.vercel.app/mi-garage. Ahí puede ver el historial de mantenimiento de sus vehículos, si el taller lo autoriza.' },
      { tipo: 'parrafo', texto: 'Vos podés proponerle a un cliente que vea el historial de su vehículo. El cliente recibe una notificación por email y puede aceptar o rechazar. Si acepta, ve todo el historial.' },
      {
        tipo: 'pasos',
        items: [
          { titulo: 'Ir al vehículo', descripcion: 'En Vehículos, click en el vehículo del cliente.' },
          { titulo: 'Proponer historial', descripcion: 'Click en "Proponer historial". Ingresá el email del conductor (debe tener cuenta en KuatiAuto o crearla).' },
          { titulo: 'Confirmar', descripcion: 'Click en "Enviar propuesta". Se genera un token único y se envía notificación al conductor.' },
        ],
      },
      { tipo: 'parrafo', texto: 'El conductor recibe un email. Si acepta, ve el historial completo del vehículo. Si revoca, pierde el acceso inmediatamente.' },
      { tipo: 'advertencia', texto: 'El conductor puede revocar el acceso en cualquier momento. Si revoca, no podés volver a proponer el mismo historial sin su consentimiento explícito.' },
      { tipo: 'tip', texto: 'Proponé el historial a clientes frecuentes. Les da confianza y fideliza la relación.' },
    ],
  },
  {
    id: 'notificaciones',
    titulo: '13. Notificaciones y recordatorios',
    bloques: [
      { tipo: 'parrafo', texto: 'KuatiAuto envía notificaciones automáticas por email en 3 momentos clave: bienvenida al crear empresa, propuesta de historial al conductor, y recordatorio de próximo mantenimiento al completar una orden.' },
      {
        tipo: 'tabla',
        headers: ['Notificación', 'Cuándo se envía', 'A quién'],
        rows: [
          ['Bienvenida', 'Al crear una empresa nueva', 'Al propietario'],
          ['Historial compartido', 'Al proponer historial a un conductor', 'Al conductor'],
          ['Recordatorio de mantenimiento', 'Al completar una orden', 'Al conductor (si autorizó)'],
        ],
      },
      { tipo: 'parrafo', texto: 'El recordatorio de mantenimiento se calcula automáticamente cuando completás una orden. Se basa en el intervalo de km o meses del servicio realizado.' },
      { tipo: 'advertencia', texto: 'Las notificaciones se envían al email del cliente. Si el cliente no tiene email cargado, no recibe nada.' },
      { tipo: 'tip', texto: 'Cargá el email del cliente (y del conductor, si es distinto) para que las notificaciones funcionen.' },
    ],
  },
  {
    id: 'consejos',
    titulo: '14. Consejos y buenas prácticas',
    bloques: [
      { tipo: 'parrafo', texto: 'Estas son algunas prácticas que te van a ayudar a sacar el máximo provecho de KuatiAuto:' },
      {
        tipo: 'lista',
        items: [
          'Cargá el kilometraje en cada orden. Es la base para calcular el próximo mantenimiento.',
          'Completá el email y teléfono de tus clientes. Te permite contactarlos y enviar notificaciones.',
          'Usá la Recepción rápida para cargar trabajos del día. Es mucho más rápido que el flujo tradicional.',
          'Mantené el catálogo de servicios y productos actualizado. Si cambiás de marca de aceite, actualizá el catálogo.',
          'Revisá el stock semanalmente. Los productos con stock bajo se destacan en el listado.',
          'Publicá tu establecimiento en el directorio. Es la forma más fácil de que nuevos clientes te encuentren.',
          'Proponé el historial a clientes frecuentes. Les da transparencia y fideliza.',
          'Completá las órdenes solo cuando el trabajo esté realmente terminado. No las cierres antes.',
        ],
      },
      { tipo: 'tip', texto: 'El panel principal (dashboard) te da una vista rápida de tu negocio. Revisalo todos los días al empezar.' },
    ],
  },
  {
    id: 'problemas',
    titulo: '15. Solución de problemas',
    bloques: [
      { tipo: 'parrafo', texto: 'Estas son las dudas más frecuentes y cómo resolverlas:' },
      {
        tipo: 'faq',
        items: [
          { pregunta: 'No me llega el email de confirmación al registrarme', respuesta: 'Revisá la carpeta de spam. Si no aparece en 5 minutos, contactá a soporte. Mientras tanto, podés loguearte igual: el email de confirmación es opcional.' },
          { pregunta: 'No puedo crear una empresa', respuesta: 'Si ya creaste una empresa antes con ese usuario, no podés crear otra. Cada usuario tiene una sola empresa. Si necesitás otra, creá un usuario nuevo.' },
          { pregunta: 'El mapa no carga', respuesta: 'El mapa usa Leaflet + OpenStreetMap (gratis, sin API key). Si no carga, verificá tu conexión a internet. Si el problema persiste, contactá a soporte.' },
          { pregunta: 'No veo mis productos en el catálogo', respuesta: 'Verificá que estés logueado con el usuario correcto. Los productos propios son por empresa: si cambiaste de empresa, no los ves. Contactá a soporte si el problema persiste.' },
          { pregunta: 'El stock no se actualiza solo', respuesta: 'Correcto, la actualización automática de stock todavía no está implementada. Por ahora tenés que actualizar el stock manualmente desde el catálogo cada vez que uses un producto.' },
          { pregunta: 'Un cliente dice que no ve su historial', respuesta: 'Verificá: (1) que le hayas propuesto el historial, (2) que el email sea el correcto, (3) que el cliente haya aceptado la propuesta. Si el cliente revocó, no puede volver a verlo sin nueva propuesta.' },
          { pregunta: 'Perdí datos de una orden', respuesta: 'Las órdenes completadas no se pueden editar. Si necesitás corregir algo, anulá la orden y creá una nueva con los datos correctos. La orden anulada queda en el historial.' },
          { pregunta: 'Cómo cambio mi contraseña', respuesta: 'En la página de login, click en "¿Olvidaste tu contraseña?". Te va a llegar un email con un link para crear una nueva.' },
          { pregunta: 'Puedo tener varias empresas', respuesta: 'No. Cada usuario tiene una sola empresa. Si tenés dos lubricentros distintos, creá dos usuarios separados (uno por empresa).' },
          { pregunta: 'Cómo elimino mi cuenta', respuesta: 'Contactá a soporte por email. Vamos a desactivar tu cuenta y anonimizar tus datos en un plazo de 30 días, según la Ley 6534/2020.' },
        ],
      },
      { tipo: 'tip', texto: 'Si tu problema no está en esta lista, escribinos a soporte@kuatiauto.com.py con el detalle. Cuanto más específico, mejor podemos ayudarte.' },
    ],
  },
];