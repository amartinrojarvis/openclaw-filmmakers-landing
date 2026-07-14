import 'server-only';

import Stripe from 'stripe';
import { getStripe } from './stripe';
import {
  addCalendarDays,
  normalizeIafPurchase,
  type IafPurchase,
  type RawStripePurchase,
} from './admin-students';

const MAX_SESSION_PAGES = 5;
const PAGE_SIZE = 100;
const UPDATE_STATUSES = new Set(['pending', 'scheduled', 'active', 'completed', 'cancelled']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function madridDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

async function mapConcurrent<T, U>(items: T[], limit: number, worker: (item: T) => Promise<U>): Promise<U[]> {
  const results = new Array<U>(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function listCompletedSessions(): Promise<Stripe.Checkout.Session[]> {
  const stripe = getStripe();
  const sessions: Stripe.Checkout.Session[] = [];
  let startingAfter: string | undefined;
  for (let page = 0; page < MAX_SESSION_PAGES; page += 1) {
    const response = await stripe.checkout.sessions.list({
      limit: PAGE_SIZE,
      status: 'complete',
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    sessions.push(...response.data.filter((session) => session.payment_status === 'paid'));
    if (!response.has_more || response.data.length === 0) break;
    startingAfter = response.data.at(-1)?.id;
  }
  return sessions;
}

async function toRawPurchase(session: Stripe.Checkout.Session): Promise<RawStripePurchase> {
  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, { limit: 20 });
  return {
    id: session.id,
    paymentStatus: session.payment_status,
    createdAt: new Date(session.created * 1000).toISOString(),
    customerName: session.customer_details?.name || null,
    customerEmail: session.customer_details?.email || session.customer_email || null,
    amountTotal: session.amount_total,
    currency: session.currency,
    priceIds: lineItems.data.map((item) => item.price?.id).filter((id): id is string => Boolean(id)),
    descriptions: lineItems.data.flatMap((item) => item.description ? [item.description] : []),
    metadata: session.metadata || {},
  };
}

export async function listIafPurchases(): Promise<IafPurchase[]> {
  const sessions = await listCompletedSessions();
  const raw = await mapConcurrent(sessions, 8, toRawPurchase);
  const today = madridDate();
  return raw
    .map((purchase) => normalizeIafPurchase(purchase, today))
    .filter((purchase): purchase is IafPurchase => Boolean(purchase))
    .sort((a, b) => Date.parse(b.purchasedAt) - Date.parse(a.purchasedAt));
}

export interface StudentUpdate {
  serviceStart: string;
  serviceEnd: string;
  status: string;
  note: string;
}

function validCivilDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  try {
    return addCalendarDays(value, 0) === value;
  } catch {
    return false;
  }
}

export async function updateIafPurchase(sessionId: string, update: StudentUpdate): Promise<void> {
  if (!/^cs_(?:live|test)_/.test(sessionId)) throw new Error('Referencia de compra inválida');
  const serviceStart = update.serviceStart.trim();
  const requestedEnd = update.serviceEnd.trim();
  const status = update.status.trim();
  const note = update.note.trim().slice(0, 500);
  if (serviceStart && !validCivilDate(serviceStart)) throw new Error('Fecha de inicio inválida');
  if (requestedEnd && !validCivilDate(requestedEnd)) throw new Error('Fecha final inválida');
  if (!UPDATE_STATUSES.has(status)) throw new Error('Estado inválido');

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const raw = await toRawPurchase(session);
  const existing = normalizeIafPurchase(raw, madridDate());
  if (!existing) throw new Error('La compra no pertenece a IA para Filmmakers o no está pagada');

  let serviceEnd = requestedEnd;
  if (existing.productKind === 'followup_30d' && serviceStart && !serviceEnd) {
    serviceEnd = addCalendarDays(serviceStart, 30);
  }
  if (serviceStart && serviceEnd && serviceEnd < serviceStart) throw new Error('La fecha final no puede ser anterior al inicio');

  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      iaf_service_start: serviceStart,
      iaf_service_end: serviceEnd,
      iaf_admin_status: status,
      iaf_admin_note: note,
      iaf_admin_updated_at: new Date().toISOString(),
    },
  });
}
