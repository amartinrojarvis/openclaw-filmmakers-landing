'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AnalyticsEvents } from '@/components/Analytics';

type AdvisoryPlan = 'session' | 'followup30d';

const PAYMENT_LINKS: Record<AdvisoryPlan, string> = {
  session: 'https://book.stripe.com/9B69AT0Tr3CMgAFdqU8og0n',
  followup30d: 'https://book.stripe.com/cNidR959Hc9ifwBfz28og0o',
};

// Contador editorial anunciado; Stripe sigue siendo el gate de cierre al agotarse.
const PUBLISHED_REMAINING_SLOTS = 4;

const situations = [
  ['01', 'Clientes y propuestas', 'Responder, presupuestar y hacer seguimiento sin perder tu tono.'],
  ['02', 'Guion y preproducción', 'Convertir briefings dispersos en estructuras y planes de rodaje útiles.'],
  ['03', 'Contenido y reutilización', 'Sacar más recorrido a cada proyecto sin producir contenido genérico.'],
  ['04', 'Edición asistida', 'Acelerar tareas concretas sin entregar las decisiones creativas a una máquina.'],
  ['05', 'Procesos de negocio', 'Ordenar una tarea repetitiva en un flujo claro, documentado y repetible.'],
];

const firstMonthItems = [
  'Revisión previa del briefing',
  'Sesión de diagnóstico y construcción de 90 minutos',
  'El mapa de tus cinco sistemas, priorizado',
  'El primer sistema, montado y funcionando',
  '1 seguimiento online de 45 minutos',
  'Hasta 4 consultas por email',
  'Respuesta en un máximo de 48 h laborables',
];

const continuityItems = [
  'Un sistema nuevo del mapa, montado contigo en sesión',
  'Sesión online de 45-60 minutos',
  'Mantenimiento de todo lo ya construido',
  'Hasta 4 consultas por email',
  'Nota mensual: qué ha cambiado en IA y cómo te afecta',
];

const directBenefits = [
  {
    kicker: 'Tiempo + creatividad',
    problem: 'Horas que se van en preparar, ordenar y repetir tareas mecánicas.',
    benefit: 'Recuperas tiempo para crear y atender mejor a tus clientes.',
    detail: 'Quitamos pasos manuales sin entregar a la IA las decisiones que necesitan tu criterio.',
  },
  {
    kicker: 'Sistema + productividad',
    problem: 'Procesos dispersos, herramientas genéricas e ideas que nunca pasan de una nota.',
    benefit: 'Construyes un sistema propio que puedes repetir y mejorar.',
    detail: 'Ordenamos el proceso y lo convertimos en un flujo o primer prototipo adaptado a tu manera de trabajar.',
  },
  {
    kicker: 'Ventaja competitiva',
    problem: 'La sensación de que otros ya están aprovechando la IA mientras tú sigues poniéndote al día.',
    benefit: 'No solo te pones al día. Ganas capacidad para avanzar antes.',
    detail: 'Desarrollas autonomía para detectar oportunidades, probar ideas y responder con más agilidad que quien sigue improvisando.',
  },
];

const faqs = [
  {
    question: '¿Qué conseguiré en 90 minutos?',
    answer:
      'Trabajaremos una prioridad real y saldrás con un flujo aplicable, una hoja de ruta resumida y, cuando el alcance lo permita, un primer prototipo funcional. No intentaremos automatizar todo tu negocio en una sola sesión.',
  },
  {
    question: '¿Qué incluye exactamente el precio?',
    answer:
      'Revisión previa del formulario, preparación del caso, sesión online de 90 minutos, diseño sobre tu caso real, hoja de ruta resumida y una consulta corta por email durante los siete días posteriores.',
  },
  {
    question: '¿Qué añade el acompañamiento de 30 días?',
    answer:
      'Incluye dos sesiones de seguimiento de 45 minutos, hasta cuatro consultas breves por email, revisión del flujo o prototipo y ajustes de la hoja de ruta. No es soporte ilimitado ni incluye desarrollo completo o integraciones complejas.',
  },
  {
    question: '¿Incluye una automatización o aplicación completa?',
    answer:
      'No incluye desarrollo completo de software, integraciones complejas, mantenimiento ni soporte indefinido. Si el caso necesita una implementación mayor, saldrás con el alcance y los siguientes pasos claros, sin obligación de contratar nada más.',
  },
  {
    question: '¿Qué ocurre si mi caso no cabe en una sola sesión?',
    answer:
      'Priorizaremos la parte con mayor impacto y dejaremos documentado qué puede resolverse en la sesión, qué requiere más trabajo y cómo abordarlo después. La sesión no promete terminar una implementación compleja en 90 minutos.',
  },
  {
    question: '¿Cómo elegimos la fecha?',
    answer:
      'Después del pago completarás un formulario con tres horarios preferidos. Alberto te propondrá o confirmará fecha por email en un máximo de 48 horas laborables.',
  },
  {
    question: '¿Puedo cambiar o cancelar la fecha?',
    answer:
      'Puedes solicitar un cambio sin coste avisando con al menos 24 horas. Una cancelación comunicada con al menos 48 horas da derecho al reembolso del importe abonado; el resto de supuestos se detalla en las condiciones de contratación.',
  },
  {
    question: '¿Necesito saber de IA o programación?',
    answer:
      'No. Partimos de tu nivel y de las herramientas que ya utilizas. Si ya sabes de IA, de programación o de ambas, iremos más rápido y podremos profundizar más. La sesión está pensada para profesionales audiovisuales que quieren avanzar sin perderse entre aplicaciones.',
  },
];

function BenefitGraphic({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className="benefit-graphic benefit-graphic--time" viewBox="0 0 360 360" fill="none" aria-hidden="true" focusable="false">
        <circle cx="180" cy="168" r="116" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="180" cy="168" r="88" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 9" />
        <path d="M180 52a116 116 0 0 1 109 76" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <path d="M180 168V91M180 168l64 31" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
        <circle cx="180" cy="168" r="8" fill="currentColor" />
        <path d="M42 294c28-42 55 42 83 0s55 42 83 0 55 42 110-8" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
        <path d="M42 314h276" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg className="benefit-graphic benefit-graphic--system" viewBox="0 0 360 360" fill="none" aria-hidden="true" focusable="false">
        <path d="M54 82h84c26 0 30 34 56 34h108M54 180h58c30 0 36-32 66-32h124M54 278h94c30 0 36-60 66-60h88" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 9" />
        <rect x="34" y="60" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <rect x="282" y="96" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <rect x="34" y="160" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <rect x="282" y="198" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <rect x="34" y="258" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="178" cy="148" r="18" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="178" cy="148" r="5" fill="currentColor" />
        <circle cx="214" cy="218" r="6" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className="benefit-graphic benefit-graphic--advantage" viewBox="0 0 900 320" fill="none" aria-hidden="true" focusable="false">
      <path d="M34 266H866M34 196H866M34 126H866M34 56H866" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 12" />
      <path d="M44 264C148 252 170 229 254 224s124 5 192-57 132-35 194-91 114-48 190-50" stroke="currentColor" strokeWidth="4.25" strokeLinecap="round" />
      <circle cx="254" cy="224" r="9" fill="currentColor" />
      <circle cx="446" cy="167" r="9" fill="currentColor" />
      <circle cx="640" cy="76" r="9" fill="currentColor" />
      <path d="m804 10 36 16-30 26" stroke="currentColor" strokeWidth="4.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function trackAdvisoryCheckout(location: string, plan: AdvisoryPlan) {
  const items = plan === 'followup30d'
    ? [{ id: 'suscripcion-mensual-primer-mes', name: 'Suscripción mensual · primer mes', price: 199 }]
    : [{ id: 'asesoria-ia-audiovisual-90m', name: 'Sesión 1:1 · Herramientas de IA para filmmakers', price: 75 }];
  AnalyticsEvents.beginCheckout(items);
  AnalyticsEvents.clickCTA(location, plan === 'followup30d' ? 'Construir mi sistema' : 'Elegir sesión de 90 minutos');
}

function CheckoutButton({ location, plan, inverse = false, children }: { location: string; plan: AdvisoryPlan; inverse?: boolean; children: React.ReactNode }) {
  return (
    <div className="w-full sm:w-auto">
      <a
        href={PAYMENT_LINKS[plan]}
        onClick={() => trackAdvisoryCheckout(location, plan)}
        className={`group inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-4 border px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.08em] transition-colors sm:w-auto ${
          inverse
            ? 'border-[#171612] bg-[#171612] text-[#f2eee5] hover:bg-[#ff5a2a] hover:text-[#171612]'
            : 'border-[#ff5a2a] bg-[#ff5a2a] text-[#171612] hover:bg-[#f2eee5]'
        }`}
      >
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </div>
  );
}

function AvailabilityDisplay({ remainingSlots, prominent = false }: { remainingSlots: number | null; prominent?: boolean }) {
  if (remainingSlots === 0) return <>Edición completa</>;
  if (remainingSlots === null) return <>Plazas disponibles</>;

  const slotLabel = remainingSlots === 1 ? 'plaza disponible' : 'plazas disponibles';
  if (remainingSlots !== 4) return <>{remainingSlots} {slotLabel}</>;

  if (prominent) {
    return (
      <a
        href="#sesion"
        className="group inline-grid cursor-pointer grid-cols-[auto_auto_1fr] items-stretch border border-[#ff5a2a]/65 bg-[#ff5a2a]/[0.08] shadow-[0_14px_45px_rgba(255,90,42,0.12)] transition-[border-color,background-color,box-shadow,transform] motion-safe:hover:-translate-y-0.5 hover:border-[#ff5a2a] hover:bg-[#ff5a2a]/[0.12] hover:shadow-[0_18px_50px_rgba(255,90,42,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a2a] motion-reduce:transform-none"
        aria-label="Oferta de lanzamiento: solo quedan 4 de las 5 plazas iniciales; 1 plaza ya está reservada. Ir a precios y reserva"
      >
        <span className="flex items-center border-r border-[#ff5a2a]/35 px-3 py-3 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#ff5a2a] sm:px-4 sm:text-[10px]" aria-hidden="true">
          Solo quedan
        </span>
        <strong className="grid min-w-14 place-items-center bg-[#ff5a2a] px-3 text-3xl font-black leading-none tracking-[-0.06em] text-[#171612] sm:min-w-16 sm:text-4xl" aria-hidden="true">4</strong>
        <span className="flex flex-col justify-center px-2.5 py-2.5 text-left sm:px-4" aria-hidden="true">
          <span className="flex items-center gap-1.5 font-mono text-xs font-black uppercase tracking-[0.16em] text-[#f2eee5] sm:gap-2 sm:text-sm">
            Plazas <ArrowRight className="h-3 w-3 text-[#ff5a2a] transition-transform motion-safe:group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" />
          </span>
          <span className="mt-1 whitespace-nowrap font-mono text-[8px] font-bold uppercase tracking-[0.03em] text-[#f2eee5]/60 sm:text-[9px] sm:tracking-[0.06em]">
            5 iniciales · 1 reservada
          </span>
        </span>
      </a>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-[#ff5a2a]/35 bg-[#ff5a2a]/[0.08] px-2.5 py-1 leading-none"
      aria-label="5 plazas iniciales; ahora solo quedan 4"
    >
      <span className="text-[#f2eee5]/60" aria-hidden="true">
        <span className="font-black">5</span> iniciales
      </span>
      <span className="text-[#ff5a2a]" aria-hidden="true">→</span>
      <span className="inline-flex items-center gap-1 text-[#f2eee5]" aria-hidden="true">
        quedan <strong className="bg-[#ff5a2a] px-1.5 py-1 text-[1.1em] font-black text-[#171612]">4</strong> plazas
      </span>
    </span>
  );
}

function PurchaseAvailabilityDisplay({ remainingSlots }: { remainingSlots: number | null }) {
  if (remainingSlots === 0) return null;
  if (remainingSlots !== 4) return <p className="mt-8 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#b43414]">{remainingSlots ?? 'Varias'} plazas disponibles</p>;

  return (
    <aside
      className="mt-9 inline-grid max-w-full grid-cols-[auto_auto_1fr] items-stretch border border-[#b43414]/70 bg-[#b43414]/[0.06] shadow-[0_12px_35px_rgba(180,52,20,0.08)]"
      aria-label="Oferta de lanzamiento: solo quedan 4 de las 5 plazas iniciales; 1 plaza ya está reservada"
    >
      <span className="flex items-center border-r border-[#b43414]/30 px-3 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#b43414] sm:px-5 sm:text-[10px]" aria-hidden="true">Solo quedan</span>
      <strong className="grid min-w-14 place-items-center bg-[#b43414] px-3 text-3xl font-black leading-none tracking-[-0.06em] text-[#f2eee5] sm:min-w-16 sm:text-4xl" aria-hidden="true">4</strong>
      <span className="flex flex-col justify-center px-3 py-2.5 text-left sm:px-5" aria-hidden="true">
        <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#171612] sm:text-sm">Plazas</span>
        <span className="mt-1 whitespace-nowrap font-mono text-[8.5px] font-bold uppercase tracking-[0.05em] text-[#171612]/60 sm:text-[9px]">De 5 iniciales · 1 reservada</span>
      </span>
    </aside>
  );
}

function Navigation({ remainingSlots }: { remainingSlots: number | null }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['#encaje', 'Para qué sirve'],
    ['#metodo', 'El método'],
    ['#proyectos', 'Experiencia'],
    ['#sesion', 'Reservar'],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#f2eee5]/15 bg-[#171612]/95 backdrop-blur-md">
      <nav className="mx-auto flex min-h-16 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Navegación principal">
        <Link href="/" className="flex items-baseline gap-2" aria-label="IA para Filmmakers, inicio">
          <span className="text-base font-black uppercase tracking-[-0.03em] text-[#f2eee5]">IA para Filmmakers</span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff5a2a] sm:block">por Alberto Martín</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="text-xs font-bold uppercase tracking-[0.1em] text-[#f2eee5]/55 transition-colors hover:text-[#ff5a2a]">
              {label}
            </a>
          ))}
        </div>

        <a href="#sesion" className="hidden border-l border-[#f2eee5]/15 pl-8 text-xs font-extrabold uppercase tracking-[0.1em] text-[#f2eee5] hover:text-[#ff5a2a] md:block">
          <AvailabilityDisplay remainingSlots={remainingSlots} />
        </a>

        <button type="button" onClick={() => setOpen(!open)} className="grid h-11 w-11 cursor-pointer place-items-center border border-[#f2eee5]/20 text-[#f2eee5] md:hidden" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[#f2eee5]/15 bg-[#171612] px-5 py-4 md:hidden">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="flex border-b border-[#f2eee5]/10 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#f2eee5] last:border-0">
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function MobileStickyCTA({ availabilityLabel, soldOut }: { availabilityLabel: string; soldOut: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const pricing = document.getElementById('sesion');
      const pricingVisible = pricing ? pricing.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setVisible(window.scrollY > 760 && !pricingVisible);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!visible || soldOut) return null;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f2eee5]/20 bg-[#171612]/97 px-4 py-3 shadow-[0_-10px_35px_rgba(0,0,0,.35)] backdrop-blur md:hidden" aria-label="Reserva rápida">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-[#ff5a2a]">{availabilityLabel}</p>
          <p className="mt-1 text-sm font-black">Desde 75 € · precio final</p>
        </div>
        <a href="#sesion" onClick={() => AnalyticsEvents.clickCTA('mobile_sticky', 'Ver modalidades')} className="inline-flex min-h-12 shrink-0 items-center gap-2 bg-[#ff5a2a] px-4 py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-[#171612]">
          Ver opciones <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}

export function SessionLanding({ remainingSlots }: { remainingSlots: number | null }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const displayedSlots = remainingSlots === 0 ? 0 : PUBLISHED_REMAINING_SLOTS;
  const soldOut = displayedSlots === 0;
  const availabilityLabel = soldOut
    ? 'Edición completa'
    : `${displayedSlots} plazas disponibles`;

  return (
    <main className="bg-[#171612] pb-20 text-[#f2eee5] md:pb-0">
      <Navigation remainingSlots={displayedSlots} />
      <MobileStickyCTA availabilityLabel={availabilityLabel} soldOut={soldOut} />

      <section className="relative border-b border-[#f2eee5]/15 px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1.22fr_.58fr] lg:items-end lg:gap-20">
          <div>
            <div className="mb-8 flex flex-col items-start gap-3">
              <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.19em] text-[#ff5a2a]">
                <span className="h-px w-9 bg-current" /> Oferta de lanzamiento
              </p>
              <AvailabilityDisplay remainingSlots={displayedSlots} prominent />
            </div>
            <h1 className="max-w-[18ch] text-balance text-[clamp(3.8rem,8.4vw,8.8rem)] font-black leading-[0.81] tracking-[-0.075em] text-[#f2eee5]">
              La IA no tiene que cambiar tu oficio.
              <em className="font-editorial mt-4 block font-normal tracking-[-0.04em] text-[#ff5a2a]">Tiene que quitarte fricción.</em>
            </h1>
            <div className="mt-10 grid max-w-4xl gap-7 border-t border-[#f2eee5]/20 pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="max-w-2xl text-lg leading-8 text-[#f2eee5]/68 sm:text-xl">
                  En 90 minutos trabajamos una prioridad real de tu negocio audiovisual. Saldrás con <strong className="font-semibold text-[#f2eee5]">un flujo aplicable, un primer prototipo cuando sea viable y una hoja de ruta clara</strong>.
                </p>
                <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff5a2a]">Desde 75 € · precio final</p>
                <p className="mt-2 text-sm leading-6 text-[#f2eee5]/55">Pago seguro → briefing breve → fecha confirmada en un máximo de 48 h laborables.</p>
              </div>
              {soldOut ? (
                <span className="inline-flex min-h-14 items-center justify-center border border-[#f2eee5]/25 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#f2eee5]/55">Edición completa</span>
              ) : (
                <a href="#sesion" onClick={() => AnalyticsEvents.clickCTA('hero', 'Ver modalidades')} className="group inline-flex min-h-14 w-full items-center justify-center gap-4 border border-[#ff5a2a] bg-[#ff5a2a] px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#171612] transition-colors hover:bg-[#f2eee5] sm:w-auto">Elegir modalidad <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              )}
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="absolute -left-3 -top-3 z-10 border border-[#ff5a2a] bg-[#ff5a2a] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#171612]">
              Filmmaker e Ingeniero Informático
            </div>
            <Image
              src="/perfil-alberto-v2.jpg"
              alt="Alberto Martín trabajando con una cámara de vídeo"
              width={720}
              height={900}
              priority
              className="aspect-[4/5] w-full border border-[#f2eee5]/15 object-cover grayscale-[20%] contrast-[1.04]"
            />
            <figcaption className="flex justify-between border-x border-b border-[#f2eee5]/15 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#f2eee5]/45">
              <span>Alberto Martín</span><span>Salamanca · online</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="beneficios" className="overflow-hidden bg-[#ff5a2a] px-5 py-20 text-[#171612] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <header className="grid gap-8 border-b border-[#171612]/55 pb-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Lo que cambia</p>
            <div>
              <h2 className="max-w-5xl text-balance text-[clamp(3rem,6.5vw,7rem)] font-black leading-[0.86] tracking-[-0.07em]">
                Menos trabajo mecánico. <span className="font-editorial font-normal italic">Más tiempo para tu creatividad.</span>
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#171612]/68">
                No se trata de añadir IA a todo. Se trata de aprender a utilizarla en tu beneficio para que trabaje por ti y devolverte tiempo para crear, decidir y atender mejor a tus clientes.
              </p>
            </div>
          </header>

          <div className="mt-12 grid gap-5 pb-10 md:grid-cols-12 md:items-start">
            {directBenefits.map((item, index) => (
              <article
                key={item.benefit}
                className={`benefit-card relative flex min-w-0 flex-col overflow-hidden border border-[#171612] p-6 sm:p-8 lg:p-10 ${
                  index === 0
                    ? 'bg-[#f2eee5] md:col-span-7 md:min-h-[34rem]'
                    : index === 1
                      ? 'benefit-card--dark bg-[#171612] text-[#f2eee5] md:relative md:top-10 md:col-span-5 md:min-h-[30rem]'
                      : 'benefit-card--mid bg-[#5f5850] text-[#f2eee5] md:col-span-12 md:mt-10'
                }`}
              >
                <BenefitGraphic index={index} />

                <div className="relative z-10 flex items-start justify-between gap-5 border-b border-current/25 pb-6">
                  <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${index === 1 ? 'text-[#ff5a2a]' : index === 2 ? 'text-[#f2eee5]/75' : 'text-[#b43414]'}`}>{item.kicker}</p>
                  <span className={`select-none text-7xl font-black leading-[0.7] tracking-[-0.1em] sm:text-8xl ${index === 0 ? 'text-[#171612]/10' : 'text-[#f2eee5]/10'}`} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className={`relative z-10 mt-8 flex flex-1 flex-col gap-7 ${index === 2 ? 'lg:grid lg:grid-cols-[minmax(0,.8fr)_64px_minmax(0,1.2fr)] lg:items-center lg:gap-10' : ''}`}>
                  <div>
                    <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${index === 0 ? 'text-[#171612]/50' : 'text-[#f2eee5]/65'}`}>Antes</p>
                    <p className={`mt-4 max-w-xl text-lg font-black leading-7 tracking-[-0.025em] sm:text-xl ${index === 0 ? 'text-[#171612]/75' : index === 1 ? 'text-[#f2eee5]/78' : 'text-[#f2eee5]/90'}`}>{item.problem}</p>
                  </div>

                  <span className={`benefit-card__arrow flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 motion-reduce:transition-none ${index === 1 ? 'border-[#f2eee5]/30 text-[#ff5a2a]' : index === 2 ? 'border-[#f2eee5]/40 text-[#f2eee5]' : 'border-[#171612]/35 text-[#b43414]'}`} aria-hidden="true">
                    <ArrowRight className={`h-4 w-4 ${index === 2 ? 'rotate-90 lg:rotate-0' : 'rotate-90'}`} />
                  </span>

                  <div className={index === 2 ? '' : 'mt-auto'}>
                    <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${index === 0 ? 'text-[#b43414]' : index === 1 ? 'text-[#ff5a2a]' : 'text-[#f2eee5]/70'}`}>Después</p>
                    <h3 className={`font-editorial mt-3 max-w-2xl text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl ${index === 0 ? '' : 'text-[#f2eee5]'}`}>{item.benefit}</h3>
                    <p className={`mt-5 max-w-xl leading-7 ${index === 0 ? 'text-[#171612]/65' : index === 1 ? 'text-[#f2eee5]/65' : 'text-[#f2eee5]/85'}`}>{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Alberto Martín trabajando en un rodaje exterior" className="bg-[#171612] px-5 py-5 sm:px-8 sm:py-8 lg:px-12">
        <figure className="mx-auto max-w-[90rem]">
          <Image
            src="/alberto-rodaje-exterior.webp"
            alt="Alberto Martín grabando con cámara y micrófono durante un rodaje exterior"
            width={1658}
            height={680}
            sizes="(max-width: 1536px) 100vw, 1440px"
            className="aspect-video w-full border border-[#f2eee5]/15 object-cover object-center sm:aspect-[829/340]"
          />
          <figcaption className="flex flex-col gap-2 border-x border-b border-[#f2eee5]/15 px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#f2eee5]/50 sm:flex-row sm:items-center sm:justify-between">
            <span>En rodaje · La herramienta al servicio de la mirada</span>
            <span className="text-[#ff5a2a]">Experiencia audiovisual real</span>
          </figcaption>
        </figure>
      </section>

      <section className="border-b border-[#f2eee5]/15 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[90rem] flex-wrap gap-x-9 gap-y-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f2eee5]/45">
          <span>Online · 90 minutos</span><span className="text-[#ff5a2a]">●</span><span>Una sola prioridad</span><span className="text-[#ff5a2a]">●</span><span className="text-[#ff5a2a]">{availabilityLabel}</span><span className="text-[#ff5a2a]">●</span><span>Diseño sobre tu caso real</span>
        </div>
      </section>

      <section id="encaje" className="bg-[#f2eee5] px-5 py-24 text-[#171612] sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 border-b border-[#171612] pb-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#b43414]">01 / El punto de partida</p>
            <div className="min-w-0">
              <h2 className="font-editorial max-w-4xl break-words text-balance text-[clamp(3rem,6vw,6.4rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                No necesitas cuarenta herramientas. Necesitas construir la que encaja con tu forma de trabajar.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#171612]/65">
                Para filmmakers, videógrafos, fotógrafos y pequeños equipos creativos. Estos son los cinco sistemas que forman el mapa de un negocio audiovisual. En la sesión los revisamos, los priorizamos según tu caso y empezamos por el que más te está frenando.
              </p>
            </div>
          </div>

          <div className="mt-6">
            {situations.map(([number, title, text]) => (
              <article key={number} className="group grid gap-3 border-b border-[#171612]/25 py-6 sm:grid-cols-[70px_1fr_1.25fr] sm:items-baseline sm:gap-8">
                <span className="font-mono text-[10px] font-bold text-[#b43414]">{number}</span>
                <h3 className="text-xl font-black tracking-[-0.025em] sm:text-2xl">{title}</h3>
                <p className="max-w-xl leading-7 text-[#171612]/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="border-b border-[#f2eee5]/15 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">02 / Noventa minutos</p>
            <div>
              <h2 className="max-w-4xl text-balance text-[clamp(3rem,6vw,6.4rem)] font-black leading-[0.88] tracking-[-0.065em]">
                Un problema real. <span className="font-editorial font-normal italic text-[#ff5a2a]">Un primer sistema.</span>
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#f2eee5]/58">
                La sesión está diseñada para entender tu caso, tomar decisiones y trabajar sobre una solución propia: desde el flujo y las instrucciones hasta un primer prototipo cuando sea viable.
              </p>
            </div>
          </div>

          <figure className="mt-16 grid items-start gap-6 border-t border-[#f2eee5]/20 pt-6 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <figcaption>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Trabajo en curso</p>
              <p className="mt-4 max-w-sm leading-7 text-[#f2eee5]/58">La sesión no se queda en hablar de herramientas: bajamos la idea a decisiones, pruebas y una forma de trabajar que puedas repetir.</p>
            </figcaption>
            <Image
              src="/alberto-rodaje-interior.webp"
              alt="Alberto Martín levantando la cámara para grabar durante un rodaje interior"
              width={1362}
              height={732}
              sizes="(max-width: 1023px) 100vw, 64vw"
              className="aspect-video w-full border border-[#f2eee5]/15 object-cover object-center grayscale-[12%] contrast-[1.04]"
            />
          </figure>

          <div className="mt-20 grid border-y border-[#f2eee5]/20 lg:grid-cols-3">
            {[
              ['15 min', 'Aterrizamos', 'Tu negocio, el cuello de botella y qué resultado sería verdaderamente útil.'],
              ['60 min', 'Diseñamos y construimos', 'Creamos el flujo o una primera herramienta contigo, usando tus ejemplos, clientes o contenido.'],
              ['15 min', 'Decidimos', 'Cerramos con tu mapa: los cinco sistemas priorizados y cuál construimos primero.'],
            ].map(([time, title, text], index) => (
              <article key={`${time}-${title}`} className={`py-8 lg:px-8 lg:py-10 ${index > 0 ? 'border-t border-[#f2eee5]/20 lg:border-l lg:border-t-0' : ''}`}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">{time}</span>
                <h3 className="mt-12 text-3xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 max-w-sm leading-7 text-[#f2eee5]/60">{text}</p>
              </article>
            ))}
          </div>

          {!soldOut && (
            <div className="mt-10 flex flex-col gap-5 border-b border-[#f2eee5]/20 pb-10 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-black">¿Tienes ya una prioridad en mente?</p><p className="mt-1 text-sm text-[#f2eee5]/58">Desde 75 € precio final · fecha confirmada en 48 h laborables.</p></div>
              <a href="#sesion" onClick={() => AnalyticsEvents.clickCTA('method', 'Ver modalidades')} className="group inline-flex min-h-14 items-center justify-center gap-4 border border-[#ff5a2a] bg-[#ff5a2a] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#171612] hover:bg-[#f2eee5]">Ver modalidades <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
            </div>
          )}
        </div>
      </section>

      <section id="proyectos" className="bg-[#ff5a2a] px-5 py-20 text-[#171612] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <header className="grid gap-8 border-b border-[#171612]/55 pb-10 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Proyectos propios</p>
            <div>
              <h2 className="font-editorial max-w-3xl text-balance text-[clamp(3rem,6vw,6.2rem)] font-semibold leading-[0.9] tracking-[-0.055em]">Casos de uso propios reales</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#171612]/68">Dos herramientas nacidas de problemas reales del trabajo audiovisual. Una todavía se está construyendo; la otra ya puede probarse.</p>
            </div>
          </header>

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <article>
              <figure className="relative overflow-hidden border border-[#171612]/60 bg-[#171612]">
                <Image src="/cutwise-desarrollo.webp" alt="Interfaz de Cutwise preparando un timeline a partir del material grabado" width={1800} height={1026} className="aspect-[16/9] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.015]" />
                <figcaption className="absolute left-0 top-0 border-b border-r border-[#ff5a2a] bg-[#171612] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Lab 01 · En desarrollo</figcaption>
              </figure>
              <div className="mt-6 grid gap-4 border-t border-[#171612]/45 pt-5 sm:grid-cols-[8rem_1fr]">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Cutwise</p>
                <div>
                  <h3 className="text-2xl font-black tracking-[-0.035em]">Del material grabado a un timeline listo para editar.</h3>
                  <p className="mt-3 max-w-lg leading-7 text-[#171612]/72">Cutwise analiza el material, descarta tomas falsas, detecta tomas buenas y B-roll, y prepara una primera edición con subtítulos, música y transiciones. El objetivo es ahorrar horas de selección y montaje inicial sin sustituir el criterio del editor.</p>
                  <dl className="mt-6 grid gap-px border border-[#171612]/35 bg-[#171612]/35 sm:grid-cols-3">
                    <div className="bg-[#ff5a2a] p-3"><dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Entrada</dt><dd className="mt-2 text-xs font-semibold leading-5">Material bruto</dd></div>
                    <div className="bg-[#ff5a2a] p-3"><dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Proceso</dt><dd className="mt-2 text-xs font-semibold leading-5">Análisis y selección</dd></div>
                    <div className="bg-[#ff5a2a] p-3"><dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Salida</dt><dd className="mt-2 text-xs font-semibold leading-5">Timeline preparado</dd></div>
                  </dl>
                </div>
              </div>
            </article>

            <article className="lg:mt-20">
              <a href="https://vilens.es/" target="_blank" rel="noopener noreferrer" className="group block" aria-label="Abrir Vilens, piloto gratuito">
                <figure className="relative overflow-hidden border border-[#171612]/60 bg-[#171612]">
                  <Image src="/vilens-piloto.webp" alt="Web de Vilens mostrando el análisis visual de un reel" width={1800} height={1774} className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]" />
                  <figcaption className="absolute left-0 top-0 border-b border-r border-[#ff5a2a] bg-[#171612] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Piloto abierto · Gratis por ahora</figcaption>
                </figure>
              </a>
              <div className="mt-6 grid gap-4 border-t border-[#171612]/45 pt-5 sm:grid-cols-[8rem_1fr]">
                <a href="https://vilens.es/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] underline decoration-[#171612]/35 underline-offset-4 hover:decoration-[#171612]">
                  Vilens <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <div>
                  <h3 className="text-2xl font-black tracking-[-0.035em]">La IA que audita tus reels antes de publicar.</h3>
                  <p className="mt-3 max-w-lg leading-7 text-[#171612]/72">Vilens analiza el propio vídeo y señala oportunidades concretas de claridad, gancho, ritmo y confianza. El piloto está vivo y puedes utilizarlo gratis por ahora en <a href="https://vilens.es/" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">vilens.es</a>.</p>
                  <dl className="mt-6 grid gap-px border border-[#171612]/35 bg-[#171612]/35 sm:grid-cols-3">
                    <div className="bg-[#ff5a2a] p-3"><dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Entrada</dt><dd className="mt-2 text-xs font-semibold leading-5">Reel antes de publicar</dd></div>
                    <div className="bg-[#ff5a2a] p-3"><dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Proceso</dt><dd className="mt-2 text-xs font-semibold leading-5">Auditoría audiovisual</dd></div>
                    <div className="bg-[#ff5a2a] p-3"><dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">Salida</dt><dd className="mt-2 text-xs font-semibold leading-5">Cambios accionables</dd></div>
                  </dl>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">03 / Alberto Martín</p>
          <div>
            <blockquote className="font-editorial max-w-5xl text-balance text-[clamp(2.6rem,5.5vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.05em]">
              “Uno audiovisual e informática para diseñar herramientas a partir de problemas que conozco desde dentro.”
            </blockquote>
            <div className="mt-10 grid gap-8 border-t border-[#f2eee5]/20 pt-8 md:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] md:gap-10">
              <figure>
                <Image
                  src="/alberto-camara-escaleras.webp"
                  alt="Alberto Martín sentado en unas escaleras con una cámara durante una pausa de rodaje"
                  width={1200}
                  height={2144}
                  sizes="(max-width: 767px) 100vw, 34vw"
                  className="aspect-[4/5] w-full border border-[#f2eee5]/15 object-cover object-[center_58%] grayscale-[10%] contrast-[1.03]"
                />
                <figcaption className="border-x border-b border-[#f2eee5]/15 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#f2eee5]/45">Filmmaker antes que consultor</figcaption>
              </figure>
              <div>
                <p className="text-lg leading-8 text-[#f2eee5]/58">Como filmmaker e ingeniero informático, trabajo entre producción, edición, contenido, clientes y desarrollo. La tecnología viene después del problema, no antes.</p>
                <p className="mt-7 text-lg leading-8 text-[#f2eee5]/58">No voy a decirte que la IA hará tu trabajo por ti. Vamos a decidir qué puede simplificar y qué debe seguir bajo tu criterio. La idea es que aceleres tu productividad y empieces a delegar tareas que te aburren o te quitan tiempo.</p>
                <aside className="mt-8 border-l-2 border-[#ff5a2a] pl-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">El objetivo de fondo</p>
                  <p className="font-editorial mt-4 text-2xl font-medium leading-8 tracking-[-0.025em] text-[#f2eee5]">La idea es que consigas ser totalmente independiente con el uso de la IA en tu negocio y seas capaz de hacer casi cualquier cosa que se te pase por la cabeza.</p>
                </aside>
                <a href="https://www.instagram.com/amartinro/" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-[#ff5a2a] hover:text-[#f2eee5]">
                  @amartinro <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sesion" className="bg-[#f2eee5] px-5 py-24 text-[#171612] sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[90rem] border-y border-[#171612] py-10 sm:py-14">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#b43414]">Oferta de lanzamiento · {availabilityLabel.toLowerCase()}</p>
            <h2 className="mt-7 max-w-5xl text-balance text-[clamp(2.1rem,10.5vw,2.55rem)] font-black leading-[0.86] tracking-[-0.065em] sm:text-[clamp(3.4rem,7vw,7.8rem)] sm:leading-[0.82] sm:tracking-[-0.075em]">
              Elige tu ritmo. <span className="font-editorial font-normal italic text-[#b43414]">Una sesión suelta o construir tu sistema mes a mes.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#171612]/65">Las dos modalidades empiezan con la misma sesión práctica de 90 minutos. La diferencia es si después quieres construir el mapa completo, un sistema cada mes.</p>
            <PurchaseAvailabilityDisplay remainingSlots={displayedSlots} />
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <article className="flex flex-col border border-[#171612] p-6 sm:p-8">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-[#b43414]">Sesión estratégica</p>
              <h3 className="font-editorial mt-7 max-w-xl text-[2.35rem] font-semibold leading-[0.95] tracking-[-0.045em] sm:text-5xl">Desbloquea el uso de la IA en tu negocio</h3>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#171612]/68">Vemos qué casos de uso reales puedes aplicar a tu flujo de trabajo y establecemos un plan para que puedas empezar a implementarlos.</p>
              <div className="mt-7 flex items-end gap-3"><span className="text-4xl font-black tracking-[-0.065em] sm:text-5xl">75 €</span><span className="pb-1.5 text-sm font-bold">precio final</span></div>
              <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#b43414]">Precio piloto · primeras 5 plazas</p>
              <p className="mt-2 text-xs leading-5 text-[#171612]/58">Precio previsto después del piloto: <strong className="font-extrabold text-[#171612]">149 €</strong></p>
              <ul className="mt-7 flex-1 space-y-3 border-t border-[#171612]/20 pt-6 text-sm font-semibold">
                {['Revisión previa del briefing', 'Sesión online de 90 minutos', 'Diseño sobre tu caso real', 'Primer prototipo cuando sea viable', 'El mapa de tus cinco sistemas, priorizado', 'Una consulta breve por email durante 7 días'].map((item) => (
                  <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#b43414]" />{item}</li>
                ))}
              </ul>
              <div className="mt-8">{soldOut ? <span className="inline-flex min-h-14 w-full items-center justify-center border border-[#171612]/30 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#171612]/55">Edición completa</span> : <CheckoutButton location="pricing_session" plan="session" inverse>Trabajar mi prioridad</CheckoutButton>}</div>
            </article>

            <article className="flex flex-col border border-[#171612] bg-[#171612] p-6 text-[#f2eee5] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-[#ff5a2a]">Suscripción mensual</p><span className="border border-[#ff5a2a] px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#ff5a2a]">Primer mes</span></div>
              <h3 className="font-editorial mt-7 max-w-xl text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.04em] sm:text-[2.65rem]">Implementación · primer mes</h3>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#f2eee5]/68">Construimos el primer sistema de tu mapa y lo dejamos funcionando. A partir de ahí, uno nuevo cada mes.</p>
              <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-2">
                <span className="text-4xl font-black tracking-[-0.065em] sm:text-5xl">199 €</span>
                <s className="pb-1.5 text-base font-bold text-[#f2eee5]/70"><span className="sr-only">Precio habitual: </span>349 €</s>
              </div>
              <p className="mt-2 text-sm font-bold text-[#f2eee5]/78">precio final · primer mes</p>

              <div className="mt-7 border border-[#ff5a2a]/60 bg-[#ff5a2a]/[0.08] p-4 sm:p-5">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Después:</span>
                  <strong className="text-2xl font-black tracking-[-0.04em]">149 €/mes</strong>
                  <s className="text-sm font-bold text-[#f2eee5]/70"><span className="sr-only">Precio habitual: </span>199 €/mes</s>
                </p>
                <p className="mt-4 text-sm font-semibold leading-6 text-[#f2eee5]/82">Conservas 149 €/mes mientras mantengas la suscripción.</p>
                <p className="mt-1 text-sm leading-6 text-[#f2eee5]/65">Sin permanencia: puedes cancelar cuando quieras.</p>
              </div>

              <p className="mt-5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Precio piloto · primeras 5 plazas</p>
              <ul className="mt-7 space-y-3 border-t border-[#f2eee5]/20 pt-6 text-sm font-semibold" aria-label="Incluido durante el primer mes">
                {firstMonthItems.map((item) => (
                  <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a2a]" aria-hidden="true" />{item}</li>
                ))}
              </ul>

              <details className="group mt-7 border-t border-[#f2eee5]/20 md:hidden">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#ff5a2a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a2a] [&::-webkit-details-marker]:hidden">
                  <span>Ver qué incluye cada mes siguiente</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                </summary>
                <p className="border-t border-[#f2eee5]/12 pt-5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Cada mes siguiente · 149 €</p>
                <ul className="mt-5 space-y-3 text-sm font-semibold" aria-label="Incluido cada mes siguiente">
                  {continuityItems.map((item) => (
                    <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a2a]" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </details>

              <div className="mt-7 hidden border-t border-[#f2eee5]/20 pt-6 md:block">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff5a2a]">Cada mes siguiente · 149 €</p>
                <ul className="mt-5 space-y-3 text-sm font-semibold" aria-label="Incluido cada mes siguiente">
                  {continuityItems.map((item) => (
                    <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a2a]" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>

              {/* TODO: sustituir por payment link de suscripción */}
              <div className="mt-8">{soldOut ? <span className="inline-flex min-h-14 w-full items-center justify-center border border-[#f2eee5]/30 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#f2eee5]/55">Edición completa</span> : <CheckoutButton location="pricing_subscription" plan="followup30d">Construir mi sistema</CheckoutButton>}</div>
            </article>
          </div>

          <div className="mt-7 grid gap-4 text-xs leading-5 text-[#171612]/60 sm:grid-cols-2">
            <p><ShieldCheck className="mr-1 inline h-3.5 w-3.5" /> Precios finales en el checkout. Stripe no añadirá IVA al total mostrado.</p>
            <p>El acompañamiento no incluye desarrollo completo, integraciones complejas, ejecución por parte de Alberto ni soporte ilimitado.</p>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#171612]/55">El pago reserva una plaza; la fecha se confirma después del briefing. Al continuar aceptas las <Link href="/condiciones" className="underline hover:text-[#b43414]">condiciones de contratación</Link>.</p>

          <div className="mt-14 grid gap-4 border-t border-[#171612]/25 pt-8 sm:grid-cols-3">
            {[
              ['01', 'Pago seguro', 'Pagas y solicitas una fecha con Stripe.'],
              ['02', 'Briefing', 'Completas tu caso y tres horarios preferidos.'],
              ['03', 'Confirmación', 'Alberto confirma la fecha en 48 h laborables.'],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[36px_1fr] gap-3">
                <span className="font-mono text-[10px] font-bold text-[#b43414]">{number}</span>
                <div><p className="font-black">{title}</p><p className="mt-1 text-sm text-[#171612]/55">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">04 / Antes de reservar</p>
            <h2 className="font-editorial mt-5 max-w-md text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl">Preguntas frecuentes</h2>
          </div>
          <div className="border-t border-[#f2eee5]/20">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="border-b border-[#f2eee5]/20">
                  <button type="button" onClick={() => { setOpenFaq(isOpen ? null : index); AnalyticsEvents.viewFAQ(faq.question); }} className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
                    <span className="text-lg font-black tracking-[-0.02em] sm:text-xl">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[#ff5a2a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="max-w-2xl pb-7 pr-10 leading-7 text-[#f2eee5]/55">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#f2eee5]/15 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-black uppercase tracking-[-0.03em]">IA para Filmmakers</p>
            <p className="mt-2 text-sm text-[#f2eee5]/40">Herramientas de IA pensadas desde el trabajo audiovisual.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-[0.08em] text-[#f2eee5]/50">
            <Link href="/contacto" className="hover:text-[#ff5a2a]">Contacto</Link>
            <Link href="/condiciones" className="hover:text-[#ff5a2a]">Condiciones</Link>
            <Link href="/privacidad" className="hover:text-[#ff5a2a]">Privacidad</Link>
            <Link href="/cookies" className="hover:text-[#ff5a2a]">Cookies</Link>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#f2eee5]/30">© {new Date().getFullYear()} Alberto Martín</p>
        </div>
      </footer>
    </main>
  );
}
