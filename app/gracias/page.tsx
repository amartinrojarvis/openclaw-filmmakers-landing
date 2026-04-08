'use client';

import Link from 'next/link';
import { CheckCircle, Download, Mail, Calendar } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { PageLayout } from '@/components/PageLayout';

function GraciasContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      console.log('Sesión de checkout:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      {/* Icono de éxito */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#00ff88]" />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-medium text-white mb-6">
        ¡Gracias por tu <span className="text-[#00ff88]">compra</span>!
      </h1>

      {/* Descripción */}
      <p className="text-xl text-white/60 mb-8">
        Tu pedido ha sido procesado correctamente. En breve recibirás un email
        con todos los detalles y acceso a tu producto.
      </p>

      {/* Próximos pasos */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-8 mb-8 text-left">
        <h2 className="text-xl font-medium text-white mb-6 text-center">
          ¿Qué sigue ahora?
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#00ff88]/10 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">Revisa tu email</h3>
              <p className="text-white/50 text-sm">
                Hemos enviado tu guía y los detalles de acceso a tu correo.
                Si no lo ves en la bandeja de entrada, revisa spam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#aa00ff]/10 rounded-lg flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[#aa00ff]" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">Descarga tu guía</h3>
              <p className="text-white/50 text-sm">
                El email incluye un enlace directo para acceder a tu guía
                OpenClaw para Filmmakers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#00ff88]/10 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">¿Compraste el bundle?</h3>
              <p className="text-white/50 text-sm">
                Si elegiste la opción con sesión 1:1, también encontrarás
                instrucciones para agendar tu consultoría personalizada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soporte */}
      <div className="text-white/40 text-sm mb-8">
        ¿Tienes alguna pregunta?{' '}
        <Link
          href="/contacto"
          className="text-[#00ff88] hover:underline"
        >
          Contáctanos
        </Link>
      </div>

      {/* CTA Volver */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <PageLayout showBackButton={false}>
      <Suspense fallback={
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-[#00ff88]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-6">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-xl text-white/60">Cargando detalles...</p>
        </div>
      }>
        <GraciasContent />
      </Suspense>
    </PageLayout>
  );
}
