// Ejemplo de integración de botones de compra en la landing page
// Este archivo es de referencia - copia el código a donde lo necesites

'use client';

import { useCheckout, useKitSubscription } from '@/hooks/useCheckout';
import { useState } from 'react';

// IDs de precios (en producción vienen de variables de entorno)
const PRICE_ID_GUIA = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_GUIA || '';
const PRICE_ID_BUNDLE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUNDLE || '';

/**
 * Botón de compra para un producto específico
 */
export function BuyButton({
  priceId,
  email,
  children,
  className,
}: {
  priceId: string;
  email?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { checkout, loading, error } = useCheckout();

  return (
    <div>
      <button
        onClick={() => checkout({ priceId, email })}
        disabled={loading}
        className={className}
      >
        {loading ? 'Cargando...' : children}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

/**
 * Formulario de captura de leads
 */
export function LeadCaptureForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const { subscribe, loading, success, error } = useKitSubscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) subscribe(email);
  };

  if (success) {
    return (
      <div className="p-4 bg-green-500/20 rounded-lg text-green-400">
        ¡Gracias por suscribirte! Revisa tu email.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? '...' : 'Suscribirse'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
}

/**
 * Ejemplo de sección de precios con botones de compra
 */
export function PricingSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Producto 1: Guía */}
        <div className="p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="text-2xl font-bold mb-2">Guía OpenClaw</h3>
          <p className="text-4xl font-bold text-white mb-4">29€</p>
          <ul className="space-y-2 mb-8 text-zinc-400">
            <li>✓ Guía completa en PDF</li>
            <li>✓ Casos de uso prácticos</li>
            <li>✓ Checklists de implementación</li>
          </ul>
          <BuyButton
            priceId={PRICE_ID_GUIA}
            className="w-full py-4 bg-white text-zinc-950 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
          >
            Comprar Guía
          </BuyButton>
        </div>

        {/* Producto 2: Bundle */}
        <div className="p-8 bg-zinc-900 rounded-2xl border border-blue-500/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-sm font-medium">
            Más Popular
          </div>
          <h3 className="text-2xl font-bold mb-2">Guía + Sesión 1:1</h3>
          <p className="text-4xl font-bold text-white mb-4">127€</p>
          <ul className="space-y-2 mb-8 text-zinc-400">
            <li>✓ Todo lo de la guía</li>
            <li>✓ Sesión personalizada 30 min</li>
            <li>✓ Hoja de ruta personalizada</li>
          </ul>
          <BuyButton
            priceId={PRICE_ID_BUNDLE}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors"
          >
            Comprar Bundle
          </BuyButton>
        </div>

      </div>

      {/* Captura de leads */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4">
          ¿Quieres recibir contenido exclusivo?
        </h3>
        <LeadCaptureForm className="max-w-md mx-auto" />
      </div>
    </section>
  );
}
