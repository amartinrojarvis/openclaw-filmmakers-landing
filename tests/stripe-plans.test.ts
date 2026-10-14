import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advisorySeatsRemaining,
  getAdvisoryPlanFromPriceIds,
  isCompletedPaidCheckout,
  STRIPE_PRICE_IDS,
} from '../lib/stripe';

const monthly = STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY;
const legacyMonthly = STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY_LEGACY_149;
const setup = STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_SETUP;

test('la oferta actual acepta únicamente el precio recurrente de 199 €/mes', () => {
  assert.equal(getAdvisoryPlanFromPriceIds([monthly], 'subscription'), 'subscription_monthly');
  assert.equal(getAdvisoryPlanFromPriceIds([monthly]), 'subscription_monthly');
});

test('conserva la oferta histórica de 149 €/mes + 50 € de inicio en ambos órdenes', () => {
  assert.equal(getAdvisoryPlanFromPriceIds([legacyMonthly, setup], 'subscription'), 'subscription_monthly');
  assert.equal(getAdvisoryPlanFromPriceIds([setup, legacyMonthly], 'subscription'), 'subscription_monthly');
});

test('rechaza precios históricos aislados, mezclas entre ofertas y mode=payment', () => {
  assert.equal(getAdvisoryPlanFromPriceIds([legacyMonthly], 'subscription'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([setup], 'subscription'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([monthly, setup], 'subscription'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([monthly, legacyMonthly], 'subscription'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([monthly], 'payment'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([legacyMonthly, setup], 'payment'), null);
});

test('conserva las modalidades históricas únicamente en mode=payment', () => {
  assert.equal(getAdvisoryPlanFromPriceIds([STRIPE_PRICE_IDS.ASESORIA_90M], 'payment'), 'session_90m');
  assert.equal(
    getAdvisoryPlanFromPriceIds([STRIPE_PRICE_IDS.ASESORIA_FOLLOWUP_30D, STRIPE_PRICE_IDS.ASESORIA_90M], 'payment'),
    'followup_30d',
  );
  assert.equal(getAdvisoryPlanFromPriceIds([STRIPE_PRICE_IDS.ASESORIA_90M], 'subscription'), null);
});

test('sólo acepta checkouts completos y pagados; no-payment se limita a metadata QA', () => {
  assert.equal(isCompletedPaidCheckout({ status: 'complete', payment_status: 'paid' }), true);
  assert.equal(isCompletedPaidCheckout({ status: 'open', payment_status: 'paid' }), false);
  assert.equal(isCompletedPaidCheckout({ status: 'complete', payment_status: 'unpaid' }), false);
  assert.equal(isCompletedPaidCheckout({ status: 'complete', payment_status: 'no_payment_required' }), false);
  assert.equal(isCompletedPaidCheckout({
    status: 'complete',
    payment_status: 'no_payment_required',
    metadata: { qa: 'true' },
  }), true);
});

test('descuenta la plaza liberada: 3 sesiones completadas dejan 3 de 5', () => {
  assert.equal(advisorySeatsRemaining(3), 3);
  assert.equal(advisorySeatsRemaining(0), 5);
  assert.equal(advisorySeatsRemaining(6), 0);
});
