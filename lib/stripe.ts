// Cliente Stripe configurado para servidor
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Inicialización lazy - no falla en build time
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no está configurada');
    }
    stripeInstance = new Stripe(stripeSecretKey, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export singleton para compatibilidad
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

// Precios de productos (hardcodeados para evitar problemas de env vars en Vercel)
export const STRIPE_PRICE_IDS = {
  GUIA: 'price_1TJtMYHBqq0IP9Ia8lI2iME2',
  BUNDLE: 'price_1TJtMrHBqq0IP9IaH2MHxqtv',
};

// Mapeo de price_id a tipo de producto
export function getProductTypeFromPriceId(priceId: string): 'guia' | 'bundle' | null {
  if (priceId === STRIPE_PRICE_IDS.GUIA) return 'guia';
  if (priceId === STRIPE_PRICE_IDS.BUNDLE) return 'bundle';
  return null;
}
