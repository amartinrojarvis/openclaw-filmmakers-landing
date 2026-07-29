import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAdvisoryPlanFromPriceIds,
  isCompletedPaidCheckout,
  STRIPE_PRICE_IDS,
} from '../lib/stripe';

const monthly = STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY;
const setup = STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_SETUP;

test('la suscripción exige monthly + setup, acepta ambos órdenes y mode=subscription', () => {
  assert.equal(getAdvisoryPlanFromPriceIds([monthly, setup], 'subscription'), 'subscription_monthly');
  assert.equal(getAdvisoryPlanFromPriceIds([setup, monthly], 'subscription'), 'subscription_monthly');
});

test('rechaza monthly o setup aislados y la combinación en mode=payment', () => {
  assert.equal(getAdvisoryPlanFromPriceIds([monthly], 'subscription'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([setup], 'subscription'), null);
  assert.equal(getAdvisoryPlanFromPriceIds([monthly, setup], 'payment'), null);
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
