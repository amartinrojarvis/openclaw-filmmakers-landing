import { ADMIN_EMAIL } from './admin-auth-token';
import { STRIPE_PRICE_IDS as CORE_STRIPE_PRICE_IDS } from './stripe';

export const STRIPE_PRICE_IDS = CORE_STRIPE_PRICE_IDS;

export type ProductKind = 'guia' | 'bundle' | 'session_90m' | 'followup_30d' | 'subscription_monthly';
export type AccessState = 'pending_start' | 'active' | 'past_due' | 'expired' | 'completed' | 'cancelled' | 'session_pending' | 'lifetime';
export type AdminStatus = 'pending' | 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface RawStripePurchase {
  id: string;
  paymentStatus: string | null;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  priceIds: string[];
  descriptions?: string[];
  metadata: Record<string, string>;
  subscriptionStatus?: string | null;
  subscriptionCancelAtPeriodEnd?: boolean;
  subscriptionCurrentPeriodEnd?: string | null;
}

export interface IafPurchase {
  id: string;
  customerName: string;
  customerEmail: string;
  purchasedAt: string;
  amountTotal: number;
  currency: string;
  productKind: ProductKind;
  productLabel: string;
  serviceStart: string | null;
  serviceEnd: string | null;
  daysRemaining: number | null;
  accessState: AccessState;
  adminStatus: AdminStatus;
  intakeSubmitted: boolean;
  intakeSubmittedAt: string | null;
  adminNote: string;
  isInternal: boolean;
  subscriptionStatus: string | null;
  cancelAtPeriodEnd: boolean;
}

const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;
const KNOWN_PRICE_IDS = new Set<string>(Object.values(STRIPE_PRICE_IDS));

export function addCalendarDays(date: string, days: number): string {
  if (!VALID_DATE.test(date)) throw new Error('Fecha civil inválida');
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(value.getTime())) throw new Error('Fecha civil inválida');
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00.000Z`);
  const end = Date.parse(`${to}T00:00:00.000Z`);
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function classifyProduct(priceIds: string[]): ProductKind | null {
  const ids = new Set(priceIds);
  if (ids.has(STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY)) return 'subscription_monthly';
  const hasBaseAdvisory = ids.has(STRIPE_PRICE_IDS.ASESORIA_90M) || ids.has(STRIPE_PRICE_IDS.ASESORIA_90M_LEGACY);
  if (hasBaseAdvisory && ids.has(STRIPE_PRICE_IDS.ASESORIA_FOLLOWUP_30D)) return 'followup_30d';
  if (hasBaseAdvisory) return 'session_90m';
  if (ids.has(STRIPE_PRICE_IDS.BUNDLE)) return 'bundle';
  if (ids.has(STRIPE_PRICE_IDS.GUIA)) return 'guia';
  return null;
}

function productLabel(kind: ProductKind): string {
  if (kind === 'subscription_monthly') return 'Suscripción mensual · implementación';
  if (kind === 'followup_30d') return 'Sesión 1:1 + implementación inicial';
  if (kind === 'session_90m') return 'Sesión estratégica de 90 minutos';
  if (kind === 'bundle') return 'Bundle IA para Filmmakers';
  return 'Guía IA para Filmmakers';
}

function isInternalEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized === ADMIN_EMAIL
    || normalized === 'a.martinro.jarvis@gmail.com'
    || normalized.startsWith('a.martinro.jarvis+stripeqa@');
}

export function normalizeIafPurchase(raw: RawStripePurchase, today: string): IafPurchase | null {
  if (raw.paymentStatus !== 'paid' || !raw.priceIds.some((id) => KNOWN_PRICE_IDS.has(id))) return null;
  const kind = classifyProduct(raw.priceIds);
  if (!kind) return null;

  const metadata = raw.metadata || {};
  const start = VALID_DATE.test(metadata.iaf_service_start || '') ? metadata.iaf_service_start : null;
  const explicitEnd = VALID_DATE.test(metadata.iaf_service_end || '') ? metadata.iaf_service_end : null;
  const subscriptionStatus = raw.subscriptionStatus || metadata.iaf_subscription_status || null;
  const cancelAtPeriodEnd = raw.subscriptionCancelAtPeriodEnd ?? metadata.iaf_cancel_at_period_end === 'true';
  const periodEndValue = raw.subscriptionCurrentPeriodEnd || metadata.iaf_current_period_end || '';
  const periodEnd = periodEndValue && !Number.isNaN(Date.parse(periodEndValue)) ? periodEndValue.slice(0, 10) : null;
  let end = kind === 'followup_30d' && start ? explicitEnd || addCalendarDays(start, 30) : explicitEnd;
  const storedStatus = metadata.iaf_admin_status;
  let accessState: AccessState;
  let daysRemaining: number | null = null;

  if (kind === 'subscription_monthly') {
    if (subscriptionStatus === 'canceled' || subscriptionStatus === 'incomplete_expired') {
      accessState = 'cancelled';
      end = periodEnd;
    } else if (subscriptionStatus === 'past_due' || subscriptionStatus === 'unpaid') {
      accessState = 'past_due';
      end = periodEnd;
    } else if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
      accessState = 'active';
      end = cancelAtPeriodEnd ? periodEnd : null;
      if (end) daysRemaining = daysBetween(today, end);
    } else {
      accessState = 'pending_start';
      end = periodEnd;
    }
  } else if (storedStatus === 'cancelled') {
    accessState = 'cancelled';
  } else if (storedStatus === 'completed') {
    accessState = 'completed';
  } else if (kind === 'followup_30d') {
    if (!start || !end) {
      accessState = 'pending_start';
    } else if (today > end) {
      accessState = 'expired';
      daysRemaining = 0;
    } else {
      accessState = 'active';
      daysRemaining = daysBetween(today, end);
    }
  } else if (kind === 'session_90m') {
    accessState = storedStatus === 'active' || storedStatus === 'scheduled' ? 'active' : 'session_pending';
  } else {
    accessState = 'lifetime';
  }

  const derivedAdminStatus: AdminStatus = accessState === 'active'
    ? 'active'
    : accessState === 'cancelled'
      ? 'cancelled'
      : 'pending';
  const adminStatus = storedStatus === 'scheduled' || storedStatus === 'active' || storedStatus === 'completed' || storedStatus === 'cancelled'
    ? storedStatus
    : derivedAdminStatus;

  return {
    id: raw.id,
    customerName: raw.customerName?.trim() || 'Sin nombre',
    customerEmail: raw.customerEmail?.trim().toLowerCase() || 'Sin email',
    purchasedAt: raw.createdAt,
    amountTotal: raw.amountTotal || 0,
    currency: raw.currency || 'eur',
    productKind: kind,
    productLabel: productLabel(kind),
    serviceStart: start,
    serviceEnd: end,
    daysRemaining,
    accessState,
    adminStatus,
    intakeSubmitted: metadata.intake_submitted === 'true',
    intakeSubmittedAt: metadata.intake_submitted_at || null,
    adminNote: (metadata.iaf_admin_note || '').slice(0, 500),
    isInternal: isInternalEmail(raw.customerEmail || ''),
    subscriptionStatus,
    cancelAtPeriodEnd,
  };
}
