import type { AyudaRolCardData, AyudaFAQData } from './types';

export const HUB_TITULO = 'Centro de Ayuda';

export const HUB_SUBTITULO =
  'Guías paso a paso para aprovechar KuatiAuto al máximo. Elegí tu rol para empezar.';

export const HUB_FUNDADOR = {
  nombre: 'Pedro J. Pirovani',
  rol: 'Fundador de KuatiAuto',
  portfolio: 'https://portafolio-pjpirovani.vercel.app',
  whatsapp: '+595 986 207 595',
  whatsappLink: 'https://wa.me/595986207595?text=Hola%2C%20tengo%20una%20consulta%20sobre%20KuatiAuto',
  email: 'kuatiauto.soporte@gmail.com',
  horario: 'Lunes a viernes, 8:00 a 18:00 (hora Paraguay)',
};

export const HUB_ROLES: AyudaRolCardData[] = [
  {
    rol: 'propietario',
    titulo: 'Propietario del lubricentro',
    descripcion:
      'Gestioná clientes, vehículos, órdenes de trabajo y tu catálogo de servicios. Todo lo que necesitás para operar tu lubricentro día a día.',
    href: '/ayuda/propietario',
    icon: 'propietario',
    destacado: true,
  },
  {
    rol: 'conductor',
    titulo: 'Conductor',
    descripcion:
      'Consultá el historial de mantenimiento de tus vehículos, autorizá o revocá el acceso del taller a tu información y controlá tus datos.',
    href: '/ayuda/conductor',
    icon: 'conductor',
  },
  {
    rol: 'admin',
    titulo: 'Administrador de la plataforma',
    descripcion:
      'Administrá empresas, usuarios y el catálogo global. Todo lo que necesitás para mantener KuatiAuto funcionando.',
    href: '/ayuda/admin',
    icon: 'admin',
  },
];

export const HUB_FAQS: AyudaFAQData[] = [
  {
    pregunta: '¿Qué es KuatiAuto?',
    respuesta:
      'KuatiAuto es un sistema de gestión para lubricentros y talleres de mantenimiento preventivo en Paraguay. Te permite gestionar clientes, vehículos, órdenes de trabajo, catálogo de servicios y productos, y también tenés un directorio público donde los conductores pueden encontrar tu lubricentro.\n\nAdemás, cada conductor tiene su "garage digital" donde puede ver el historial de mantenimiento de sus vehículos, si el taller lo autoriza.',
  },
  {
    pregunta: '¿Cuánto cuesta usar KuatiAuto?',
    respuesta:
      'KuatiAuto es gratuito en su plan inicial. No tiene costo mensual ni comisiones por trabajo. Está pensado para que lubricentros pequeños y medianos de Paraguay puedan digitalizar su operación sin invertir en software caro.',
  },
  {
    pregunta: '¿Necesito instalar algo?',
    respuesta:
      'No. KuatiAuto funciona 100% en el navegador. Podés usarlo desde cualquier computadora, tablet o celular con conexión a internet. También podés "instalarlo" como app en tu celular (PWA) para tenerlo en el inicio, pero no es obligatorio.',
  },
  {
    pregunta: '¿Mis datos están seguros?',
    respuesta:
      'Sí. Usamos Supabase (PostgreSQL) con Row Level Security (RLS) habilitado en todas las tablas. Eso significa que un lubricentro no puede ver los datos de otro. Además, todas las conexiones son HTTPS y las contraseñas están encriptadas.\n\nCumplimos con la Ley 6534/2020 de Paraguay sobre protección de datos personales. Podés leer más en nuestra página de privacidad.',
  },
  {
    pregunta: '¿Puedo tener varias sucursales?',
    respuesta:
      'Sí. Una misma empresa puede tener varios establecimientos (sucursales). Cada establecimiento puede publicarse o no en el directorio público de forma independiente. Ideal si tenés un lubricentro principal y una sucursal, o si tenés distintos puntos de atención.',
  },
  {
    pregunta: '¿Cómo aparece mi lubricentro en el directorio?',
    respuesta:
      'Desde el menú "Establecimientos" cargás los datos de tu local (dirección, teléfono, horarios, servicios) y marcás "Publicar en directorio". Una vez publicado, los conductores que entren a kuatiauto.vercel.app/directorio van a poder encontrarte por ciudad, servicio o cercanía.',
  },
  {
    pregunta: '¿Cómo invito a un conductor a ver su historial?',
    respuesta:
      'Desde la ficha de un vehículo, click en "Proponer historial" y ingresá el email del conductor. El conductor recibe una notificación y puede aceptar o rechazar. Si acepta, ve el historial completo de mantenimiento de ese vehículo. El conductor puede revocar el acceso cuando quiera.',
  },
  {
    pregunta: '¿Qué pasa si un cliente se va de mi lubricentro?',
    respuesta:
      'Los datos del cliente y del vehículo quedan en tu base, asociados a tu empresa. Un conductor puede revocar el acceso a su historial, pero los datos operativos de tu lubricentro (órdenes, servicios, productos) siguen siendo tuyos. Podés desactivar (soft delete) clientes y vehículos en cualquier momento.',
  },
  {
    pregunta: '¿Puedo exportar mis datos?',
    respuesta:
      'La exportación está planificada para una versión futura (v2). Por ahora, los datos viven en Supabase y podés solicitarlos por email a soporte. Estamos trabajando en un sistema de exportación a CSV/Excel.',
  },
  {
    pregunta: '¿Cómo reporto un bug o sugiero una mejora?',
    respuesta:
      'Escribinos a kuatiauto.soporte@gmail.com o usá el link de "Contacto" al final de esta página. Si es un bug, contanos:\n\n- Qué intentaste hacer.\n- Qué pasó (con captura de pantalla si podés).\n- Qué esperabas que pasara.\n- Navegador y dispositivo.\n\nCuanto más detalle, mejor podemos ayudarte.',
  },
  {
    pregunta: '¿Tienen una versión para celular?',
    respuesta:
      'Sí. KuatiAuto es responsive: funciona en celular, tablet y computadora. Además, podés agregarla a la pantalla de inicio de tu celular (PWA) para que se abra como una app. En Android: menú del navegador → "Instalar app". En iPhone: botón compartir → "Agregar a inicio".',
  },
  {
    pregunta: '¿Cuánto tiempo se guardan mis datos?',
    respuesta:
      'Los datos operativos (clientes, vehículos, órdenes) se guardan mientras tu cuenta esté activa. Si eliminás tu empresa, se marca como desactivada y se anonimiza en un plazo de 30 días. Los logs de auditoría se guardan 1 año (por seguridad).',
  },
];