import type { AyudaGuiaData } from './types';
import { PROPIETARIO_SECCIONES_1 } from './propietario-parte1';
import { PROPIETARIO_SECCIONES_2 } from './propietario-parte2';

export const GUIA_PROPIETARIO: AyudaGuiaData = {
  rol: 'propietario',
  titulo: 'Guía del propietario',
  subtitulo: 'Todo lo que necesitás para gestionar tu lubricentro con KuatiAuto.',
  secciones: [...PROPIETARIO_SECCIONES_1, ...PROPIETARIO_SECCIONES_2],
};