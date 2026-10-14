// Directorio público de vibe editing. Entran los casos ya anonimizados
// (51 de 122 en la fuente del 2026-10-14), incluidos los prompts clave.
// La reserva con nombres o encargos identificables no está en este módulo.
import rawCases from './casos-vibe-coding.json';

export type Caso = {
  id: string;
  uc: string;
  n: number;
  t: string;
  s: string;
  c: string;
  tools: string[];
  tags: string[];
  hizo: string;
  esperado: string;
  saber: string;
  p: string;
  rel: string[];
  plano: string;
  clave?: boolean;
};

export const CASOS_ACTUALIZADO = '2026-10-14';
export const CASOS_CATALOGO_TOTAL = 122;

export const CATS: Record<string, string> = {
  'preparacion-y-analisis': 'Preparación y análisis del material',
  'narrativa-y-estructura': 'Narrativa y estructura',
  'edicion-de-voz': 'Edición de voz y continuidad verbal',
  'b-roll-y-planos': 'B-roll y selección de planos',
  'ritmo-ganchos-y-musica': 'Ritmo, ganchos y música',
  'encuadre-y-formatos': 'Encuadre y adaptación de formatos',
  'identidad-y-motion-graphics': 'Identidad visual y motion graphics',
  'mascaras-y-composicion': 'Máscaras, composición y efectos',
  subtitulos: 'Subtítulos y accesibilidad',
  audio: 'Mezcla y tratamiento de audio',
  color: 'Corrección de color',
  'versiones-y-entrega': 'Versiones, organización y entrega',
  'control-de-calidad': 'Control de calidad',
};

export const TOOLS: Record<string, readonly [string, string]> = {
  'ChatGPT (Codex)': ['GP', 'b-gpt'],
  'Resolve (MCP/API)': ['DR', 'b-dr'],
  Remotion: ['RM', 'b-py'],
  Transcripción: ['TR', ''],
  IntelliSearch: ['IS', ''],
  'Máscaras y composición': ['MK', ''],
  'Revisión de imagen y audio': ['RV', ''],
};

const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const CASOS: Caso[] = rawCases;

export function formatCasosFecha(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${Number(day)} ${MES[Number(month) - 1]} ${year}`;
}

export function getCaso(id: string): Caso | undefined {
  return CASOS.find((caso) => caso.id === id);
}

export function relatedCasos(caso: Caso): Caso[] {
  const byUc = new Map(CASOS.map((item) => [item.uc, item]));
  const direct = caso.rel.map((uc) => byUc.get(uc)).filter((item): item is Caso => Boolean(item));
  const sameCategory = CASOS.filter((item) => item.id !== caso.id && item.c === caso.c && !direct.includes(item));
  return [...direct, ...sameCategory].slice(0, 4);
}
