import Link from 'next/link';
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  Mail,
  MessageSquareText,
  Sparkles,
  Video,
} from 'lucide-react';
import { SectionTitle } from '@/components/section-title';

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
    q: '¿Qué incluye la consultoría de 30 minutos?',
    a: 'Una sesión para revisar tu flujo actual, detectar cuellos de botella y definir automatizaciones prioritarias para tu caso.',
  },
  {
    q: '¿Esto sirve si trabajo solo o en un estudio pequeño?',
    a: 'Sí. De hecho, es donde más impacto suele tener, porque cada hora recuperada cuenta muchísimo.',
  },
  {
    q: '¿La guía habla solo de teoría o hay implementación?',
    a: 'Incluye enfoque estratégico, ejemplos de uso y una hoja de ruta concreta para empezar a implementar desde el primer día.',
  },
];

const offers = [
  {
    name: 'PDF Guía',
    price: '€39',
    description: 'Perfecto para empezar por tu cuenta con un sistema claro y accionable.',
    features: [
      'Guía práctica OpenClaw para filmmakers',
      'Casos de uso en agenda, clientes y emails',
      'Framework de automatización creativa',
      'Checklist de implementación rápida',
    ],
    cta: 'Quiero la guía',
    href: '#cta',
    featured: false,
  },
  {
    name: 'PDF + Consultoría 30min',
    price: '€99',
    description: 'La opción recomendada si quieres adaptar OpenClaw a tu workflow cuanto antes.',
    features: [
      'Todo lo incluido en la guía',
      'Sesión estratégica 1:1 de 30 minutos',
      'Priorización de automatizaciones',
      'Recomendaciones personalizadas según tu negocio',
    ],
    cta: 'Quiero la opción pro',
    href: '#cta',
    featured: true,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(82,229,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_26%),linear-gradient(to_bottom,rgba(7,17,31,0.85),rgba(7,17,31,1))]" />
        <div className="absolute inset-0 bg-grid bg-[length:42px_42px] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32 lg:pt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan/90 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Nuevo producto digital para filmmakers
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
                <Link
                  href="#oferta"
                  className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-3 text-base font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-white"
                >
                  Ver oferta
                </Link>
                <Link
                  href="#faq"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Resolver dudas
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 px-4 py-2">Guía práctica</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Consultoría 1:1</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Aplicable desde ya</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[2rem] bg-cyan/10 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl sm:p-8">
                <div className="rounded-[1.5rem] border border-white/10 bg-slateGlow p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm text-slate-400">Workflow Stack</p>
                      <p className="mt-1 text-xl font-semibold">OpenClaw OS</p>
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
                {offer.featured ? (
                  <span className="inline-flex rounded-full bg-cyan px-3 py-1 text-sm font-semibold text-slate-950">Más elegida</span>
                ) : null}
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
                <Link
                  href={offer.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition ${
                    offer.featured
                      ? 'bg-cyan text-slate-950 hover:bg-white'
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {offer.cta}
                </Link>
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
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan">CTA Final</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Convierte OpenClaw en tu ventaja operativa creativa.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Si quieres dejar de improvisar procesos y empezar a escalar con estructura, esta guía es tu siguiente paso.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="mailto:hola@example.com?subject=Quiero%20OpenClaw%20para%20Filmmakers"
                className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-white"
              >
                Comprar ahora
              </Link>
              <Link
                href="#oferta"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Ver opciones
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-300">* CTA conectada provisionalmente por email hasta definir checkout final.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
