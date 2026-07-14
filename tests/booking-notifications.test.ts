import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bookingNotificationMetadata,
  hasSentBookingNotification,
  notificationIdempotencyKey,
} from '../lib/booking-notifications';

process.env.BREVO_API_KEY = 'test-brevo-key';

test('la clave de idempotencia es estable por evento y destinatario', () => {
  const first = notificationIdempotencyKey('evt_booking_123', 'admin');
  assert.equal(first, notificationIdempotencyKey('evt_booking_123', 'admin'));
  assert.notEqual(first, notificationIdempotencyKey('evt_booking_123', 'customer'));
  assert.notEqual(first, notificationIdempotencyKey('evt_booking_456', 'admin'));
});

test('reconoce y construye la marca persistente de notificación en Stripe', () => {
  assert.equal(hasSentBookingNotification({}), false);
  assert.equal(hasSentBookingNotification({ iaf_booking_notification_sent: 'false' }), false);
  assert.equal(hasSentBookingNotification({ iaf_booking_notification_sent: 'true' }), true);

  assert.deepEqual(bookingNotificationMetadata('evt_booking_123', '2026-07-14T16:00:00.000Z'), {
    iaf_booking_notification_sent: 'true',
    iaf_booking_notification_event_id: 'evt_booking_123',
    iaf_booking_notification_sent_at: '2026-07-14T16:00:00.000Z',
  });
});

test('Brevo recibe Idempotency-Key en el payload del correo transaccional', async () => {
  const { sendDirectBrevoEmail } = await import('../lib/brevo');
  const originalFetch = global.fetch;
  let requestBody: Record<string, unknown> | undefined;

  global.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    requestBody = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ messageId: 'test-message' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const result = await sendDirectBrevoEmail({
      to: [{ email: 'buyer@example.com' }],
      subject: 'Reserva de prueba',
      htmlContent: '<p>Prueba</p>',
      idempotencyKey: 'iaf-evt_booking_123-customer',
    });

    assert.equal(result.success, true);
    assert.deepEqual(requestBody?.headers, {
      'Idempotency-Key': 'iaf-evt_booking_123-customer',
    });
  } finally {
    global.fetch = originalFetch;
  }
});
