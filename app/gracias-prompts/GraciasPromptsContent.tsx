'use client';

import { Suspense } from 'react';
import { CheckCircle2, Mail, Sparkles, ArrowRight, Share2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackEvent } from '@/components/Analytics';

function GraciasPromptsContentInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const firstName = searchParams.get('firstname');

  useEffect(() => {
    // Pageview tracking for thank you page
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        pagePath: '/gracias-prompts',
        pageTitle: 'PDF en camino | IA para Filmmakers',
      });
    }

    // GA4 lead conversion event
    trackEvent('generate_lead', {
      currency: 'EUR',
      value: 0,
      source: 'landing-prompts-mayo-2026',
      email: email || 'unknown',
    });

    // Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: '5 Prompts OpenClaw - Lead Magnet',
        content_category: 'Lead Magnet',
        source: 'landing-prompts-mayo-2026',
      });
    }

    // Log for debugging
    console.log('[Tracking] /gracias-prompts - Lead conversion tracked', {
      email,
      firstName,
      source: 'landing-prompts-mayo-2026',
    });
  }, [email, firstName]);

  const displayName = firstName ? `, ${firstName}` : '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/30 to-[#00d4ff]/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 rounded-full flex items-center justify-center border border-[#00ff88]/30">
            <CheckCircle2 className="w-12 h-12 text-[#00ff88]" />
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        ¡PDF en camino{displayName}!
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-white/60 mb-8 max-w-lg mx-auto">
        Te he enviado los 5 prompts de OpenClaw a tu email
        {email && (
          <span className="block mt-1 text-[#00ff88] font-medium">
            {email}
          </span>
        )}
      </p>

      {/* Checklist of what happens next */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00ff88]" />
          Qué hacer ahora
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00ff88]/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-[#00ff88]" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">Revisa tu email</h3>
              <p className="text-white/50 text-sm">
                Si no lo ves en 2-3 minutos, revisa la carpeta de spam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">Copia los prompts</h3>
              <p className="text-white/50 text-sm">
                Ábrelos en OpenClaw y empieza a automatizar tu workflow hoy.
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* Share CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <a
          href="mailto:?subject=Mira estos prompts de OpenClaw para filmmakers&body=Hola, echale un vistazo a estos 5 prompts de OpenClaw que me ahorran 10 horas semanales: https://www.iaparafilmmakers.es/prompts"
          className="group inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/20"
        >
          <Share2 className="w-5 h-5" />
          Compártelo con otro filmmaker
        </a>
      </div>

      {/* Share prompt */}
      <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
        <Share2 className="w-4 h-4" />
        <span>Si te resulten útiles los prompts, compártelo con otro filmmaker</span>
      </div>

      {/* Support link */}
      <div className="mt-12 text-white/30 text-sm">
        ¿No has recibido el email?{' '}
        <a
          href="mailto:alberto@tuvideopromocional.es"
          className="text-[#00ff88] hover:underline"
        >
          Escríbeme
        </a>
      </div>
    </div>
  );
}

export function GraciasPromptsContent() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-white/30" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            ¡PDF en camino!
          </h1>
          <p className="text-white/50">Cargando...</p>
        </div>
      }
    >
      <GraciasPromptsContentInner />
    </Suspense>
  );
}
