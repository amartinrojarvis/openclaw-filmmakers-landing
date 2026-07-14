import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addCalendarDays,
  normalizeIafPurchase,
  STRIPE_PRICE_IDS,
  type RawStripePurchase,
} from '../lib/admin-students';

function purchase(overrides: Partial<RawStripePurchase> = {}): RawStripePurchase {
  return {
    id: 'cs_live_real',
    paymentStatus: 'paid',
    createdAt: '2026-07-14T11:37:59.000Z',
    customerName: 'Sergio',
    customerEmail: 'sergio@example.com',
    amountTotal: 19900,
    currency: 'eur',
    priceIds: [STRIPE_PRICE_IDS.ASESORIA_90M, STRIPE_PRICE_IDS.ASESORIA_FOLLOWUP_30D],
    metadata: {},
    ...overrides,
  };
}

test('rechaza sesiones no pagadas o sin Price IDs de IAF', () => {
  assert.equal(normalizeIafPurchase(purchase({ paymentStatus: 'unpaid' }), '2026-07-14'), null);
  assert.equal(normalizeIafPurchase(purchase({ priceIds: ['price_otro_negocio'] }), '2026-07-14'), null);
});

test('clasifica el acompañamiento real y no inventa vencimiento sin fecha inicial', () => {
  const result = normalizeIafPurchase(purchase(), '2026-07-14');
  assert.ok(result);
  assert.equal(result.productKind, 'followup_30d');
  assert.equal(result.productLabel, 'Sesión 1:1 + acompañamiento 30 días');
  assert.equal(result.serviceStart, null);
  assert.equal(result.serviceEnd, null);
  assert.equal(result.accessState, 'pending_start');
});

test('calcula 30 días naturales desde la sesión inicial', () => {
  assert.equal(addCalendarDays('2026-07-20', 30), '2026-08-19');
  const result = normalizeIafPurchase(purchase({ metadata: { iaf_service_start: '2026-07-20' } }), '2026-08-01');
  assert.ok(result);
  assert.equal(result.serviceEnd, '2026-08-19');
  assert.equal(result.accessState, 'active');
  assert.equal(result.daysRemaining, 18);
});

test('marca el acompañamiento como vencido después de su fecha final', () => {
  const result = normalizeIafPurchase(purchase({ metadata: { iaf_service_start: '2026-07-20' } }), '2026-08-20');
  assert.ok(result);
  assert.equal(result.accessState, 'expired');
  assert.equal(result.daysRemaining, 0);
});

test('la sesión de 90 minutos y los productos digitales no inventan caducidad', () => {
  const session = normalizeIafPurchase(purchase({ priceIds: [STRIPE_PRICE_IDS.ASESORIA_90M] }), '2026-07-14');
  const guide = normalizeIafPurchase(purchase({ priceIds: [STRIPE_PRICE_IDS.GUIA] }), '2026-07-14');
  assert.equal(session?.productKind, 'session_90m');
  assert.equal(session?.serviceEnd, null);
  assert.equal(guide?.productKind, 'guia');
  assert.equal(guide?.accessState, 'lifetime');
});
