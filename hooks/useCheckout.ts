'use client';

import { useState } from 'react';

interface UseCheckoutOptions {
  priceId: string;
  email?: string;
}

interface CheckoutState {
  loading: boolean;
  error: string | null;
}

/**
 * Hook para iniciar el checkout de Stripe
 * 
 * Ejemplo de uso:
 * ```tsx
 * const { checkout, loading, error } = useCheckout();
 * 
 * // En tu componente:
 * <button onClick={() => checkout({ priceId: 'price_xxxxx', email: userEmail })}>
 *   Comprar ahora
 * </button>
 * ```
 */
export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    loading: false,
    error: null,
  });

  const checkout = async ({ priceId, email }: UseCheckoutOptions) => {
    setState({ loading: true, error: null });

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de pago');
      }

      // Redirigir al checkout de Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setState({ loading: false, error: message });
    }
  };

  return {
    checkout,
    loading: state.loading,
    error: state.error,
  };
}

/**
 * Hook para capturar leads en Kit
 * 
 * Ejemplo de uso:
 * ```tsx
 * const { subscribe, loading, success } = useKitSubscription();
 * 
 * // En tu formulario:
 * <form onSubmit={(e) => {
 *   e.preventDefault();
 *   subscribe(email);
 * }}>
 *   <input value={email} onChange={...} />
 *   <button type="submit">Suscribirse</button>
 * </form>
 * ```
 */
export function useKitSubscription() {
  const [state, setState] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
  }>({
    loading: false,
    success: false,
    error: null,
  });

  const subscribe = async (email: string) => {
    setState({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/kit/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al suscribir');
      }

      setState({ loading: false, success: true, error: null });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setState({ loading: false, success: false, error: message });
    }
  };

  return {
    subscribe,
    loading: state.loading,
    success: state.success,
    error: state.error,
  };
}
