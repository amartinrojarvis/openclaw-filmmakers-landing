import { CATS, type Caso } from './casos-vibe-coding';

// Contenido SEO adicional por caso. Solo los casos con entrada aquí se indexan.
export type CasoSeo = {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  paraQue: string[];
  requisitos: string[];
  queEsperar: string[];
  docs: { href: string; label: string }[];
  faq: { q: string; a: string }[];
  published: string;
};

export const CASOS_SEO: Record<string, CasoSeo> = {
  'conectar-filmcraft-con-codex-mcp': {
    title: 'Conectar FilmCraft con Codex por MCP: prompt paso a paso',
    description:
      'Prompt para que Codex conecte FilmCraft por MCP en modo bridge: CLI compatible, puente de control, registro y lanzador. Listo para editar vídeo con IA.',
    keywords: [
      'FilmCraft MCP',
      'conectar FilmCraft con Codex',
      'FilmCraft Codex',
      'filmcraft-cli',
      'MCP para edición de vídeo',
      'edición de vídeo con IA',
      'Codex MCP',
      'editor de vídeo open source con IA',
    ],
    intro:
      'FilmCraft es un editor de vídeo no lineal de código abierto, escrito en Rust, pensado para que lo controlen agentes de IA. Trae su propio servidor MCP (filmcraft-cli mcp). Con este prompt le pides a Codex que deje ese servidor conectado a la aplicación abierta, comprobado y listo, antes de tocar ningún vídeo.',
    paraQue: [
      'Que Codex pueda leer tu proyecto de FilmCraft y lanzar comandos sobre la aplicación que tienes abierta (modo bridge).',
      'Dejar la configuración hecha una sola vez: CLI, puerto, registro del MCP y un lanzador para las próximas sesiones.',
      'Evitar perder trabajo: el prompt obliga a confirmar que el proyecto está guardado antes de cerrar o reiniciar FilmCraft.',
    ],
    requisitos: [
      'FilmCraft instalado (macOS, Windows o Linux).',
      'ChatGPT con Codex instalado en el mismo ordenador.',
      'filmcraft-cli: en Windows y Linux viene con el instalador; en macOS se descarga aparte desde las releases oficiales.',
      'Un puerto local libre para el puente (la documentación usa el 9876).',
    ],
    queEsperar: [
      'Las versiones de FilmCraft y de la CLI que ha usado.',
      'Si el puente responde y el MCP «filmcraft» queda registrado en Codex.',
      'Dónde está el lanzador y cómo usarlo.',
      'Si tienes que reiniciar Codex o abrir un chat nuevo para ver las herramientas.',
    ],
    docs: [
      { href: 'https://github.com/storytold/filmcraft/blob/main/docs/agents.md', label: 'Documentación oficial para agentes (docs/agents.md)' },
      { href: 'https://github.com/storytold/filmcraft', label: 'Repositorio oficial de FilmCraft' },
    ],
    faq: [
      {
        q: '¿Qué es el MCP de FilmCraft?',
        a: 'Es el servidor que arranca filmcraft-cli mcp. Expone herramientas para inspeccionar el proyecto y la secuencia, ejecutar comandos, importar medios y capturar fotogramas, de forma que un agente como Codex pueda trabajar dentro del editor.',
      },
      {
        q: '¿Qué diferencia hay entre el modo headless y el modo bridge?',
        a: 'El modo headless trabaja con una sesión interna sin ventana. El modo bridge controla la aplicación de escritorio que tienes abierta, arrancada con filmcraft --control 9876 y conectada con filmcraft-cli mcp --bridge 127.0.0.1:9876. Este prompt configura el modo bridge.',
      },
      {
        q: '¿Dónde está filmcraft-cli?',
        a: 'Según la documentación oficial, en Windows se instala por defecto en C:\\Program Files\\FilmCraft\\filmcraft-cli.exe, en Linux en /usr/bin/filmcraft-cli y en macOS se descarga como un zip aparte en las releases.',
      },
      {
        q: '¿El prompt edita mi vídeo?',
        a: 'No. Solo prepara la conexión y la verifica. La edición empieza en una sesión posterior.',
      },
      {
        q: '¿Tengo que reiniciar Codex?',
        a: 'A veces sí: las herramientas MCP nuevas pueden no aparecer en el chat abierto. El prompt pide a Codex que deje todo preparado y te avise si hace falta reiniciar o abrir un chat nuevo.',
      },
    ],
    published: '2026-10-16',
  },
};

export function getCasoSeo(id: string): CasoSeo | undefined {
  return CASOS_SEO[id];
}

// Las fichas sin entrada en CASOS_SEO se quedaban sin ningún esquema de
// contenido: solo la de FilmCraft emitía TechArticle. Este nodo de respaldo
// cubre las 51 restantes con datos que YA existen en casos-vibe-coding.json
// (título, resumen, categoría, herramientas, tags). No se añade ninguna fecha:
// CASOS_ACTUALIZADO es la del catálogo completo, no la de publicación de cada
// caso, y ponerla sería inventársela.
export function baseCasoNodes(caso: Caso, url: string, site: string, shareImage: string): object[] {
  const author = { '@type': 'Person', name: 'Alberto Martín', url: site, jobTitle: 'Filmmaker' };
  const publisher = { '@type': 'Organization', name: 'IA para Filmmakers', url: site };
  const where = caso.tools.includes('Resolve (MCP/API)')
    ? 'en DaVinci Resolve con ChatGPT (Codex)'
    : 'con ChatGPT (Codex)';

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${caso.t} · ${caso.plano}`,
      description: `${caso.s} Caso real de edición con IA ${where}, con el prompt listo para copiar.`,
      inLanguage: 'es-ES',
      url,
      mainEntityOfPage: url,
      image: `${site}${shareImage}`,
      author,
      publisher,
      articleSection: CATS[caso.c] ?? caso.c,
      keywords: [...caso.tags, ...caso.tools].join(', '),
      articleBody: [caso.hizo, caso.saber].filter(Boolean).join('\n\n'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${caso.t} con IA`,
      description: caso.s,
      inLanguage: 'es-ES',
      url,
      tool: caso.tools.map((name) => ({ '@type': 'HowToTool', name })),
      // Sin url por paso: las secciones "Que hice / Resultado esperado / Que
      // conviene comprobar" no tienen id en la plantilla, y enlazar anclajes
      // inexistentes es peor que no enlazar.
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Qué se hizo', text: caso.hizo },
        { '@type': 'HowToStep', position: 2, name: 'Resultado esperado', text: caso.esperado },
        { '@type': 'HowToStep', position: 3, name: 'Qué conviene comprobar', text: caso.saber },
      ],
    },
  ];
}
