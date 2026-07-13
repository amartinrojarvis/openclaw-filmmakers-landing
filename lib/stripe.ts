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
  ASESORIA_90M: 'price_1TsqetHBqq0IP9IaH7Cf2Xvm',
  ASESORIA_90M_LEGACY: 'price_1Tso8FHBqq0IP9IapfvQzXOn',
  ASESORIA_FOLLOWUP_30D: 'price_1TsqeuHBqq0IP9IabgDp0Zrr',
};

export const ASESORIA_TOTAL_CAPACITY = 5;

export const ASESORIA_PAYMENT_LINK_IDS = {
  LEGACY: 'plink_1Tsp3cHBqq0IP9IaoAA8S5V4',
  SESSION: 'plink_1TsqfXHBqq0IP9IaxQATOphF',
  FOLLOWUP_30D: 'plink_1TsqhSHBqq0IP9IaUPaBVmzO',
} as const;

export const ASESORIA_PAYMENT_LINK_ID = ASESORIA_PAYMENT_LINK_IDS.SESSION;

export type ProductType = 'guia' | 'bundle' | 'asesoria_90m';

// Mapeo de price_id a tipo de producto.
// Se conservan los productos anteriores para que los webhooks históricos sigan siendo procesables.
export function getProductTypeFromPriceId(priceId: string): ProductType | null {
  if (priceId === STRIPE_PRICE_IDS.GUIA) return 'guia';
  if (priceId === STRIPE_PRICE_IDS.BUNDLE) return 'bundle';
  if (isAdvisoryPriceId(priceId)) return 'asesoria_90m';
  return null;
}

export function isAdvisoryBasePriceId(priceId?: string | null): boolean {
  return priceId === STRIPE_PRICE_IDS.ASESORIA_90M || priceId === STRIPE_PRICE_IDS.ASESORIA_90M_LEGACY;
}

export function isAdvisoryPriceId(priceId?: string | null): boolean {
  return isAdvisoryBasePriceId(priceId) || priceId === STRIPE_PRICE_IDS.ASESORIA_FOLLOWUP_30D;
}

export async function getAdvisoryInventory() {
  const stripe = getStripe();
  const links = await Promise.all(
    Object.values(ASESORIA_PAYMENT_LINK_IDS).map((id) => stripe.paymentLinks.retrieve(id)),
  );
  const completed = links.reduce(
    (total, link) => total + (link.restrictions?.completed_sessions?.count || 0),
    0,
  );

  return {
    completed,
    remaining: Math.max(0, ASESORIA_TOTAL_CAPACITY - completed),
    links,
  };
}

export async function syncAdvisoryCapacity() {
  const stripe = getStripe();
  const inventory = await getAdvisoryInventory();

  for (const link of inventory.links.filter((item) => item.id !== ASESORIA_PAYMENT_LINK_IDS.LEGACY)) {
    const count = link.restrictions?.completed_sessions?.count || 0;
    if (inventory.remaining === 0) {
      if (link.active) await stripe.paymentLinks.update(link.id, { active: false });
      continue;
    }

    await stripe.paymentLinks.update(link.id, {
      active: true,
      restrictions: { completed_sessions: { limit: count + inventory.remaining } },
    });
  }

  return inventory;
}
