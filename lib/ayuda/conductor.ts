import type { AyudaGuiaData } from './types';

export const GUIA_CONDUCTOR: AyudaGuiaData = {
  rol: 'conductor',
  titulo: 'Guía del conductor',
  subtitulo: 'Tu garage digital, tu historial de mantenimiento y el control de tus datos.',
  secciones: [
    {
      id: 'que-es-kuatiauto',
      titulo: '1. ¿Qué es KuatiAuto para vos?',
      bloques: [
        { tipo: 'parrafo', texto: 'KuatiAuto es una plataforma que usan los lubricentros y talleres de Paraguay para gestionar su trabajo. Pero también tiene una parte pensada para vos: el conductor.' },
        { tipo: 'parrafo', texto: 'Como conductor, podés:' },
        {
          tipo: 'lista',
          items: [
            'Ver el historial de mantenimiento de tus vehículos en un solo lugar.',
            'Autorizar o revocar el acceso del taller a tu información.',
            'Controlar qué datos compartís y con quién.',
            'Recibir recordatorios cuando te toca el próximo cambio de aceite.',
          ],
        },
        { tipo: 'tip', texto: 'No necesitás pagar nada. La cuenta de conductor es gratuita y siempre lo será.' },
      ],
    },
    {
      id: 'crear-cuenta',
      titulo: '2. Cómo crear tu cuenta',
      bloques: [
        { tipo: 'parrafo', texto: 'Para tener tu garage digital, necesitás crear una cuenta como conductor. Es distinto del registro de lubricentro: como conductor no creás empresa, solo tu cuenta personal.' },
        {
          tipo: 'pasos',
          items: [
            { titulo: 'Ir al registro', descripcion: 'Desde la página principal, click en "Registrarse como conductor" (o entrá directo a kuatiauto.vercel.app/register-conductor).' },
            { titulo: 'Completar datos', descripcion: 'Ingresá tu nombre completo, email y contraseña (mínimo 8 caracteres).' },
            { titulo: 'Confirmar', descripcion: 'Click en "Crear cuenta". Te va a llegar un email de confirmación.' },
            { titulo: 'Loguearte', descripcion: 'Una vez confirmado, andá a kuatiauto.vercel.app/login y logueate con tu email y contraseña.' },
          ],
        },
        { tipo: 'advertencia', texto: 'Usá un email al que tengas acceso. Ahí te van a llegar las notificaciones y las propuestas de historial de los talleres.' },
        { tipo: 'tip', texto: 'Si ya tenés cuenta como propietario de lubricentro, no podés usar el mismo email para conductor. Necesitás uno distinto.' },
      ],
    },
    {
      id: 'mi-garage',
      titulo: '3. Tu garage digital (Mi Garaje)',
      bloques: [
        { tipo: 'parrafo', texto: 'Al loguearte como conductor, la app te lleva directo a "Mi Garaje". Es tu panel personal, donde ves todo lo relacionado con tus vehículos y tu historial.' },
        { tipo: 'parrafo', texto: 'La pantalla tiene 2 secciones principales:' },
        {
          tipo: 'tabla',
          headers: ['Sección', 'Qué muestra'],
          rows: [
            ['Mis Vehículos', 'Los vehículos que cargaste a tu nombre.'],
            ['Historial Compartido', 'Los historiales que los talleres te compartieron.'],
          ],
        },
        { tipo: 'tip', texto: 'En el menú lateral vas a tener accesos directos a "Mis Vehículos" y "Historial". Desde ahí también podés cerrar sesión.' },
      ],
    },
    {
      id: 'agregar-vehiculo',
      titulo: '4. Agregar un vehículo',
      bloques: [
        { tipo: 'parrafo', texto: 'Podés cargar tus propios vehículos en tu garage digital. Cada vehículo que cargues queda asociado a tu cuenta.' },
        {
          tipo: 'pasos',
          items: [
            { titulo: 'Ir a Mi Garaje → Mis Vehículos', descripcion: 'En el menú lateral, click en "Mis Vehículos".' },
            { titulo: 'Crear nuevo', descripcion: 'Click en "Agregar vehículo".' },
            { titulo: 'Completar datos', descripcion: 'Marca, modelo y patente son los más importantes. Año y kilometraje actual son opcionales pero recomendados.' },
            { titulo: 'Guardar', descripcion: 'Click en "Guardar vehículo".' },
          ],
        },
        { tipo: 'tip', texto: 'Cargá la patente exacta (sin guiones). Así el taller puede encontrarte más fácil si te propone un historial.' },
        { tipo: 'advertencia', texto: 'Si un taller carga un vehículo con tu patente, va a aparecer vinculado a tu cuenta automáticamente (siempre que tengas el mismo email).' },
      ],
    },
    {
      id: 'historial',
      titulo: '5. Ver el historial de mantenimiento',
      bloques: [
        { tipo: 'parrafo', texto: 'Cuando un lubricentro te propone compartir el historial de un vehículo, te va a llegar una notificación por email. Si aceptás, podés ver todos los mantenimientos que se hicieron en ese vehículo.' },
        { tipo: 'parrafo', texto: 'El historial incluye:' },
        {
          tipo: 'lista',
          items: [
            'Fecha de cada mantenimiento.',
            'Kilometraje al momento del servicio.',
            'Servicios realizados (ej. cambio de aceite, filtros).',
            'Productos usados (ej. tipo de aceite, viscosidad).',
            'Establecimiento donde se hizo.',
            'Próximo mantenimiento recomendado.',
          ],
        },
        {
          tipo: 'pasos',
          items: [
            { titulo: 'Recibir propuesta', descripcion: 'Te llega un email avisando que un taller te propone compartir el historial de un vehículo.' },
            { titulo: 'Ir a Mi Garaje → Historial', descripcion: 'En la app, click en "Historial".' },
            { titulo: 'Aceptar', descripcion: 'Vas a ver la propuesta pendiente. Click en "Aceptar" para ver el historial completo.' },
            { titulo: 'Consultar', descripcion: 'Una vez aceptado, el historial queda visible permanentemente (hasta que lo revoques).' },
          ],
        },
        { tipo: 'tip', texto: 'El historial te sirve para saber cuándo te toca el próximo service, y para tener un registro de lo que se le hizo al vehículo si lo querés vender.' },
      ],
    },
    {
      id: 'autorizar-revocar',
      titulo: '6. Autorizar y revocar el acceso',
      bloques: [
        { tipo: 'parrafo', texto: 'Vos tenés el control total sobre quién ve tu historial. Un taller puede proponerte compartir, pero solo vos podés aceptar. Y podés revocar el acceso cuando quieras.' },
        { tipo: 'parrafo', texto: 'Hay 3 estados posibles para cada historial compartido:' },
        {
          tipo: 'tabla',
          headers: ['Estado', 'Qué significa'],
          rows: [
            ['Pendiente', 'El taller te propuso compartir. Esperando tu respuesta.'],
            ['Autorizado', 'Aceptaste. El taller puede ver tu historial.'],
            ['Revocado', 'Decidiste cortar el acceso. El taller ya no ve tu historial.'],
          ],
        },
        {
          tipo: 'pasos',
          items: [
            { titulo: 'Ver pendientes', descripcion: 'En "Mi Garaje → Historial", vas a ver las propuestas pendientes con un badge distintivo.' },
            { titulo: 'Aceptar', descripcion: 'Click en "Aceptar" para autorizar el acceso.' },
            { titulo: 'Revocar', descripcion: 'Si ya autorizaste, click en "Revocar acceso". El taller deja de ver tu historial inmediatamente.' },
          ],
        },
        { tipo: 'advertencia', texto: 'Si revocás, el taller recibe una notificación. Si querés volver a autorizar, el taller tiene que proponerte el historial de nuevo. No podés "des-revocar" vos solo.' },
        { tipo: 'tip', texto: 'Podés revocar sin dar explicaciones. Es tu derecho y nadie puede obligarte a compartir tu historial.' },
      ],
    },
    {
      id: 'privacidad',
      titulo: '7. Privacidad y control de tus datos',
      bloques: [
        { tipo: 'parrafo', texto: 'Tus datos son tuyos. KuatiAuto cumple con la Ley 6534/2020 de Paraguay sobre protección de datos personales.' },
        { tipo: 'parrafo', texto: 'Esto es lo que podés hacer con tus datos:' },
        {
          tipo: 'lista',
          items: [
            'Ver qué datos tenemos sobre vos (en tu perfil).',
            'Corregir datos incorrectos (editando tu perfil).',
            'Revocar el acceso al historial cuando quieras.',
            'Solicitar la eliminación de tu cuenta por email a soporte.',
            'Exportar tus datos (en desarrollo para v2).',
          ],
        },
        { tipo: 'parrafo', texto: 'Lo que NO hacemos:' },
        {
          tipo: 'lista',
          items: [
            'No vendemos tus datos a terceros.',
            'No compartimos tu información con otros talleres sin tu permiso.',
            'No usamos cookies de tracking en el MVP.',
            'No accedemos a tu ubicación sin que vos la compartas explícitamente.',
          ],
        },
        { tipo: 'tip', texto: 'Si querés saber exactamente qué datos tenemos, escribinos a soporte. Te respondemos en horario laboral.' },
      ],
    },
    {
      id: 'problemas-conductor',
      titulo: '8. Solución de problemas',
      bloques: [
        {
          tipo: 'faq',
          items: [
            { pregunta: 'No me llega el email de confirmación', respuesta: 'Revisá la carpeta de spam. Si no aparece en 5 minutos, contactá a soporte. Mientras tanto, podés intentar loguearte igual: la confirmación es recomendada pero no bloqueante.' },
            { pregunta: 'No veo la propuesta de historial', respuesta: 'Verificá: (1) que el taller te haya propuesto el historial, (2) que el email que usaste para registrarte sea el mismo que el taller cargó, (3) que hayas recargado la página. Si el problema persiste, contactá al taller.' },
            { pregunta: 'Acepté pero no veo el historial', respuesta: 'Recargá la página (F5). Si sigue sin aparecer, puede ser que el taller haya revocado la propuesta o que el historial esté vacío (no hay órdenes cargadas todavía).' },
            { pregunta: 'Puedo tener más de un vehículo', respuesta: 'Sí, los que quieras. Todos aparecen en "Mis Vehículos" en tu Mi Garaje.' },
            { pregunta: 'Qué pasa si vendo el vehículo', respuesta: 'Podés revocar el historial compartido. El vehículo queda asociado a tu cuenta (no lo podés "transferir" a otra persona todavía). Para v2 estamos trabajando en transferencia de vehículos.' },
            { pregunta: 'Cómo elimino mi cuenta', respuesta: 'Escribinos a soporte@kuatiauto.com.py. Vamos a desactivar tu cuenta y anonimizar tus datos en un plazo de 30 días, según la Ley 6534/2020.' },
            { pregunta: 'El taller cambió de dueño, qué pasa', respuesta: 'El historial sigue vinculado al establecimiento. Si el nuevo dueño usa KuatiAuto, va a ver el historial. Si no, no. Podés revocar el acceso si no querés que lo vea.' },
          ],
        },
        { tipo: 'tip', texto: 'Para cualquier problema que no esté acá, escribinos a soporte@kuatiauto.com.py con el detalle. Te respondemos en horario laboral (lunes a viernes, 8 a 18).' },
      ],
    },
  ],
};