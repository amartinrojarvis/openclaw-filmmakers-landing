'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  FileText,
  Loader2,
  Mail,
  MessageSquareText,
  Sparkles,
  Video,
} from 'lucide-react';
import { SectionTitle } from '@/components/section-title';
import { Footer } from '@/components/footer';

// Price IDs de Stripe (públicos, se usan en el checkout)
const PRICE_IDS = {
  guia: 'price_1TE5n7QaHSvmpUvcw14G5MnO',
  bundle: 'price_1TE5n7QaHSvmpUvcGx38ZLa0',
};

const benefits = [
  {
    icon: CalendarClock,
    title: 'Agenda bajo control',
    text: 'Automatiza reuniones, seguimientos y recordatorios sin perseguir cada detalle a mano.',
  },
  {
    icon: Mail,
    title: 'Emails y propuestas más rápidas',
    text: 'Responde leads, prepara presupuestos y ahorra horas en comunicación repetitiva.',
  },
  {
    icon: MessageSquareText,
    title: 'Clientes mejor atendidos',
    text: 'Crea workflows claros para onboarding, feedback y postproducción.',
  },
  {
    icon: Video,
    title: 'Análisis de vídeo con IA',
    text: 'Extrae insights, estructura material y acelera decisiones creativas y operativas.',
  },
  {
    icon: Bot,
    title: 'Automatización realista',
    text: 'Sin humo técnico: procesos concretos que puedes aplicar en tu negocio creativo.',
  },
  {
    icon: Clapperboard,
    title: 'Más tiempo para crear',
    text: 'Menos admin, más rodaje, edición y estrategia para cerrar mejores proyectos.',
  },
];

const faqs = [
  {
    q: '¿Necesito conocimientos técnicos para aplicar la guía?',
    a: 'No. Está pensada para filmmakers y creadores que quieren resultados prácticos, con ejemplos y procesos accionables.',
  },
  {
    q: '¿Qué incluye la sesión de 45 minutos del Bundle?',
    a: 'Todo lo incluido en la guía, más una sesión de 45 minutos 1:1 donde resolvemos dudas específicas y te orientamos sobre cómo aplicar OpenClaw en tu flujo de trabajo específico.',
  },
  {
    q: '¿Esto sirve si trabajo solo o en un estudio pequeño?',
    a: 'Sí. De hecho, es donde más impacto suele tener, porque cada hora recuperada cuenta muchísimo.',
  },
  {
    q: '¿La guía habla solo de teoría o hay implementación?',
    a: 'Incluye enfoque estratégico, ejemplos de uso, código listo para copiar-pegar y una hoja de ruta concreta para empezar desde el primer día.',
  },
];

const offers = [
  {
    name: 'Guía OpenClaw',
    price: '€29',
    badge: 'Guía completa',
    priceId: PRICE_IDS.guia,
    description: 'La forma más rápida de empezar a automatizar tu workflow creativo con OpenClaw.',
    features: [
      '8 capítulos en Notion con acceso de por vida',
      'Instalación paso a paso en Linux/Mac/WSL',
      'Integraciones: Telegram, IA local, APIs',
      'Casos de uso reales: transcripción, análisis de video',
      'Código y configuraciones listas para usar',
      'Actualizaciones incluidas',
    ],
    cta: 'Comprar ahora →',
    featured: false,
  },
  {
    name: 'Guía + Sesión 1:1',
    price: '€127',
    badge: 'RECOMENDADO',
    priceId: PRICE_IDS.bundle,
    description: 'Implementamos tu workflow personalizado juntos. Para quien quiere resultados inmediatos.',
    features: [
      'Todo lo incluido en la guía (€29)',
      'Sesión 1:1 de 45 minutos',
      'Resolución de dudas específicas',
      'Orientación para uso en tu flujo de trabajo específico',
    ],
    cta: 'Reservar sesión →',
    featured: true,
  },
];

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, productName: string) => {
    setLoading(priceId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      
      if (!res.ok) {
        throw new Error('Error en checkout');
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL');
      }
    } catch (err) {
      alert('Error al procesar el pago. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-ink text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(82,229,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_26%),linear-gradient(to_bottom,rgba(7,17,31,0.85),rgba(7,17,31,1))]" />
          <div className="absolute inset-0 bg-grid bg-[length:42px_42px] opacity-20" />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32 lg:pt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan/90 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Guía + sesión 1:1 para filmmakers
            </div>

            <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-300">Menos tareas repetitivas. Más tiempo para crear.</p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  OpenClaw para <span className="text-cyan">Filmmakers</span> que quieren vender más y operar mejor.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  Descubre cómo automatizar agenda, clientes, emails y análisis de vídeo con IA para liberar horas cada semana y enfocarte en rodar, editar y crecer.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={() => handleCheckout(offers[0].priceId, 'guia')}
                    disabled={loading === offers[0].priceId}
                    className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-3 text-base font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-white disabled:opacity-50"
                  >
                    {loading === offers[0].priceId ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                    ) : (
                      'Comprar guía €29 →'
                    )}
                  </button>
                  <Link
                    href="#oferta"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    Ver opciones
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="rounded-full border border-white/10 px-4 py-2">Guía práctica</span>
                  <span className="rounded-full border border-white/10 px-4 py-2">Sesión 1:1 disponible</span>
                  <span className="rounded-full border border-white/10 px-4 py-2">Implementación realista</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 rounded-[2rem] bg-cyan/10 blur-3xl" />
                <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl sm:p-8">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slateGlow p-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-sm text-slate-400">OpenClaw OS</p>
                        <p className="mt-1 text-xl font-semibold">Workflow para filmmakers</p>
                      </div>
                      <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">Activo</div>
                    </div>
                    <div className="mt-6 space-y-4">
                      {[
                        'Inbox → respuestas y seguimiento automático',
                        'Leads → clasificación y prioridad comercial',
                        'Agenda → reuniones y recordatorios sincronizados',
                        'Vídeo → análisis IA para acelerar decisiones',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 p-4">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan" />
                          <span className="text-sm leading-6 text-slate-200">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-cyan/20 to-violet/20 p-4">
                      <p className="text-sm uppercase tracking-[0.28em] text-cyan">Resultado</p>
                      <p className="mt-2 text-lg font-medium text-white">Menos fricción operativa. Más foco en creatividad, clientes y facturación.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="Problema"
            title="¿Cansado de perder tiempo en tareas administrativas?"
            description="Si eres filmmaker o videógrafo, seguramente tu valor está en la creatividad, la ejecución y la visión. Pero cada semana se te van horas entre emails, coordinación, seguimiento de clientes y organización interna."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              'Presupuestos que se retrasan por falta de sistema',
              'Leads y clientes desperdigados en mil herramientas',
              'Demasiado trabajo operativo para un negocio creativo ágil',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-200">
                <p className="text-lg font-medium leading-7">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <SectionTitle
              eyebrow="Solución"
              title="OpenClaw automatiza el backend de tu negocio creativo"
              description="Esta guía te enseña a convertir OpenClaw en un sistema operativo para filmmakers: desde agenda y gestión de clientes hasta emails, análisis de vídeo e inteligencia operativa para tomar mejores decisiones."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-4">
              {[
                'Centraliza conversaciones, tareas y próximos pasos',
                'Reduce trabajo manual en ventas y seguimiento',
                'Detecta cuellos de botella en tu workflow',
                'Crea una operación más escalable sin perder toque creativo',
              ].map((item, index) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-ink p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan">0{index + 1}</p>
                  <p className="mt-4 text-lg font-medium leading-7 text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="Beneficios"
            title="Lo que ganas cuando automatizas con intención"
            description="No se trata de meter IA por moda. Se trata de construir un workflow más rentable, más ligero y más profesional."
            centered
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Technical Requirements Notice */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <AlertTriangle className="h-6 w-6 shrink-0 text-amber-400" />
              <div>
                <h3 className="text-lg font-semibold text-amber-200">Nota técnica</h3>
                <p className="mt-2 leading-7 text-amber-100/80">
                  El uso de modelos de IA locales requiere equipo potente (GPU recomendada). 
                  El uso de modelos en la nube conlleva un coste de suscripción al proveedor 
                  (OpenAI, Anthropic, etc.).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="oferta" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <SectionTitle
              eyebrow="Oferta"
              title="Elige la forma de implementar OpenClaw en tu workflow"
              description="Empieza con la guía o acelera resultados con una sesión estratégica personalizada."
              centered
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {offers.map((offer) => (
                <article
                  key={offer.name}
                  className={`rounded-[2rem] border p-8 ${
                    offer.featured
                      ? 'border-cyan bg-gradient-to-b from-cyan/15 to-white/5 shadow-glow'
                      : 'border-white/10 bg-ink'
                  }`}
                >
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${offer.featured ? 'bg-cyan text-slate-950' : 'bg-white/10 text-white'}`}>
                    {offer.badge}
                  </span>
                  <h3 className="mt-5 text-3xl font-semibold">{offer.name}</h3>
                  <p className="mt-3 text-slate-300">{offer.description}</p>
                  <div className="mt-8 text-5xl font-semibold text-white">{offer.price}</div>
                  <ul className="mt-8 space-y-4">
                    {offer.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-slate-200">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(offer.priceId, offer.name)}
                    disabled={loading === offer.priceId}
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition ${
                      offer.featured
                        ? 'bg-cyan text-slate-950 hover:bg-white'
                        : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                    } disabled:opacity-50`}
                  >
                    {loading === offer.priceId ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                    ) : (
                      offer.cta
                    )}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="FAQ"
            title="Preguntas frecuentes"
            description="Lo esencial para decidir rápido si esto encaja contigo y tu forma de trabajar."
            centered
          />
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-3xl border border-white/10 bg-white/5 p-6">
                <summary className="cursor-pointer list-none text-lg font-medium text-white">{faq.q}</summary>
                <p className="mt-4 leading-7 text-slate-300">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="cta" className="pb-20">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan/20 via-white/5 to-violet/20 p-8 text-center shadow-glow sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan">Empieza hoy</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Convierte OpenClaw en tu ventaja operativa creativa.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Si quieres dejar de improvisar procesos y empezar a escalar con estructura, esta guía es tu siguiente paso.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => handleCheckout(offers[0].priceId, 'guia')}
                  disabled={loading === offers[0].priceId}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-white disabled:opacity-50"
                >
                  {loading === offers[0].priceId ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                  ) : (
                    <>
                      Comprar guía €29
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <Link
                  href="#oferta"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Ver opciones
                </Link>
              </div>
              <p className="mt-6 text-sm text-emerald-300">✓ Pago seguro con Stripe • Acceso inmediato</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
