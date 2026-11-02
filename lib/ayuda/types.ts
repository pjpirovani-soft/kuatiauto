// Tipos del Centro de Ayuda.
// Cada guía (propietario, conductor, admin) se modela como un array de secciones.
// Cada sección puede tener: párrafos, pasos, tips, advertencias, tablas, FAQs, links.

export type AyudaBloque =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'pasos'; items: { titulo: string; descripcion?: string }[] }
  | { tipo: 'tip'; texto: string }
  | { tipo: 'advertencia'; texto: string }
  | { tipo: 'tabla'; headers: string[]; rows: string[][] }
  | { tipo: 'faq'; items: { pregunta: string; respuesta: string }[] }
  | { tipo: 'captura'; src: string; alt: string; caption?: string }
  | { tipo: 'link'; texto: string; href: string };

export type AyudaSeccionData = {
  id: string;
  titulo: string;
  bloques: AyudaBloque[];
};

export type AyudaGuiaData = {
  rol: 'propietario' | 'conductor' | 'admin';
  titulo: string;
  subtitulo: string;
  secciones: AyudaSeccionData[];
};

export type AyudaRolCardData = {
  rol: 'propietario' | 'conductor' | 'admin';
  titulo: string;
  descripcion: string;
  href: string;
  icon: 'propietario' | 'conductor' | 'admin';
  destacado?: boolean;
};

export type AyudaFAQData = {
  pregunta: string;
  respuesta: string;
};