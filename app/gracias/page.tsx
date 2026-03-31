'use client';

import Link from 'next/link';
import { CheckCircle, Download, Mail, Calendar } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function GraciasContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionDetails, setSessionDetails] = useState<{
    customerEmail?: string;
    amountTotal?: number;
  } | null>(null);

  useEffect(() => {
    // Opcional: Recuperar detalles de la sesión para mostrar confirmación personalizada
    if (sessionId) {
      // Aquí podríamos hacer una llamada a la API para obtener detalles de la sesión
      console.log('Sesión de checkout:', sessionId);
    }
  }, [sessionId]);

  return (
    <>
      {/* Icono de éxito */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        ¡Gracias por tu compra!
      </h1>

      {/* Descripción */}
      <p className="text-xl text-zinc-400 mb-8">
        Tu pedido ha sido procesado correctamente. En breve recibirás un email
        con todos los detalles y acceso a tu producto.
      </p>

      {/* Próximos pasos */}
      <div className="bg-zinc-900/50 rounded-2xl p-8 mb-8 text-left">
        <h2 className="text-xl font-semibold mb-6 text-center">
          ¿Qué sigue ahora?
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Revisa tu email</h3>
              <p className="text-zinc-400 text-sm">
                Hemos enviado tu guía y los detalles de acceso a tu correo.
                Si no lo ves en la bandeja de entrada, revisa spam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Descarga tu guía</h3>
              <p className="text-zinc-400 text-sm">
                El email incluye un enlace directo para acceder a tu guía
                OpenClaw para Filmmakers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-medium mb-1">¿Compraste el bundle?</h3>
              <p className="text-zinc-400 text-sm">
                Si elegiste la opción con sesión 1:1, también encontrarás
                instrucciones para agendar tu consultoría personalizada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soporte */}
      <div className="text-zinc-500 text-sm mb-8">
        ¿Tienes alguna pregunta?{' '}
        <a
          href="mailto:alberto@tuvideopromocional.es"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Contáctanos
        </a>
      </div>

      {/* CTA Volver */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
      >
        Volver al inicio
      </Link>
    </>
  );
}

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Suspense fallback={
          <>
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ¡Gracias por tu compra!
            </h1>
            <p className="text-xl text-zinc-400">Cargando detalles...</p>
          </>
        }>
          <GraciasContent />
        </Suspense>
      </div>
    </div>
  );
}
