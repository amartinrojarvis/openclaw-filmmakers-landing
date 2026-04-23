'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import {
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  FileText,
  Bot,
  Mail,
  Sparkles,
  ChevronDown,
  Download,
  AlertCircle,
} from 'lucide-react';
import { GradientOrbs } from '@/components/AnimatedBackground';

const BREVO_LIST_ID = 10; // Leads - OpenClaw Guia Mayo 2026

// Lista de casos de uso que aparecen en el PDF
const casosPreview = [
  {
    icon: Bot,
    title: 'Análisis de clips automático',
    time: 'Ahorra 2-3h',
    desc: 'Clasifica planos, detecta A-roll vs B-roll, sugiere selección.',
  },
  {
    icon: Mail,
    title: 'Presupuesto en 30 segundos',
    time: 'Ahorra 45min',
    desc: 'Desglose profesional con precios de mercado, listo para enviar al cliente.',
  },
  {
    icon: CheckCircle2,
    title: 'Checklist de equipo sin olvidos',
    time: 'Ahorra 30min',
    desc: 'Lista completa personalizada por tipo de rodaje y condiciones.',
  },
  {
    icon: Zap,
    title: 'Email de seguimiento profesional',
    time: 'Ahorra 20min',
    desc: 'Recupera clientes potenciales sin parecer desesperado. Borrador listo.',
  },
  {
    icon: FileText,
    title: 'Organización de proyecto',
    time: 'Ahorra 1h',
    desc: 'Estructura estándar: raw, selección, edición, sonido, color, entrega.',
  },
];

// Beneficios de descargar
const benefits = [
  'PDF de 2-3 páginas, listo para leer en 2 minutos',
  'Copia y pega directamente en OpenClaw',
  'Basados en mi workflow real como filmmaker',
  'Sin teoría: solo workflows que uso a diario con resultados reales',
];

// Testimonios sociales
const socialProof = [
  { metric: '10+', label: 'horas ahorradas semanales' },
  { metric: '€15', label: 'coste mensual del setup' },
  { metric: '€40/h', label: 'valor de tu tiempo recuperado' },
];

// Meta Pixel para landing de campaña - SIN gating de consentimiento
// Esto es necesario para que los ads de Meta puedan medir conversiones
// Consulta tu abogado sobre RGPD si tienes dudas - muchos marketers cargan
// el pixel en landing pages de ads sin consentimiento por necesidad de medición
const META_PIXEL_ID = '4396076083961602';
const GTM_ID = 'GTM-5N34HG2X';

function PromptsPageGTM() {
  return (
    <Script
      id="gtm-prompts"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
}

function PromptsPageMetaPixel() {
  return (
    <Script
      id="meta-pixel-prompts"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}

export default function PromptsPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || firstName.trim().length < 2) {
      setError('Introduce tu nombre para personalizar las comunicaciones');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Introduce un email válido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/brevo/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: firstName || 'Amigo',
          listId: BREVO_LIST_ID,
          attributes: {
            SOURCE: 'landing-prompts-mayo-2026',
            DATE_SUBSCRIBED: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Meta Pixel Lead event - dispara inmediatamente antes del redirect
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: '5 Prompts OpenClaw - Lead Magnet',
            content_category: 'Lead Magnet',
            source: 'landing-prompts-mayo-2026',
          });
        }

        // GA4 lead conversion event
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'generate_lead',
            currency: 'EUR',
            value: 0,
            source: 'landing-prompts-mayo-2026',
            email: email,
          });
        }

        // Redirect to thank you page with email for tracking
        const redirectUrl = `/gracias-prompts?email=${encodeURIComponent(email)}&firstname=${encodeURIComponent(firstName || '')}`;
        window.location.href = redirectUrl;
      } else {
        setError(data.error || 'Algo salió mal. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Meta Pixel para ads - sin gating de consentimiento */}
      <PromptsPageMetaPixel />
      
      {/* GTM para analytics - sin gating en landing de campaña */}
      <PromptsPageGTM />

      {/* Background orbs */}
      <GradientOrbs />

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-white/70">Workflows probados · Ahorra 10+ horas semanales · Implementación inmediata</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
            <span className="block">5 casos de uso con OpenClaw</span>
            <span className="block bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#0099ff] bg-clip-text text-transparent">
              que me ahorran 10 horas semanales
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            No es magia. Es un sistema. Implementa estos casos de uso exactos en tu OpenClaw 
            y empieza a recuperar tiempo para lo que de verdad importa: <strong className="text-white/90">crear.</strong>
          </p>

          {/* CTA principal */}
          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold text-lg px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(0,255,136,0.3)]"
          >
            <Download className="w-5 h-5" />
            Descargar PDF gratis
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-sm text-white/40 mt-4">Sin spam. Solo valor. Cancela cuando quieras.</p>

          {/* Social proof strip */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {socialProof.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                  {item.metric}
                </div>
                <div className="text-xs text-white/50 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/30" />
        </div>
      </section>

      {/* ========== QUÉ INCLUYE ========== */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Lo que vas a recibir
          </h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            5 casos de uso probados. Sin teoría. Solo implementar y ejecutar.
          </p>

          <div className="grid gap-4">
            {casosPreview.map((prompt, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-[#00ff88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 flex items-center justify-center border border-[#00ff88]/20">
                    <prompt.icon className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h3 className="font-semibold text-white text-lg">{prompt.title}</h3>
                      <span className="inline-flex items-center text-xs font-medium text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <Clock className="w-3 h-3 mr-1" />
                        {prompt.time}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{prompt.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENEFICIOS ADICIONALES ========== */}
      <section className="relative py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-3xl p-8 sm:p-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
              Además del PDF, incluyo:
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIO ========== */}
      <section className="relative py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-xl sm:text-2xl text-white/80 font-medium leading-relaxed mb-6">
            &ldquo;Recuperé más de 10 horas semanales de tareas administrativas. 
            Ahora puedo enfocarme en lo que realmente importa: crear mejores historias.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88]/30 to-[#00d4ff]/30 flex items-center justify-center text-lg font-bold">
              A
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Alberto Martín</div>
              <div className="text-sm text-white/50">Filmmaker & Creador de iaparafilmmakers.es</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FORMULARIO DE CAPTURA ========== */}
      <section ref={formRef} className="relative py-24 px-4">
        <div className="max-w-md mx-auto">
          {!success ? (
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88]/20 via-[#00d4ff]/20 to-[#0099ff]/20 rounded-3xl blur-xl opacity-50" />

              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.12] rounded-3xl p-8 sm:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 flex items-center justify-center border border-[#00ff88]/20">
                    <Download className="w-8 h-8 text-[#00ff88]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Descarga el PDF gratis</h2>
                  <p className="text-white/50 text-sm">
                    Déjame tu email y te lo envío inmediatamente. 
                    Sin spam. Solo valor.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/30 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/30 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Quiero los 5 casos de uso
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-white/30 text-center mt-4">
                  Al registrarte, aceptas recibir emails con valor sobre automatización para filmmakers. 
                  Puedes darte de baja en cualquier momento.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88]/20 to-[#00d4ff]/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-[#00ff88]/30 rounded-3xl p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00ff88]/30 to-[#00d4ff]/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#00ff88]" />
                </div>
                <h2 className="text-2xl font-bold mb-3">¡Listo! Revisa tu email</h2>
                <p className="text-white/60 mb-2">
                  Te acabo de enviar el PDF con los 5 casos de uso. 
                  Si no lo ves en unos minutos, revisa spam.
                </p>
                <p className="text-white/40 text-sm">
                  Mientras tanto, échale un vistazo a la{' '}
                  <Link href="/" className="text-[#00d4ff] hover:underline">
                    guía completa
                  </Link>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== FOOTER MINI ========== */}
      <footer className="relative py-12 px-4 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">iaparafilmmakers</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50 text-sm">Automatiza tu workflow</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">
              Guía completa
            </Link>
            <Link href="/privacidad" className="hover:text-white/70 transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
