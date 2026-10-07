'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { InstagramEmbed } from '@/components/InstagramEmbed';
import { AnalyticsEvents, trackEvent } from '@/components/Analytics';
import { ASESORIA_PAYMENT_LINKS } from '@/lib/stripe';

type Plan = 'session' | 'subscription';

/**
 * Landing de campaña /vibe-editing.
 * Identidad compartida con la home (negro cálido #171612, crema #f2eee5,
 * naranja #ff5a2a). La mensual es la oferta principal; la sesión puntual
 * permanece legible y contratable. Los checkouts reutilizan los Payment Links
 * de lib/stripe para no divergir de la home.
 */

function trackCheckoutClick(location: string, plan: Plan) {
  const items = plan === 'subscription'
    ? [{ id: 'suscripcion-mensual-199', name: 'Acompañamiento mensual · 199 €/mes', price: 199 }]
    : [{ id: 'asesoria-ia-audiovisual-90m', name: 'Sesión puntual de vibe editing · 75 €', price: 75 }];
  AnalyticsEvents.beginCheckout(items);
  AnalyticsEvents.clickCTA(location, plan === 'subscription' ? 'Empezar el acompañamiento' : 'Reservar una sesión');
}

const delegatedTasks = [
  [
    'Preparar y encontrar material',
    'Transcribir lo que se ha dicho, buscar planos por contenido y organizar el material en bin o carpetas antes de tocar el timeline.',
  ],
  [
    'Preparar primeros cortes',
    'Una selección inicial útil: silencios largos, muletillas y tomas repetitivas fuera. Tú revisas y decides qué se queda.',
  ],
  [
    'Pedir cambios concretos',
    'Describir el ajuste que necesitas —ritmo, estructura, un corte concreto—, revisar el resultado y repetir hasta que quede como lo planteas.',
  ],
];

const firstMonthItems = [
  'Diagnóstico y construcción del primer flujo de edición, 90 minutos',
  '4 sesiones online de 1 hora al mes, desde el primer mes',
  'Hasta 4 consultas por email al mes, respuesta en 48 h laborables',
  'Mantenimiento y ajuste de lo ya montado conforme lo usas en proyectos reales',
];

const renewalItems = [
  'Las mismas 4 sesiones de 1 hora cada mes, sin permanencia',
  'Se sigue trabajando sobre tus proyectos; no hay módulos grabados',
  'Se mantienen las consultas por email y el aviso de cambios relevantes en IA',
  'Baja al final de cada mes desde el portal de Stripe',
];

const faqs = [
  {
    question: '¿Necesito saber programar?',
    answer: 'No. Se trabaja con instrucciones en lenguaje natural y con la configuración de las herramientas. Ayuda manejar Resolve con soltura; no hace falta escribir código.',
  },
  {
    question: '¿Qué equipo y suscripciones necesito?',
    answer: 'Un equipo razonablemente moderno con DaVinci Resolve (Studio es la vía directa para sus funciones de IA; con la versión gratuita ajustamos el flujo a lo que tu edición permita) y acceso a ChatGPT con la última versión de escritorio o el conector compatible que toque en tu caso. Las suscripciones de terceros no están incluidas en el precio.',
  },
  {
    question: '¿Trabajamos con mi material?',
    answer: 'Sí, y es lo recomendado: proyectos reales tuyos, con material que puedas compartir en confianza. Lo que necesites mantener privado se sustituye por material equivalente o se trabaja sobre descripciones del caso.',
  },
  {
    question: '¿Qué puedo conseguir en una sesión?',
    answer: 'Dejar funcionando un flujo para una tarea concreta de tu edición, con instrucciones y criterios de revisión que puedas repetir sin Alberto delante. La IA propone cambios; tú validas el montaje.',
  },
  {
    question: '¿Qué cambia con el acompañamiento mensual?',
    answer: 'La sesión resuelve una tarea. La mensual repite el ciclo cada mes durante el tiempo que la mantengas: se siguen trabajando tus proyectos reales, se resuelve lo que se atasca y el flujo mejora conforme lo usas. La edición es la prioridad inicial; otros procesos de tu negocio pueden incorporarse después según tus prioridades.',
  },
  {
    question: '¿La IA edita sola?',
    answer: 'No. Hay tareas que se pueden delegar (transcribir, localizar material, una primera criba de cortes) y decisiones que no lo son: selección, ritmo y acabado. La sesión enseña a separar unas de otras y a revisar lo que la máquina propone.',
  },
  {
    question: '¿Qué herramientas se usan?',
    answer: 'El MCP nativo de Resolve, la transcripción de Resolve y ChatGPT, con auxiliares según tu caso (ffmpeg, Whisper u otros). Todo se montan contigo, sin instalar nada que no puedas mantener tú.',
  },
  {
    question: '¿Puedo cancelar el acompañamiento?',
    answer: 'Sí, sin permanencia: baja desde el portal de Stripe y la renovación deja de cobrarse al final del mes en curso. Las condiciones completas están en el enlace de condiciones de contratación.',
  },
  {
    question: '¿Qué pasa si mi equipo no es compatible?',
    answer: 'Antes de pagar, la página resume los requisitos. Si tras el briefing tu equipo o tu edición no admiten el flujo previsto, se te lo decimos por email antes de la sesión y se busca la alternativa más próxima (versión de Resolve, herramientas auxiliares o un flujo parcial).',
  },
];

function TimelineScheme() {
  return (
    <figure className="border border-[#f2eee5]/15 bg-[#f2eee5]/[0.03] p-6 sm:p-8" aria-label="Esquema del proceso de delegación">
      <svg viewBox="0 0 640 150" className="w-full text-[#f2eee5]/70" fill="none" aria-hidden="true" focusable="false">
        <path d="M16 24h608" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 7" />
        <path d="M16 75h608" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 7" />
        <path d="M16 126h608" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 7" />
        <rect x="40" y="14" width="150" height="20" fill="#ff5a2a" fillOpacity="0.85" />
        <rect x="210" y="14" width="96" height="20" fill="currentColor" fillOpacity="0.22" />
        <rect x="330" y="14" width="176" height="20" fill="currentColor" fillOpacity="0.12" />
        <rect x="120" y="65" width="180" height="20" fill="#ff5a2a" fillOpacity="0.6" />
        <rect x="330" y="65" width="120" height="20" fill="currentColor" fillOpacity="0.22" />
        <rect x="60" y="116" width="90" height="20" fill="currentColor" fillOpacity="0.12" />
        <rect x="240" y="116" width="220" height="20" fill="#ff5a2a" fillOpacity="0.85" />
      </svg>
      <figcaption className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#f2eee5]/45">
        <span className="text-[#ff5a2a]">Esquema</span> · ilustración del proceso, no una demostración grabada
      </figcaption>
    </figure>
  );
}

function MobileStickyCTA({ hiddenAtModalities }: { hiddenAtModalities: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 720 && !hiddenAtModalities);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [hiddenAtModalities]);

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f2eee5]/20 bg-[#171612]/97 px-4 py-3 shadow-[0_-10px_35px_rgba(0,0,0,.35)] backdrop-blur md:hidden" aria-label="Reserva rápida">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-[#ff5a2a]">Delega la edición</p>
          <p className="mt-1 text-sm font-black">Sesión desde 75 € · mensual 199 €/mes</p>
        </div>
        <a href="#modalidades" onClick={() => AnalyticsEvents.clickCTA('mobile_sticky', 'Ver modalidades')} className="inline-flex min-h-12 shrink-0 items-center gap-2 bg-[#ff5a2a] px-4 py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-[#171612]">
          Ver modalidades <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}

export function VibeEditingLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modalitiesVisible, setModalitiesVisible] = useState(false);

  // Medición de campaña: se reutiliza trackEvent (respeta el consentimiento de
  // analítica) y cada página ya recibe su pageview automático de GA4/Meta.
  useEffect(() => {
    trackEvent('landing_view', { page: 'vibe_editing' });
  }, []);

  // El aviso de cookies vive en el layout (PublicTrackingAndConsent); la barra
  // móvil se oculta al llegar al bloque de modalidades para no taparlo.
  useEffect(() => {
    const pricing = document.getElementById('modalidades');
    if (!pricing) return;
    let viewed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting === true;
        setModalitiesVisible(visible);
        if (visible && !viewed) {
          viewed = true;
          trackEvent('modalities_view', { section: 'modalidades' });
        }
      },
      { rootMargin: '-20% 0px -20% 0px' },
    );
    observer.observe(pricing);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#171612] pb-20 text-[#f2eee5] md:pb-0">
      <MobileStickyCTA hiddenAtModalities={modalitiesVisible} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#f2eee5]/15 px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12">
        <div className="relative mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1.25fr_.55fr] lg:gap-20 lg:items-end">
          <div>
            <p className="inline-flex items-center gap-3 rounded-full border border-[#ff5a2a]/40 bg-[#ff5a2a]/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5a2a] opacity-60" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff5a2a]" /></span>
              Vibe editing · IAF
            </p>
            <h1 className="mt-7 max-w-[16ch] text-balance text-[clamp(3.4rem,7.5vw,8rem)] font-black leading-[0.84] tracking-[-0.07em]">
              <span className="block overflow-hidden pb-1"><span className="block [animation:editorial-reveal_0.65s_both_cubic-bezier(0.22,1,0.36,1)]">Delega la edición.</span></span>
              <em className="font-editorial mt-3 block font-normal tracking-[-0.04em] text-[#ff5a2a] [animation:editorial-reveal_0.65s_0.18s_both_cubic-bezier(0.22,1,0.36,1)]">Sin contratar a nadie.</em>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#f2eee5]/68 sm:text-xl">
              Enseño a delegar trabajo de edición en Resolve y ChatGPT, con tu material, hasta que el flujo trabaje solo en tus entregas.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#modalidades" onClick={() => AnalyticsEvents.clickCTA('hero', 'Quiero aprender a delegar')} className="group inline-flex min-h-14 items-center justify-center gap-4 border border-[#ff5a2a] bg-[#ff5a2a] px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#171612] transition-colors hover:bg-[#f2eee5]">
                Quiero aprender a delegar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a href="#ejemplo" className="inline-flex min-h-14 items-center gap-2 px-2 text-xs font-bold uppercase tracking-[0.1em] text-[#f2eee5]/60 transition-colors hover:text-[#ff5a2a]">
                Ver un ejemplo <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2eee5]/45">
              Una sesión para empezar. Acompañamiento mensual para seguir avanzando.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#f2eee5]/55">
              Necesitas Resolve (Studio recomendado para sus funciones de IA) y ChatGPT en un equipo que los mueva con soltura. Requisitos completos, en <a href="#modalidades" className="text-[#ff5a2a] underline underline-offset-4">modalidades y requisitos</a>.
            </p>
          </div>
          <figure className="relative mx-auto w-full max-w-sm lg:mx-0">
            <span className="absolute -inset-2 -z-10 border border-[#ff5a2a]/25" aria-hidden="true" />
            <span className="absolute -bottom-3 left-4 -z-10 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-[#f2eee5]/35 sm:block">IAF · 1/1</span>
            <Image
              src="/perfil-alberto-v2.jpg"
              alt="Alberto Martín trabajando con una cámara de vídeo"
              width={720}
              height={900}
              className="aspect-[4/5] w-full border border-[#f2eee5]/15 object-cover grayscale-[20%] contrast-[1.04]"
            />
            <figcaption className="flex justify-between border-x border-b border-[#f2eee5]/15 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#f2eee5]/45">
              <span className="italic normal-case tracking-normal">Lo que queda en el timeline es una decisión, no un render.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Marquee de tareas delegables */}
      <div className="relative overflow-hidden border-b border-[#f2eee5]/15 bg-[#ff5a2a] py-3.5 text-[#171612] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-10 before:bg-[#171612]/85 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-10 after:bg-[#171612]/85" aria-hidden="true">
        <div className="w-max whitespace-nowrap pl-10 font-mono text-[11px] font-bold uppercase tracking-[0.22em] opacity-95 [animation:marquee_38s_linear_infinite] motion-reduce:animate-none">
          {Array.from({ length: 2 }, (_, pass) => (
            <span key={pass}>
              {['Transcribir lo que se ha dicho', 'Buscar planos por contenido', 'Organizar el material en bin', 'Silencios y muletillas fuera', 'Versiones de un corte', 'Primera criba antes de tu revisión'].map((item) => (
                <span key={item} className="mx-4">«{item}»</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Ejemplo de resultado */}
      <section id="ejemplo" className="border-b border-[#f2eee5]/15 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
              <span className="h-px w-9 bg-current" /> Ejemplo real
            </p>
            <h2 className="font-editorial mt-5 text-balance text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.05em]">
              Mira lo que se puede hacer.
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-[#f2eee5]/62">
              Promoción para un cliente real, con entrevistas y clases: el tipo de encargo donde más tiempo se va en seleccionar, cribar y volver a mirar tomas. En la sesión se trabaja con material así, no con ejercicios de laboratorio.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#f2eee5]/45">
              Mientras el reproductor no esté aceptado en el aviso de cookies, o si Instagram no lo sirve, usa «Ver en Instagram»: siempre funciona.
            </p>
            <div className="mt-10 md:hidden">
              <InstagramEmbed shortcode="DeEzWSoI7qJ" title="Reel de ejemplo: promoción con material hablado, editado por Alberto Martín" onPlay={() => trackEvent('demo_play', { section: 'ejemplo' })} />
            </div>
          </div>
          <div className="grid content-start gap-10">
            <div className="hidden md:block">
              <InstagramEmbed shortcode="DeEzWSoI7qJ" title="Reel de ejemplo: promoción con material hablado, editado por Alberto Martín" onPlay={() => trackEvent('demo_play', { section: 'ejemplo' })} />
            </div>
            <TimelineScheme />
            <div className="border border-[#f2eee5]/15 bg-[#f2eee5]/[0.03] p-6 sm:p-8">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Demostración del proceso · pendiente de grabación</p>
              <h3 className="mt-3 font-editorial text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Instrucciones → cambios en Resolve → revisión.</h3>
              <p className="mt-4 leading-7 text-[#f2eee5]/62">
                En la sesión ves el ciclo completo con tu material: das la instrucción, observas qué cambia en el timeline y decides qué se queda. Cuando grabemos la demostración real, se publica en este bloque; el esquema solo ilustra el proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué delegar */}
      <section id="delegar" className="relative scroll-mt-24 overflow-hidden border-b border-[#f2eee5]/15 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="pointer-events-none absolute -top-24 right-0 select-none text-[24vw] font-black leading-none tracking-[-0.06em] text-[#f2eee5]/[0.03] lg:text-[19vw]" aria-hidden="true">
          DELEGAR
        </div>
        <div className="relative mx-auto max-w-[90rem]">
          <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
            <span className="h-px w-9 bg-current" /> Qué se delega
          </p>
          <h2 className="mt-6 max-w-4xl text-balance text-[clamp(2.6rem,5.5vw,5.6rem)] font-black leading-[0.88] tracking-[-0.06em]">
            Menos tareas repetitivas. <em className="font-editorial font-normal italic tracking-[-0.02em] text-[#ff5a2a]">Menos cero absoluto.</em>
          </h2>
          <p className="mt-6 max-w-2xl leading-7 text-[#f2eee5]/62">
            Estas tres tareas son el punto de partida del flujo. La sesión se ajusta a tu caso y a las versiones de Resolve y ChatGPT que uses, con sus dependencias reales explicadas antes de empezar.
          </p>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {delegatedTasks.map(([title, text], index) => (
              <li key={title} className="group relative overflow-hidden border border-[#f2eee5]/15 bg-[#f2eee5]/[0.03] p-6 transition-colors duration-300 hover:border-[#ff5a2a]/60 hover:bg-[#f2eee5]/[0.06]">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Delegable · {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-lg font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#f2eee5]/55">{text}</p>
                <ArrowRight className="absolute -bottom-4 -right-3 h-16 w-16 rotate-[-45deg] text-[#ff5a2a] opacity-[0.05] transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-1 group-hover:opacity-25" aria-hidden="true" />
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-xs leading-5 text-[#f2eee5]/45">
            Lo que no se delega: selección, ritmo y acabado siguen siendo tuyos. Aquí «mejorar la calidad» significa disponer de más tiempo y atención para revisar el montaje, no esperar un resultado perfecto de la máquina.
          </p>
        </div>
      </section>

      {/* Por qué acompañamiento + Alberto */}
      <section className="border-b border-[#f2eee5]/15 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
              <span className="h-px w-9 bg-current" /> Continuidad
            </p>
            <h2 className="mt-5 max-w-[22ch] font-editorial text-balance text-[clamp(2.2rem,4.4vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              Aprenderlo es el primer paso. Usarlo en tu trabajo es lo que importa.
            </h2>
            <p className="mt-6 leading-7 text-[#f2eee5]/62">
              Una sesión te da una tarea concreta. El acompañamiento mantiene el flujo vivo: se siguen trabajando tus proyectos, se resuelve lo que se atasca y el método mejora conforme lo usas.
            </p>
            <ul className="mt-8 grid gap-3 text-sm font-bold uppercase tracking-[0.06em] text-[#f2eee5]/75">
              <li className="border-l-2 border-[#ff5a2a] pl-4">Tu material</li>
              <li className="border-l-2 border-[#ff5a2a] pl-4">Dudas reales</li>
              <li className="border-l-2 border-[#ff5a2a] pl-4">Avance práctico</li>
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
              <span className="h-px w-9 bg-current" /> Quién te lo enseña
            </p>
            <h2 className="mt-5 max-w-[24ch] font-editorial text-balance text-[clamp(2.2rem,4.4vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              Te lo enseña alguien que también tiene que entregar vídeos.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-[1.1fr_1fr] sm:items-start">
              <div>
                <p className="leading-7 text-[#f2eee5]/62">
                  Soy Alberto Martín, filmmaker e ingeniero informático. Uso estas herramientas en mi trabajo y te enseño a aplicarlas a tus propios proyectos.
                </p>
                <p className="mt-5 border-l-2 border-[#ff5a2a] pl-4 font-editorial text-lg italic leading-7 text-[#f2eee5]/75">
                  «Es el mayor ahorro de tiempo que estoy experimentando como filmmaker.»
                  <span className="mt-2 block font-mono text-[9px] font-bold uppercase not-italic tracking-[0.18em] text-[#f2eee5]/40">— Alberto Martín, sobre su propio flujo de trabajo</span>
                </p>
              </div>
              <figure>
                <Image
                  src="/alberto-camara-escaleras.webp"
                  alt="Alberto Martín con su cámara"
                  width={640}
                  height={800}
                  loading="lazy"
                  className="aspect-[4/5] w-full border border-[#f2eee5]/15 object-cover grayscale-[20%] contrast-[1.04]"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section id="modalidades" className="scroll-mt-24 border-b border-[#f2eee5]/15 bg-[#ff5a2a] px-5 py-20 text-[#171612] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <header className="grid gap-8 border-b border-[#171612]/55 pb-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Modalidades</p>
            <div>
              <h2 className="max-w-4xl text-balance text-[clamp(3rem,6.5vw,7rem)] font-black leading-[0.86] tracking-[-0.07em]">
                Dos caminos. El mismo punto de partida.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#171612]/68">
                Las dos se montan sobre tu edición real. La mensual da continuidad al flujo; la sesión resuelve una prioridad concreta.
              </p>
            </div>
          </header>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
            {/* Opción principal: mensual */}
            <article className="order-first border-[#171612] bg-[#171612] p-6 text-[#f2eee5] sm:p-9">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Para aplicarlo a tu trabajo</p>
              <h3 className="mt-3 font-editorial text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Acompañamiento mensual</h3>
              <p className="mt-3 text-sm leading-6 text-[#f2eee5]/62">Empezamos por tu edición y seguimos contigo hasta que el flujo forme parte de tu día a día.</p>
              <p className="mt-6 text-3xl font-black tracking-[-0.04em]">199 €<span className="text-base font-bold text-[#f2eee5]/55">/mes · precio final, sin permanencia</span></p>
              <div className="mt-7 border-t border-[#f2eee5]/15 pt-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Qué incluye el primer mes</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#f2eee5]/72">{firstMonthItems.map((item) => <li key={item} className="flex gap-2"><span className="mt-[2px] text-[#ff5a2a]" aria-hidden="true">—</span>{item}</li>)}</ul>
                <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Qué incluye cada renovación</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#f2eee5]/72">{renewalItems.map((item) => <li key={item} className="flex gap-2"><span className="mt-[2px] text-[#ff5a2a]" aria-hidden="true">—</span>{item}</li>)}</ul>
              </div>
              <p className="mt-6 text-xs leading-5 text-[#f2eee5]/55">
                El cobro mensual se renueva hasta que des de baja desde el portal de Stripe; la baja corta la renovación al final del mes en curso. Resolve Studio y ChatGPT no están incluidos: esas cuentas son tuyas.
              </p>
              <div className="mt-8">
                <a href={ASESORIA_PAYMENT_LINKS.SUBSCRIPTION} onClick={() => trackCheckoutClick('modalities_main', 'subscription')} className="group inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-4 border border-[#ff5a2a] bg-[#ff5a2a] px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#171612] transition-colors hover:bg-[#f2eee5]">
                  Empezar el acompañamiento <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </article>

            {/* Opción secundaria: sesión */}
            <article className="border-[#171612]/70 border bg-[#ff5a2a] p-6 sm:p-9">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#171612]/55">Para empezar con una tarea</p>
              <h3 className="mt-3 font-editorial text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Sesión puntual</h3>
              <p className="mt-3 text-sm leading-6 text-[#171612]/68">Una prioridad concreta de tu edición, resuelta en directo y con un flujo que sigue funcionando sin Alberto delante.</p>
              <p className="mt-6 text-3xl font-black tracking-[-0.04em]">75 €<span className="text-base font-bold text-[#171612]/55"> · precio final · online, 90 minutos</span></p>
              <ul className="mt-7 grid gap-2 border-t border-[#171612]/25 pt-6 text-sm leading-6 text-[#171612]/75">
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Tu briefing se revisa antes de la sesión.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>90 minutos sobre una tarea real; el alcance se acuerda antes del pago.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Mapa de dónde tiene sentido seguir delegando.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Una consulta breve por email durante los 7 días siguientes.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Sin permanencia; si contratas después la mensual, la sesión no se pierde: el acompañamiento mantiene lo construido (mira condiciones).</li>
              </ul>
              <div className="mt-8">
                <a href={ASESORIA_PAYMENT_LINKS.SESSION} onClick={() => trackCheckoutClick('modalities_secondary', 'session')} className="group inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-4 border border-[#171612] bg-[#171612] px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#f2eee5] transition-colors hover:bg-[#f2eee5] hover:text-[#171612]">
                  Reservar una sesión <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-4 text-xs leading-5 text-[#171612]/60 sm:grid-cols-2">
            <p>El precio mostrado es final; Stripe no añadirá IVA al total mostrado.</p>
            <p>Requisitos antes de pagar: DaVinci Resolve (Studio recomendado) y acceso a ChatGPT en un equipo que los ejecute con soltura. Si algo de tu equipo no es compatible, escríbenos antes de pagar y lo confirmamos por email.</p>
          </div>

          <div className="mt-12 grid gap-4 border-t border-[#171612]/25 pt-8 sm:grid-cols-4">
            {[
              ['01', 'Elige modalidad', 'Mensual o sesión puntual, arriba.'],
              ['02', 'Paga con Stripe', 'Checkout seguro con la identidad de la oferta.'],
              ['03', 'Briefing', 'Tu equipo, versiones, material y la tarea prioritaria; para dudas de compatibilidad, escríbenos antes de pagar.'],
              ['04', 'Fecha', 'Alberto confirma fecha por email en un máximo de 48 h laborables.'],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[36px_1fr] gap-3">
                <span className="font-mono text-[10px] font-bold text-[#171612]/55">{number}</span>
                <div><p className="font-black">{title}</p><p className="mt-1 text-sm text-[#171612]/55">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Antes de reservar</p>
            <h2 className="font-editorial mt-5 max-w-md text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl">Antes de reservar, esto.</h2>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#f2eee5]/40">9 respuestas · 2 minutos</p>
          </div>
          <div className="border-t border-[#f2eee5]/20">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="border-b border-[#f2eee5]/20">
                  <button type="button" onClick={() => { setOpenFaq(isOpen ? null : index); AnalyticsEvents.viewFAQ(faq.question); }} className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
                    <span className="text-lg font-black tracking-[-0.02em] sm:text-xl">{faq.question}</span>
                    <ArrowRight className={`h-5 w-5 shrink-0 rotate-90 text-[#ff5a2a] transition-transform ${isOpen ? 'rotate-[270deg]' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && <p className="max-w-2xl pb-7 pr-10 leading-7 text-[#f2eee5]/55">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
