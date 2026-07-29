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
  ASESORIA_SUBSCRIPTION_MONTHLY: 'price_1TyUcwHBqq0IP9Iawcxyo0Xk',
  ASESORIA_SUBSCRIPTION_SETUP: 'price_1TyUcxHBqq0IP9IaZQqnJoH7',
} as const;

export const ASESORIA_TOTAL_CAPACITY = 5;

export const ASESORIA_PAYMENT_LINK_IDS = {
  LEGACY_INTERNAL: 'plink_1Tsp3cHBqq0IP9IaoAA8S5V4',
  SESSION: 'plink_1TsqfXHBqq0IP9IaxQATOphF',
  FOLLOWUP_30D_HISTORICAL: 'plink_1TsqhSHBqq0IP9IaUPaBVmzO',
  SUBSCRIPTION: 'plink_1TyUdYHBqq0IP9IaePZYy78D',
} as const;

export const ASESORIA_PAYMENT_LINKS = {
  SESSION: 'https://book.stripe.com/9B69AT0Tr3CMgAFdqU8og0n',
  SUBSCRIPTION: 'https://buy.stripe.com/4gM4gzdGd6OYesx0E88og0p',
} as const;

export const ASESORIA_PORTAL_LOGIN_URL = 'https://billing.stripe.com/p/login/5kQ28rfOl8X698d72w8og00';
export const ASESORIA_PAYMENT_LINK_ID = ASESORIA_PAYMENT_LINK_IDS.SESSION;

export type ProductType = 'guia' | 'bundle' | 'asesoria_90m';
export type AdvisoryPlanKind = 'session_90m' | 'followup_30d' | 'subscription_monthly';

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

export function isAdvisorySubscriptionPriceId(priceId?: string | null): boolean {
  return priceId === STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY;
}

export function isAdvisoryCheckoutPriceId(priceId?: string | null): boolean {
  return isAdvisoryBasePriceId(priceId) || isAdvisorySubscriptionPriceId(priceId);
}

export function isAdvisoryPriceId(priceId?: string | null): boolean {
  return isAdvisoryCheckoutPriceId(priceId)
    || priceId === STRIPE_PRICE_IDS.ASESORIA_FOLLOWUP_30D
    || priceId === STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_SETUP;
}

export function getAdvisoryPlanFromPriceIds(
  priceIds: Array<string | null | undefined>,
  mode?: string | null,
): AdvisoryPlanKind | null {
  const ids = new Set(priceIds.filter((id): id is string => Boolean(id)));
  const hasMonthly = ids.has(STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY);
  const hasSetup = ids.has(STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_SETUP);
  if (hasMonthly || hasSetup) {
    return hasMonthly && hasSetup && (!mode || mode === 'subscription') ? 'subscription_monthly' : null;
  }
  const hasBase = ids.has(STRIPE_PRICE_IDS.ASESORIA_90M) || ids.has(STRIPE_PRICE_IDS.ASESORIA_90M_LEGACY);
  if (hasBase && mode && mode !== 'payment') return null;
  if (hasBase && ids.has(STRIPE_PRICE_IDS.ASESORIA_FOLLOWUP_30D)) return 'followup_30d';
  if (hasBase) return 'session_90m';
  return null;
}

export function isCompletedPaidCheckout(session: {
  status?: string | null;
  payment_status?: string | null;
  metadata?: Record<string, string> | null;
}): boolean {
  if (session.status !== 'complete') return false;
  if (session.payment_status === 'paid') return true;
  return session.metadata?.qa === 'true' && session.payment_status === 'no_payment_required';
}

const CAPACITY_PAYMENT_LINK_IDS = [
  ASESORIA_PAYMENT_LINK_IDS.SESSION,
  ASESORIA_PAYMENT_LINK_IDS.FOLLOWUP_30D_HISTORICAL,
  ASESORIA_PAYMENT_LINK_IDS.SUBSCRIPTION,
] as const;

const ACTIVE_PAYMENT_LINK_IDS = new Set<string>([
  ASESORIA_PAYMENT_LINK_IDS.SESSION,
  ASESORIA_PAYMENT_LINK_IDS.SUBSCRIPTION,
]);

export async function getAdvisoryInventory() {
  const stripe = getStripe();
  // LEGACY_INTERNAL contiene una única compra de prueba del administrador y no ocupa plaza comercial.
  const links = await Promise.all(CAPACITY_PAYMENT_LINK_IDS.map((id) => stripe.paymentLinks.retrieve(id)));
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

  for (const link of inventory.links) {
    if (!ACTIVE_PAYMENT_LINK_IDS.has(link.id)) {
      if (link.active) await stripe.paymentLinks.update(link.id, { active: false });
      continue;
    }

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
