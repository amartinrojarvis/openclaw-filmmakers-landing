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
    'Describir el ajuste que necesitas —ritmo, estructura, un corte concreto—, revisar el resultado del programa y repetir hasta que quede como lo planteas.',
  ],
];

const firstMonthItems = [
  'Diagnóstico y construcción del primer flujo de edición, 90 minutos',
  '4 sesiones online de 1 hora al mes, empezando desde el primer mes',
  'Hasta 4 consultas por email al mes, con respuesta en un máximo de 48 h laborables',
  'Mantenimiento y ajuste de lo ya montado conforme lo usas en proyectos reales',
];

const renewalItems = [
  'Las mismas 4 sesiones de 1 hora cada mes, sin permanencia',
  'Se sigue trabajando sobre tus proyectos; no hay un catálogo de módulos grabados',
  'Las consultas por email y el aviso de cambios relevantes en IA se mantienen',
  'Puedes dar de baja al final de cada mes desde el portal de Stripe',
];

const faqs = [
  {
    question: '¿Necesito saber programar?',
    answer: 'No. Se trabaja con instrucciones en lenguaje natural y con la configuración de las herramientas. Ayuda manejar Resolve con soltura; no hace falta escribir código.',
  },
  {
    question: '¿Qué equipo y suscripciones necesito?',
    answer: 'Un equipo razonablemente moderno con DaVinci Resolve (Studio es la vía directa para sus funciones de IA y transcripción; con la versión gratuita ajustamos el flujo a lo que tu edición permita) y acceso a ChatGPT con la última versión de escritorio o el conector compatible que toque en tu caso. Las suscripciones de terceros no están incluidas en el precio.',
  },
  {
    question: '¿Trabajamos con mi material?',
    answer: 'Sí, y es lo recomendado: proyectos reales tuyos, con material que puedas compartir en confianza. Lo que necesites mantener privado se sustituye por material equivalente o se trabaja sobre descripciones del caso.',
  },
  {
    question: '¿Qué puedo conseguir en una sesión?',
    answer: 'Montar y dejar funcionando un flujo para una tarea concreta de tu edición, con instrucciones y criterios de revisión que puedas repetir sin Alberto delante. No es una garantía de calidad automática: la IA propone cambios, tú validas el montaje.',
  },
  {
    question: '¿Qué cambia con el acompañamiento mensual y qué incluye cada mes?',
    answer: 'La sesión resuelve una tarea. La mensual repite el ciclo cada mes durante el tiempo que la mantengas: se siguen trabajando tus proyectos reales, se resuelve lo que se atasque y el flujo mejora conforme lo usas. La edición es la prioridad inicial; otros procesos de tu negocio pueden incorporarse después según tus prioridades.',
  },
  {
    question: '¿La IA edita todo sola?',
    answer: 'No. Hay tareas delegables (transcribir, localizar material, una primera criba de cortes) y decisiones que siguen siendo tuyas: selección, ritmo y acabado. La sesión enseña a separar unas de otras y a revisar lo que la máquina propone. Parte del trabajo se hace con el MCP nativo de Resolve y parte con herramientas auxiliares que se montan contigo en la sesión.',
  },
  {
    question: '¿Puedo cancelar el acompañamiento?',
    answer: 'Sí, sin permanencia: puedes dar de baja desde el portal de Stripe y la renovación deja de cobrarse al final del mes en curso. Las condiciones completas están en el enlace de condiciones de contratación.',
  },
  {
    question: '¿Las herramientas están incluidas?',
    answer: 'No. El precio cubre la formación y el acompañamiento. Resolve Studio y el plan de ChatGPT que necesites corren por tu cuenta; en la primera sesión revisamos qué plan mínimo necesitas para tu volumen de trabajo.',
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
          <p className="mt-1 text-sm font-black">Sesión desde 75 € · acompañamiento 199 €/mes</p>
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
      <section className="border-b border-[#f2eee5]/15 px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1.25fr_.55fr] lg:gap-20 lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
              <span className="h-px w-9 bg-current" /> Aprende vibe editing
            </p>
            <h1 className="mt-7 max-w-[16ch] text-balance text-[clamp(3.4rem,7.5vw,8rem)] font-black leading-[0.84] tracking-[-0.07em]">
              Delega la edición.
              <em className="font-editorial mt-3 block font-normal tracking-[-0.04em] text-[#ff5a2a]">Sin contratar a nadie.</em>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#f2eee5]/68 sm:text-xl">
              Aprende conmigo a delegar tareas de edición con DaVinci Resolve y ChatGPT. Trabajamos con tu material para que puedas aplicarlo en tus próximos proyectos.
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
              Requisitos: DaVinci Resolve (Studio recomendado para sus funciones de IA) y acceso a ChatGPT, en un equipo que los ejecute con soltura. Requisitos completos, en <a href="#modalidades" className="text-[#ff5a2a] underline underline-offset-4">modalidades y requisitos</a>.
            </p>
          </div>
          <figure className="mx-auto w-full max-w-sm lg:mx-0">
            <Image
              src="/perfil-alberto-v2.jpg"
              alt="Alberto Martín trabajando con una cámara de vídeo"
              width={720}
              height={900}
              className="aspect-[4/5] w-full border border-[#f2eee5]/15 object-cover grayscale-[20%] contrast-[1.04]"
            />
            <figcaption className="flex justify-between border-x border-b border-[#f2eee5]/15 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#f2eee5]/45">
              <span>Alberto Martín</span><span>Filmmaker · ingeniero</span>
            </figcaption>
          </figure>
        </div>
      </section>

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
              Un ejemplo de trabajo entregado: promoción para un cliente real con material hablado —entrevistas y clases—, el tipo de encargo donde más tiempo se va seleccionando, cribando y volviendo a mirar tomas. En la sesión trabajamos sobre material como este, no sobre ejercicios de laboratorio. No es una demostración del flujo con IA: la demostración del proceso va en el bloque de la derecha.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#f2eee5]/45">
              Es un trabajo real entregado a un cliente, mostrado como ejemplo del tipo de encargo donde más tiempo se va seleccionando, cribando y volviendo a mirar tomas. Mientras el reproductor no esté aceptado en el aviso de cookies, o si Instagram no lo sirve, usa el enlace «Ver en Instagram»: siempre funciona.
            </p>
            <div className="mt-10 lg:hidden">
              <InstagramEmbed shortcode="DeEzWSoI7qJ" title="Reel de ejemplo: promoción con material hablado, editado por Alberto Martín" onPlay={() => trackEvent('demo_play', { section: 'ejemplo' })} />
            </div>
          </div>
          <div className="grid content-start gap-10">
            <div className="hidden lg:block">
              <InstagramEmbed shortcode="DeEzWSoI7qJ" title="Reel de ejemplo: promoción con material hablado, editado por Alberto Martín" onPlay={() => trackEvent('demo_play', { section: 'ejemplo' })} />
            </div>
            <TimelineScheme />
            <div className="border border-[#f2eee5]/15 p-6 sm:p-8">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Demostración del proceso · pendiente de grabación</p>
              <h3 className="mt-3 font-editorial text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Instrucciones → cambios en Resolve → revisión.</h3>
              <p className="mt-4 leading-7 text-[#f2eee5]/62">
                En la sesión ves el ciclo completo con tu material: das la instrucción, observas qué cambia en el timeline y decides qué se queda. Cuando tengamos grabada la demostración real (o la secuencia de capturas) se publicará en este bloque; el esquema de arriba solo ilustra el proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué delegar */}
      <section id="delegar" className="border-b border-[#f2eee5]/15 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">
            <span className="h-px w-9 bg-current" /> Qué se delega
          </p>
          <h2 className="mt-6 max-w-4xl text-balance text-[clamp(2.6rem,5.5vw,5.6rem)] font-black leading-[0.88] tracking-[-0.06em]">
            Menos tareas repetitivas. <em className="font-editorial font-normal italic tracking-[-0.02em] text-[#ff5a2a]">Más tiempo para tus proyectos.</em>
          </h2>
          <p className="mt-6 max-w-2xl leading-7 text-[#f2eee5]/62">
            Tres tareas son el punto de partida de este flujo; la sesión se ajusta a tu caso y a las versiones de Resolve y ChatGPT que uses, con sus dependencias reales explicadas antes de empezar.
          </p>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {delegatedTasks.map(([title, text]) => (
              <li key={title} className="border border-[#f2eee5]/15 bg-[#f2eee5]/[0.03] p-6">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Delegable</p>
                <h3 className="mt-3 text-lg font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#f2eee5]/55">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-xs leading-5 text-[#f2eee5]/45">
            No se delegan las decisiones: selección, ritmo y acabado siguen siendo tuyos. «Mejorar calidad» aquí significa disponer de más tiempo y atención para revisar el montaje, no una garantía automática de la IA.
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
              Una sesión te ayuda a empezar con una tarea concreta. El acompañamiento mensual nos permite seguir trabajando con tus proyectos, resolver lo que se atasque y mejorar el flujo conforme lo vas usando.
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
      <section id="modalidades" className="border-b border-[#f2eee5]/15 bg-[#ff5a2a] px-5 py-20 text-[#171612] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <header className="grid gap-8 border-b border-[#171612]/55 pb-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Modalidades</p>
            <div>
              <h2 className="max-w-4xl text-balance text-[clamp(3rem,6.5vw,7rem)] font-black leading-[0.86] tracking-[-0.07em]">
                Elige cómo quieres avanzar.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#171612]/68">
                Dos formas de empezar, ambas con trabajo sobre tu edición real. La mensual da continuidad al flujo; la sesión resuelve una prioridad concreta.
              </p>
            </div>
          </header>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
            {/* Opción principal: mensual */}
            <article className="order-first border-[#171612] bg-[#171612] p-6 text-[#f2eee5] sm:p-9">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Para aplicarlo a tu trabajo</p>
              <h3 className="mt-3 font-editorial text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Acompañamiento mensual</h3>
              <p className="mt-3 text-sm leading-6 text-[#f2eee5]/62">Empezamos por tu edición y seguimos trabajando contigo para que este flujo forme parte de tu día a día.</p>
              <p className="mt-6 text-3xl font-black tracking-[-0.04em]">199 €<span className="text-base font-bold text-[#f2eee5]/55">/mes · precio final, sin permanencia</span></p>
              <div className="mt-7 border-t border-[#f2eee5]/15 pt-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Qué incluye el primer mes</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#f2eee5]/72">{firstMonthItems.map((item) => <li key={item} className="flex gap-2"><span className="mt-[2px] text-[#ff5a2a]" aria-hidden="true">—</span>{item}</li>)}</ul>
                <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Qué incluye cada renovación</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#f2eee5]/72">{renewalItems.map((item) => <li key={item} className="flex gap-2"><span className="mt-[2px] text-[#ff5a2a]" aria-hidden="true">—</span>{item}</li>)}</ul>
              </div>
              <p className="mt-6 text-xs leading-5 text-[#f2eee5]/55">
                Se cobra hoy el primer mes (199 €) y se renueva cada mes por el mismo importe hasta que des de baja; la baja desde el portal de Stripe corta la próxima renovación al final del mes en curso. No incluye Resolve Studio, ChatGPT ni demás suscripciones de terceros: esas cuentas son tuyas.
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
              <p className="mt-3 text-sm leading-6 text-[#171612]/68">Trabajamos una prioridad concreta de tu edición y te llevas un flujo para seguir practicando.</p>
              <p className="mt-6 text-3xl font-black tracking-[-0.04em]">75 €<span className="text-base font-bold text-[#171612]/55"> · precio final · online, 90 minutos</span></p>
              <ul className="mt-7 grid gap-2 border-t border-[#171612]/25 pt-6 text-sm leading-6 text-[#171612]/75">
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Revisión previa de tu briefing y preparación de tu caso.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>90 minutos sobre una tarea real de tu edición, con el alcance y los requisitos acordados antes del pago.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Mapa priorizado de dónde sigue teniendo sentido delegar más tarde.</li>
                <li className="flex gap-2"><span className="mt-[2px] font-black" aria-hidden="true">—</span>Una consulta breve por email durante los 7 días siguientes.</li>
              </ul>
              <p className="mt-6 text-xs leading-5 text-[#171612]/60">Sin compromiso de continuidad. Si después quieres el acompañamiento mensual, consulta condiciones: la suscripción mantiene lo construido en la sesión.</p>
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
              ['03', 'Briefing', 'Tu equipo, versiones, material y la tarea prioritaria; si necesitas comprobar la compatibilidad antes, escribe a alberto@tuvideopromocional.es.'],
              ['04', 'Fecha', 'Alberto confirma fecha por email en un máximo de 48 h laborables.'],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[36px_1fr] gap-3">
                <span className="font-mono text-[10px] font-bold text-[#171612]/55">{number}</span>
                <div><p className="font-black">{title}</p><p className="mt-1 text-sm text-[#171612]/55">{text}</p></div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <a href="#modalidades" onClick={() => AnalyticsEvents.clickCTA('footer_cta', 'Ver modalidades')} className="inline-flex min-h-12 items-center border border-[#171612] bg-[#171612] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#f2eee5] transition-colors hover:bg-[#f2eee5] hover:text-[#171612]">
              Ver modalidades <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Antes de reservar</p>
            <h2 className="font-editorial mt-5 max-w-md text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl">Preguntas frecuentes</h2>
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
