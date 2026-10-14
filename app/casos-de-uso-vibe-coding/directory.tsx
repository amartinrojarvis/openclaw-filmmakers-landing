'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CASOS,
  CASOS_ACTUALIZADO,
  CASOS_CATALOGO_TOTAL,
  CATS,
  TOOLS,
  formatCasosFecha,
  type Caso,
} from '@/lib/casos-vibe-coding';
import { NewsletterForm } from './newsletter-form';
import { CasosLogo, ToolBadge } from './parts';

const BOOKING_HREF = '/#sesion';

function categoryCount(id: string) {
  return CASOS.filter((caso) => caso.c === id).length;
}

function toolCount(tool: string) {
  return CASOS.filter((caso) => caso.tools.includes(tool)).length;
}

function Filters({
  cat,
  tool,
  onCategory,
  onTool,
}: {
  cat: string;
  tool: string | null;
  onCategory: (id: string) => void;
  onTool: (name: string) => void;
}) {
  return (
    <>
      <div className="hd"><span className="lbl ln">Herramientas</span></div>
      <div className="nav-l">
        {Object.keys(TOOLS).filter((name) => toolCount(name) > 0).map((name) => (
          <button key={name} type="button" className={tool === name ? 'on' : undefined} onClick={() => onTool(name)}>
            <ToolBadge tool={name} />
            {name}
            <span className="n">{toolCount(name)}</span>
          </button>
        ))}
      </div>
      <div className="hd cat-hd"><span className="lbl ln">Categorías</span></div>
      <div className="nav-l">
        <button type="button" className={!tool && cat === 'all' ? 'on' : undefined} onClick={() => onCategory('all')}>
          Todas
          <span className="n">{CASOS.length}</span>
        </button>
        {Object.entries(CATS).filter(([id]) => categoryCount(id) > 0).map(([id, label]) => (
          <button key={id} type="button" className={!tool && cat === id ? 'on' : undefined} onClick={() => onCategory(id)}>
            {label}
            <span className="n">{categoryCount(id)}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function matchesQuery(caso: Caso, query: string) {
  const haystack = [
    caso.t,
    caso.s,
    caso.tools.join(' '),
    CATS[caso.c] ?? '',
    caso.tags.join(' '),
    caso.plano,
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

export function CasosDirectory() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [tool, setTool] = useState<string | null>(null);
  const [order, setOrder] = useState<'numero' | 'az'>('numero');
  const [scope, setScope] = useState<'all' | 'saved' | 'clave'>('all');
  const [saved, setSaved] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const updated = formatCasosFecha(CASOS_ACTUALIZADO);
  const savedSet = useMemo(() => new Set(saved), [saved]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = CASOS.filter((caso) => {
      if (cat !== 'all' && caso.c !== cat) return false;
      if (tool && !caso.tools.includes(tool)) return false;
      if (scope === 'saved' && !savedSet.has(caso.id)) return false;
      if (scope === 'clave' && !caso.clave) return false;
      if (q && !matchesQuery(caso, q)) return false;
      return true;
    });
    list.sort(order === 'numero'
      ? (a, b) => a.n - b.n
      : (a, b) => a.t.localeCompare(b.t, 'es'));
    return list;
  }, [cat, tool, order, scope, query, savedSet]);

  const starters = useMemo(() => {
    const seen = new Set<string>();
    const firsts: Caso[] = [];
    for (const caso of CASOS) {
      if (seen.has(caso.c)) continue;
      seen.add(caso.c);
      firsts.push(caso);
    }
    return firsts.slice(0, 6);
  }, []);

  const showStarters = !query.trim() && cat === 'all' && !tool && scope === 'all';
  const claveGroups = [
    {
      title: 'Proyecto en DaVinci y carpetas',
      ids: [
        'crear-un-proyecto-de-edicion-desde-una-peticion',
        'importar-y-clasificar-los-brutos',
        'organizar-el-proyecto-y-limpiar-recursos-prescindibles',
      ],
    },
    {
      title: 'Identidad desde la web',
      ids: ['aplicar-la-identidad-visual-del-cliente'],
    },
    {
      title: 'Remotion, cartelas, animación y 3D',
      ids: [
        'crear-una-cartela-final-con-informacion-de-un-evento',
        'actualizar-datos-sin-redisenar-los-grafismos',
        'crear-un-overlay-transparente-editable',
        'dividir-un-overlay-en-modulos-recortables',
        'visualizar-un-proceso-con-progreso-animado',
        'explicar-servicios-mediante-escenas-3d',
        'crear-animaciones-dentales-didacticas',
        'animar-un-logotipo-y-cerrar-un-bucle-continuo',
        'colocar-cartelas-detras-del-protagonista',
        'animar-fotografias-dentro-de-un-montaje',
      ],
    },
  ].map((group) => ({
    title: group.title,
    casos: group.ids.map((id) => CASOS.find((caso) => caso.id === id)).filter((caso): caso is Caso => Boolean(caso)),
  }));
  const claveCount = CASOS.filter((caso) => caso.clave).length;
  const filterLabel = tool || (cat === 'all' ? 'Todo' : CATS[cat]);

  const selectCategory = (id: string) => {
    setCat(id);
    setTool(null);
  };

  const selectTool = (name: string) => {
    setTool((current) => (current === name ? null : name));
    setCat('all');
  };

  return (
    <div className="frame dir">
      <aside>
        <CasosLogo />
        <div className="me">
          <img src="/casos-vibe-coding/alberto-160.jpg" alt="Alberto Martín" width={44} height={44} />
          <div>
            <b>Casos que he probado yo</b>
            <span>Alberto Martín · filmmaker e ingeniero</span>
          </div>
        </div>
        <p className="tag">Tareas reales de edición en DaVinci Resolve hechas con un agente de IA, sacadas de mis proyectos. Cada una con su prompt para que la pruebes.</p>
        <div className="side-btns">
          <a className="btn pri" href="#newsletter">Un caso cada jueves</a>
          <a className="btn" href={BOOKING_HREF}>Móntalo con Alberto</a>
        </div>
        <button className="mfilter" id="mf" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
          Filtrar <span className="mono" id="mfv">{filterLabel}</span>
        </button>
        <div className={`mpanel${filtersOpen ? ' open' : ''}`} id="mp">
          <div className="sec mobile-sec">
            <Filters cat={cat} tool={tool} onCategory={selectCategory} onTool={selectTool} />
          </div>
        </div>
        <div className="aside-hide" id="desk">
          <div className="today">
            <span>Casos publicados</span>
            <span className="mono" id="nw">{CASOS.length} de {CASOS_CATALOGO_TOTAL}</span>
          </div>
          <div className="house">
            <span className="lbl ln">De Alberto Martín</span>
            <b>Plan de implementación · 199 €/mes</b>
            <p>Cada mes dejamos funcionando un proceso de tu productora con IA. Empezamos con una llamada de 15 minutos para ver si encaja.</p>
            <a href={BOOKING_HREF}>Reservar la llamada ↗</a>
          </div>
          <div className="sec" id="filters">
            <Filters cat={cat} tool={tool} onCategory={selectCategory} onTool={selectTool} />
          </div>
          <div className="meta">
            <span id="tot">{CASOS.length}</span> casos · actualizado <span id="upd">{updated}</span>
            <br />
            Fuente: proyectos de edición propios
            <br />
            <Link href="/">Inicio</Link>
            {' · '}
            <a href="#newsletter">Newsletter</a>
            {' · '}
            <Link href="/privacidad">Privacidad</Link>
          </div>
        </div>
      </aside>
      <main>
        <div className="top">
          <div className="srow">
            <label className="search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={searchRef}
                id="q"
                type="search"
                placeholder="Buscar casos"
                aria-label="Buscar casos"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="kbd">⌘K</span>
            </label>
            <div className="seg">
              <button type="button" className={order === 'numero' ? 'on' : undefined} onClick={() => setOrder('numero')}>Nº</button>
              <button type="button" className={order === 'az' ? 'on' : undefined} onClick={() => setOrder('az')}>A–Z</button>
            </div>
          </div>
          <div className="chips" id="chips">
            <button type="button" className={`chip${scope === 'all' ? ' on' : ''}`} onClick={() => setScope('all')}>Todos {CASOS.length}</button>
            <button type="button" className={`chip clave${scope === 'clave' ? ' on' : ''}`} onClick={() => setScope('clave')}>Prompts clave {claveCount}</button>
            <button type="button" className={`chip${scope === 'saved' ? ' on' : ''}`} onClick={() => setScope('saved')}>Guardados {saved.length}</button>
          </div>
        </div>

        {showStarters ? (
          <section className="clave-blk" id="clave" aria-labelledby="clave-title">
            <h2 className="sth" id="clave-title"><span className="st">Prompts clave</span></h2>
            <p className="clave-intro">Con estos dejo el proyecto preparado, saco la identidad de la marca y monto cartelas, animaciones y motion.</p>
            {claveGroups.map((group) => (
              <div className="clave-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="clave-grid">
                  {group.casos.map((caso) => (
                    <Link className="tc" key={caso.id} href={`/casos-de-uso-vibe-coding/${caso.id}`}>
                      <span className="v"><span className="plano">{caso.plano}</span></span>
                      <h3>{caso.t}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {showStarters ? (
          <section className="blk" id="trendBlk">
            <h2 className="sth"><span className="st">Para empezar</span></h2>
            <div className="trend" id="trend">
              {starters.map((caso) => (
                <Link className="tc" key={caso.id} href={`/casos-de-uso-vibe-coding/${caso.id}`}>
                  <span className="v"><span className="plano">{caso.plano}</span></span>
                  <h3>{caso.t}</h3>
                  <span className="tcode">{CATS[caso.c]}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="feed">
          <div className="fh">
            <h2 id="fht"><span className="st">{visible.length} {visible.length === 1 ? 'caso' : 'casos'}</span></h2>
            <span className="lbl ln" id="fhl">{order === 'numero' ? 'Por número de caso' : 'De la A a la Z'}</span>
          </div>
          <p className="sub" id="fhs">Ordenados como en el catálogo. Entra en cualquiera para ver el prompt.</p>
          <div id="list">
            {visible.map((caso) => (
              <div className="row" key={caso.id}>
                <ToolBadge tool={caso.tools[1] || caso.tools[0]} />
                <div>
                  <div className="pl"><span className="plano">{caso.plano}</span></div>
                  <h3><Link href={`/casos-de-uso-vibe-coding/${caso.id}`}>{caso.t}</Link></h3>
                  <p>{caso.s}</p>
                  <div className="rm">
                    <span className="tl">{caso.tools.join(' + ')}</span>
                    <span>· {CATS[caso.c]}</span>
                  </div>
                  <div className="acts">
                    <Link className="btn sm" href={`/casos-de-uso-vibe-coding/${caso.id}`}>Ver prompt</Link>
                    <button className="btn sm" type="button">Compartir</button>
                  </div>
                </div>
                <div className="side">
                  <button
                    className={`save${savedSet.has(caso.id) ? ' on' : ''}`}
                    type="button"
                    onClick={() => setSaved((current) => (
                      current.includes(caso.id) ? current.filter((id) => id !== caso.id) : [...current, caso.id]
                    ))}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M6 3h12v18l-6-4-6 4z" />
                    </svg>
                    Guardar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="empty" id="empty" style={{ display: visible.length ? 'none' : 'block' }}>Nada con ese filtro. Prueba otra palabra.</p>
        </section>

        <NewsletterForm />
        <p className="foot">© 2026 Alberto Martín · IA para Filmmakers</p>
      </main>
    </div>
  );
}
